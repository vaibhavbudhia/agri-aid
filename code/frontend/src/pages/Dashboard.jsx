import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import ResourceCard from '../components/ResourceCard';
import apiRequest from '../api/client';
import { IconCalendar, IconRupee, IconClock, IconBadge } from '../components/icons';

const greeting = () => {
  const hour = new Date().getHours();
  return hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [resources, setResources] = useState([]);
  const [breakdownQueue, setBreakdownQueue] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('agriaid_token');
    if (!token) { navigate('/login'); return; }
    apiRequest('/profile', { token }).then(setProfile).catch((err) => setError(err.message));
    apiRequest('/bookings', { token }).then((data) => setBookings(data.results || [])).catch(() => {});
  }, [navigate]);

  useEffect(() => {
    if (!profile) return;
    const token = localStorage.getItem('agriaid_token');
    if (profile.role === 'provider') {
      apiRequest(`/resources?provider_id=${profile.id}`).then((data) => setResources((data.results || []).slice(0, 3))).catch(() => {});
      apiRequest('/breakdowns/provider', { token }).then((data) => setBreakdownQueue(data.results || [])).catch(() => {});
    } else {
      apiRequest('/resources').then((data) => setResources((data.results || []).slice(0, 3))).catch(() => {});
    }
  }, [profile]);

  if (error) return <Layout narrow><p className="alert alert-error">{error}</p></Layout>;
  if (!profile) return <Layout narrow><p className="helper-text">Loading…</p></Layout>;

  const isProvider = profile.role === 'provider';
  const activeBookings = bookings.filter((booking) => ['pending', 'accepted'].includes(booking.status));
  const completed = bookings.filter((booking) => booking.status === 'completed');
  const totalSpent = completed.reduce((sum, booking) => sum + Number(booking.usage_charge || 0), 0);
  const openRepairs = breakdownQueue.filter((request) => request.status === 'open').length;
  const firstName = profile.name.split(' ')[0];

  return <Layout wide>
    <section className="dashboard-hero">
      <div>
        <div className="page-eyebrow">{new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })}</div>
        <h1>{greeting()}, {firstName}<span className="dashboard-sun">☀️</span></h1>
        <p>{isProvider ? 'Keep your equipment and service work moving today.' : 'Everything you need for a productive day on the farm.'}</p>
      </div>
      <div className="dashboard-weather"><span>🌤️</span><div><strong>Great day to grow</strong><small>Check your bookings and plan ahead.</small></div></div>
    </section>

    <section className="stat-grid dashboard-stats">
      <div className="stat-card"><div className="stat-card-icon"><IconCalendar /></div><div className="stat-card-label">Active bookings</div><div className="stat-card-value">{activeBookings.length}</div><div className="stat-card-sub">Requests in progress</div></div>
      {isProvider ? <><div className="stat-card"><div className="stat-card-icon"><IconBadge /></div><div className="stat-card-label">Open repair requests</div><div className="stat-card-value">{openRepairs}</div><div className="stat-card-sub">Ready to be picked up</div></div><div className="stat-card"><div className="stat-card-icon"><IconRupee /></div><div className="stat-card-label">Live listings</div><div className="stat-card-value">{resources.length}</div><div className="stat-card-sub">Visible to nearby farmers</div></div></> : <><div className="stat-card"><div className="stat-card-icon"><IconRupee /></div><div className="stat-card-label">Total spent</div><div className="stat-card-value">₹{totalSpent.toLocaleString()}</div><div className="stat-card-sub">On completed bookings</div></div><div className="stat-card"><div className="stat-card-icon"><IconClock /></div><div className="stat-card-label">Completed bookings</div><div className="stat-card-value">{completed.length}</div><div className="stat-card-sub">Equipment jobs finished</div></div></>}
    </section>

    <section className="dashboard-content-grid">
      <div className="dashboard-resources">
        <div className="page-head"><div><div className="page-eyebrow">DISCOVER</div><h2>{isProvider ? 'Your listings' : 'Ready when you are'}</h2></div><Link to="/resources" className="btn btn-secondary btn-sm">{isProvider ? 'Manage listings' : 'Explore equipment'} →</Link></div>
        {resources.length === 0 ? <div className="empty-state dashboard-empty"><span>🌾</span><strong>{isProvider ? 'Start building your catalogue' : 'Nothing nearby just yet'}</strong><p>{isProvider ? 'Add your first equipment or service listing.' : 'Try again later or widen your search area.'}</p><Link to={isProvider ? '/resources' : '/support'} className="btn btn-primary btn-sm">{isProvider ? 'List a resource' : 'Get support'}</Link></div> : <div className="equipment-grid dashboard-equipment">{resources.map((resource) => <ResourceCard key={resource.id} resource={resource} showBook={!isProvider} onBook={() => navigate('/resources')} />)}</div>}
      </div>
      <aside className="dashboard-actions">
        <div className="action-card action-card--primary"><span className="action-card-icon">{isProvider ? '📋' : '🚜'}</span><h3>{isProvider ? 'Manage your work' : 'Need equipment?'}</h3><p>{isProvider ? 'Review listings, availability and incoming work requests.' : 'Browse local machinery and send a booking request in minutes.'}</p><Link className="btn btn-primary btn-sm" to="/resources">{isProvider ? 'My listings' : 'Find equipment'} →</Link></div>
        <div className="action-card"><span className="action-card-icon">🛠️</span><div><h3>Need help?</h3><p>Report a breakdown or reach local support.</p><Link to={isProvider ? '/repair-queue' : '/breakdowns'}>Open support →</Link></div></div>
      </aside>
    </section>
  </Layout>;
}
