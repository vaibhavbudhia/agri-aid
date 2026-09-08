// Provider-side repair request queue: accept, reject, or move an
// assigned request through in-progress -> resolved. Builds the mechanic's
// service history and reputation over time (ratings show up here once
// farmers leave them).
import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import apiRequest from '../api/client';

export default function BreakdownQueue() {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('agriaid_token');

  function load() {
    setLoading(true);
    apiRequest('/breakdowns/provider', { token })
      .then((d) => setRequests(d.results || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  async function act(id, action, body) {
    try {
      await apiRequest(`/breakdowns/${id}/${action}`, { method: 'PATCH', token, body });
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  const resolved = requests.filter((r) => r.status === 'resolved' && r.rating);
  const avgRating = resolved.length
    ? (resolved.reduce((s, r) => s + r.rating, 0) / resolved.length).toFixed(1)
    : null;

  return (
    <Layout wide>
      <div className="page-head">
        <div>
          <h1>Repair queue</h1>
          <p>Open requests any service provider can pick up, plus jobs assigned to you.</p>
        </div>
        {avgRating && (
          <div className="stat-card" style={{ minWidth: 160 }}>
            <div className="stat-card-label">Your rating</div>
            <div className="stat-card-value">★ {avgRating}</div>
            <div className="stat-card-sub">{resolved.length} rated job{resolved.length === 1 ? '' : 's'}</div>
          </div>
        )}
      </div>

      {error && <p className="alert alert-error">{error}</p>}

      {loading ? (
        <p className="helper-text">Loading requests…</p>
      ) : requests.length === 0 ? (
        <div className="empty-state">No open repair requests right now.</div>
      ) : (
        <div className="row-list">
          {requests.map((r) => (
            <div key={r.id} className="row-item">
              <div className="row-item-badge">🔧</div>
              <div className="row-item-body">
                <div className="row-item-title">{r.equipment_type}</div>
                <div className="row-item-meta">
                  {r.farmer_name} · {r.farmer_phone}
                  {r.required_time ? ` · needed by ${new Date(r.required_time).toLocaleString()}` : ''}
                </div>
                {r.description && <div className="row-item-desc">{r.description}</div>}
                {r.rating && <div className="row-item-desc">Rated {r.rating}★{r.rating_comment ? ` — "${r.rating_comment}"` : ''}</div>}

                <div style={{ marginTop: 10, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {r.status === 'open' && (
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => act(r.id, 'accept')}>Accept</button>
                  )}
                  {r.status === 'accepted' && (
                    <>
                      <button type="button" className="btn btn-secondary btn-sm" onClick={() => act(r.id, 'status', { status: 'in_progress' })}>Start job</button>
                      <button type="button" className="btn btn-danger btn-sm" onClick={() => act(r.id, 'reject')}>Reject</button>
                    </>
                  )}
                  {r.status === 'in_progress' && (
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => act(r.id, 'status', { status: 'resolved' })}>Mark resolved</button>
                  )}
                </div>
              </div>
              <div className="row-item-action">
                <span className={`status-tag status-${r.status}`}>{r.status.replace('_', ' ')}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}
