// Resource search + booking screen (farmers), and the "list a resource"
// form with availability windows (providers only -- a farmer who wants to
// list equipment needs a separate provider account).
import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import ResourceCard from '../components/ResourceCard';
import apiRequest from '../api/client';

const TYPES = ['tractor', 'harvester', 'pump', 'rotavator', 'trailer', 'service'];

export default function ResourceSearch() {
  const [profile, setProfile] = useState(null);
  const [resources, setResources] = useState([]);
  const [type, setType] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const [bookingFor, setBookingFor] = useState(null);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [isGroup, setIsGroup] = useState(false);
  const [groupIds, setGroupIds] = useState('');
  const [bookingMessage, setBookingMessage] = useState('');

  const [showListForm, setShowListForm] = useState(false);
  const [listForm, setListForm] = useState({ type: 'tractor', description: '', usage_charge: '', latitude: '', longitude: '' });
  const [listMessage, setListMessage] = useState('');
  const [listSubmitting, setListSubmitting] = useState(false);
  const [availabilityFor, setAvailabilityFor] = useState(null);
  const [availWindows, setAvailWindows] = useState([]);
  const [availStart, setAvailStart] = useState('');
  const [availEnd, setAvailEnd] = useState('');

  const token = localStorage.getItem('agriaid_token');

  useEffect(() => {
    apiRequest('/profile', { token }).then(setProfile).catch(() => setProfile(null));
  }, []);

  const isProvider = profile?.role === 'provider';
  const isFarmer = profile?.role !== 'provider';

  function loadResources() {
    setLoading(true);
    const params = new URLSearchParams();
    if (type) params.set('type', type);
    if (isProvider && profile) params.set('provider_id', profile.id);
    apiRequest(`/resources?${params.toString()}`)
      .then((data) => setResources(data.results || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => { if (profile) loadResources(); }, [type, profile]);

  async function submitBooking(e) {
    e.preventDefault();
    setBookingMessage('');
    try {
      await apiRequest('/bookings', {
        method: 'POST',
        token,
        body: {
          resource_id: bookingFor.id,
          start_time: startTime,
          end_time: endTime,
          is_group_booking: isGroup,
          group_member_ids: isGroup ? groupIds.split(',').map((s) => s.trim()).filter(Boolean) : undefined,
        },
      });
      setBookingMessage('Booking request sent -- the provider will accept or reject it from their Bookings page.');
      setBookingFor(null);
      setStartTime('');
      setEndTime('');
      setIsGroup(false);
      setGroupIds('');
    } catch (err) {
      setBookingMessage(err.message);
    }
  }

  function updateListForm(field) {
    return (e) => setListForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function submitListing(e) {
    e.preventDefault();
    setListMessage('');
    setListSubmitting(true);
    try {
      await apiRequest('/resources', {
        method: 'POST',
        token,
        body: {
          type: listForm.type,
          description: listForm.description,
          usage_charge: Number(listForm.usage_charge),
          latitude: listForm.latitude ? Number(listForm.latitude) : undefined,
          longitude: listForm.longitude ? Number(listForm.longitude) : undefined,
        },
      });
      setListMessage('Your resource is now listed below. Add availability windows so farmers know when they can book it.');
      setListForm({ type: 'tractor', description: '', usage_charge: '', latitude: '', longitude: '' });
      setShowListForm(false);
      loadResources();
    } catch (err) {
      setListMessage(err.message);
    } finally {
      setListSubmitting(false);
    }
  }

  function openAvailability(resource) {
    setAvailabilityFor(resource);
    apiRequest(`/resources/${resource.id}/availability`).then((d) => setAvailWindows(d.results || []));
  }

  async function submitAvailability(e) {
    e.preventDefault();
    await apiRequest(`/resources/${availabilityFor.id}/availability`, {
      method: 'POST',
      token,
      body: { start_time: availStart, end_time: availEnd },
    });
    const d = await apiRequest(`/resources/${availabilityFor.id}/availability`);
    setAvailWindows(d.results || []);
    setAvailStart('');
    setAvailEnd('');
  }

  if (!profile) return <Layout><p className="helper-text">Loading…</p></Layout>;

  return (
    <Layout wide>
      <div className="page-head">
        <div>
          <h1>{isProvider ? 'Your listings' : 'Find a resource'}</h1>
          <p>{isProvider ? 'Manage the equipment and services you offer.' : 'Browse equipment and services other farmers in your area have listed.'}</p>
        </div>
        {isProvider && (
          <button type="button" className="btn btn-primary" onClick={() => setShowListForm((s) => !s)}>
            {showListForm ? 'Cancel' : '+ List a resource'}
          </button>
        )}
      </div>

      {!isProvider && (
        <p className="helper-text section-gap" style={{ marginTop: 0 }}>
          Want to list your own equipment? That needs a separate <strong>provider account</strong> — farmer and provider
          identities are kept apart so it's always clear who's asking and who's offering.
        </p>
      )}

      {showListForm && isProvider && (
        <div className="panel">
          <h3>List a resource</h3>
          <form onSubmit={submitListing}>
            <div className="field-row">
              <div className="field">
                <label className="field-label" htmlFor="list-type">Type</label>
                <select id="list-type" className="select" value={listForm.type} onChange={updateListForm('type')}>
                  {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="field">
                <label className="field-label" htmlFor="list-charge">Usage charge (₹/day)</label>
                <input id="list-charge" className="input" type="number" min="0" step="0.01" required
                  value={listForm.usage_charge} onChange={updateListForm('usage_charge')} />
              </div>
            </div>
            <div className="field">
              <label className="field-label" htmlFor="list-desc">Description</label>
              <textarea id="list-desc" className="textarea" placeholder="Make/model, condition, anything a farmer should know"
                value={listForm.description} onChange={updateListForm('description')} />
            </div>
            <div className="field-row">
              <div className="field">
                <label className="field-label" htmlFor="list-lat">Latitude (optional)</label>
                <input id="list-lat" className="input" type="number" step="any" value={listForm.latitude} onChange={updateListForm('latitude')} />
              </div>
              <div className="field">
                <label className="field-label" htmlFor="list-lng">Longitude (optional)</label>
                <input id="list-lng" className="input" type="number" step="any" value={listForm.longitude} onChange={updateListForm('longitude')} />
              </div>
            </div>
            {listMessage && <p className={listMessage.startsWith('Your') ? 'alert alert-success' : 'alert alert-error'}>{listMessage}</p>}
            <button type="submit" className="btn btn-primary" disabled={listSubmitting}>
              {listSubmitting ? 'Listing…' : 'List this resource'}
            </button>
          </form>
        </div>
      )}

      <div className="field" style={{ marginTop: 24, maxWidth: 240 }}>
        <label className="field-label" htmlFor="type-filter">Filter by type</label>
        <select id="type-filter" className="select" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">All types</option>
          {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {error && <p className="alert alert-error">{error}</p>}
      {bookingMessage && (
        <p className={bookingMessage.startsWith('Booking request sent') ? 'alert alert-success' : 'alert alert-error'}>
          {bookingMessage}
        </p>
      )}

      {loading ? (
        <p className="helper-text">Loading resources…</p>
      ) : resources.length === 0 ? (
        <div className="empty-state">
          {isProvider ? "You haven't listed anything yet." : `No resources listed yet${type ? ` for "${type}"` : ''}.`}
        </div>
      ) : (
        <div className="equipment-grid">
          {resources.map((r) => (
            <div key={r.id}>
              <ResourceCard resource={r} onBook={setBookingFor} showBook={isFarmer} />
              {isProvider && (
                <button type="button" className="btn btn-secondary btn-sm btn-block" style={{ marginTop: 8 }} onClick={() => openAvailability(r)}>
                  Manage availability
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {bookingFor && (
        <div className="panel">
          <h3>Book {bookingFor.type}</h3>
          <form onSubmit={submitBooking}>
            <div className="field-row">
              <div className="field">
                <label className="field-label" htmlFor="start-time">Start</label>
                <input id="start-time" className="input" type="datetime-local" required
                  value={startTime} onChange={(e) => setStartTime(e.target.value)} />
              </div>
              <div className="field">
                <label className="field-label" htmlFor="end-time">End</label>
                <input id="end-time" className="input" type="datetime-local" required
                  value={endTime} onChange={(e) => setEndTime(e.target.value)} />
              </div>
            </div>
            <div className="field">
              <label className="field-label" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input type="checkbox" checked={isGroup} onChange={(e) => setIsGroup(e.target.checked)} />
                Book as a group (split with other farmers)
              </label>
              {isGroup && (
                <input className="input" style={{ marginTop: 8 }} placeholder="Other farmers' user IDs, comma-separated"
                  value={groupIds} onChange={(e) => setGroupIds(e.target.value)} />
              )}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="submit" className="btn btn-primary">Confirm request</button>
              <button type="button" className="btn btn-secondary" onClick={() => setBookingFor(null)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {availabilityFor && (
        <div className="panel">
          <h3>Availability — {availabilityFor.type}</h3>
          <p className="helper-text">Farmers can only book inside windows you add here. No windows yet means the resource looks available anytime.</p>
          <div className="row-list section-gap" style={{ marginTop: 0, marginBottom: 16 }}>
            {availWindows.length === 0 ? (
              <div className="empty-state">No availability windows set.</div>
            ) : availWindows.map((w) => (
              <div key={w.id} className="row-item">
                <div className="row-item-body">
                  <div className="row-item-meta">{new Date(w.start_time).toLocaleString()} → {new Date(w.end_time).toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={submitAvailability}>
            <div className="field-row">
              <div className="field">
                <label className="field-label" htmlFor="avail-start">Available from</label>
                <input id="avail-start" className="input" type="datetime-local" required value={availStart} onChange={(e) => setAvailStart(e.target.value)} />
              </div>
              <div className="field">
                <label className="field-label" htmlFor="avail-end">Until</label>
                <input id="avail-end" className="input" type="datetime-local" required value={availEnd} onChange={(e) => setAvailEnd(e.target.value)} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="submit" className="btn btn-primary">Add window</button>
              <button type="button" className="btn btn-secondary" onClick={() => setAvailabilityFor(null)}>Close</button>
            </div>
          </form>
        </div>
      )}
    </Layout>
  );
}
