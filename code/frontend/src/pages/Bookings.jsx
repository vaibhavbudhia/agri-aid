// Bookings view: farmers see their requests, providers accept/reject
// requests made on their resources.
import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import apiRequest from '../api/client';

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('agriaid_token');

  function load() {
    setLoading(true);
    apiRequest('/bookings', { token })
      .then((data) => setBookings(data.results || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  async function respond(id, status) {
    try {
      await apiRequest(`/bookings/${id}`, { method: 'PATCH', token, body: { status } });
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <Layout wide>
      <h1>My bookings</h1>
      <p>Requests you've made, or requests other farmers have made on your listings.</p>

      {error && <p className="alert alert-error">{error}</p>}

      {loading ? (
        <p className="helper-text">Loading bookings…</p>
      ) : bookings.length === 0 ? (
        <div className="empty-state">No bookings yet. Find a resource to request one.</div>
      ) : (
        <div className="row-list">
          {bookings.map((b) => (
            <div key={b.id} className="row-item">
              <div className="row-item-badge">{(b.resource_type || '?').slice(0, 2).toUpperCase()}</div>
              <div className="row-item-body">
                <div className="row-item-title">
                  {b.resource_type}{b.is_group_booking ? ' · group booking' : ''}
                </div>
                <div className="row-item-meta">
                  {b.farmer_name && <>Requested by {b.farmer_name} · </>}
                  {b.provider_name && <>Provider: {b.provider_name} · </>}
                  {new Date(b.start_time).toLocaleString()} → {new Date(b.end_time).toLocaleString()}
                  {b.usage_charge && <> · ₹{b.usage_charge}/day</>}
                </div>
                {b.group_members?.length > 0 && (
                  <div className="row-item-desc">Splitting with: {b.group_members.map((m) => m.name).join(', ')}</div>
                )}
                {b.status === 'pending' && b.farmer_name && (
                  <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => respond(b.id, 'accepted')}>Accept</button>
                    <button type="button" className="btn btn-danger btn-sm" onClick={() => respond(b.id, 'rejected')}>Reject</button>
                  </div>
                )}
                {b.status === 'accepted' && b.farmer_name && (
                  <div style={{ marginTop: 10 }}>
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => respond(b.id, 'completed')}>Mark completed</button>
                  </div>
                )}
              </div>
              <div className="row-item-action">
                <span className={`status-tag status-${b.status}`}>{b.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}
