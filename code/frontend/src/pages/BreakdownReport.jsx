// Equipment breakdown reporting screen (farmers) -- submits an urgent
// repair request and shows nearby registered mechanics, then tracks the
// request's status and lets the farmer rate the mechanic once resolved.
import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import apiRequest from '../api/client';

export default function BreakdownReport() {
  const [equipmentType, setEquipmentType] = useState('');
  const [description, setDescription] = useState('');
  const [requiredTime, setRequiredTime] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [myReports, setMyReports] = useState([]);
  const token = localStorage.getItem('agriaid_token');

  function loadReports() {
    apiRequest('/breakdowns', { token }).then((d) => setMyReports(d.results || [])).catch(() => {});
  }

  useEffect(() => { loadReports(); }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const data = await apiRequest('/breakdowns', {
        method: 'POST',
        token,
        body: {
          equipment_type: equipmentType,
          description,
          required_time: requiredTime || undefined,
          latitude: latitude ? Number(latitude) : undefined,
          longitude: longitude ? Number(longitude) : undefined,
        },
      });
      setResult(data);
      setEquipmentType('');
      setDescription('');
      setRequiredTime('');
      loadReports();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function rate(id, rating) {
    await apiRequest(`/breakdowns/${id}/rate`, { method: 'POST', token, body: { rating } });
    loadReports();
  }

  return (
    <Layout wide>
      <h1>Report equipment breakdown</h1>
      <p>Flag broken machinery with your location and required time so nearby mechanics can respond fast.</p>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="field-row">
            <div className="field">
              <label className="field-label" htmlFor="equip-type">Equipment type</label>
              <input id="equip-type" className="input" placeholder="e.g. tractor" required
                value={equipmentType} onChange={(e) => setEquipmentType(e.target.value)} />
            </div>
            <div className="field">
              <label className="field-label" htmlFor="req-time">Needed by</label>
              <input id="req-time" className="input" type="datetime-local"
                value={requiredTime} onChange={(e) => setRequiredTime(e.target.value)} />
            </div>
          </div>
          <div className="field">
            <label className="field-label" htmlFor="equip-desc">What's wrong?</label>
            <textarea id="equip-desc" className="textarea" placeholder="Describe the problem"
              value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="field-row">
            <div className="field">
              <label className="field-label" htmlFor="bd-lat">Latitude (optional)</label>
              <input id="bd-lat" className="input" type="number" step="any" value={latitude} onChange={(e) => setLatitude(e.target.value)} />
            </div>
            <div className="field">
              <label className="field-label" htmlFor="bd-lng">Longitude (optional)</label>
              <input id="bd-lng" className="input" type="number" step="any" value={longitude} onChange={(e) => setLongitude(e.target.value)} />
            </div>
          </div>
          {error && <p className="alert alert-error">{error}</p>}
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Submitting…' : 'Submit report'}
          </button>
        </form>
      </div>

      {result && (
        <div className="panel">
          <p className="alert alert-success" style={{ marginBottom: 16 }}>
            Report submitted. Status: <span className={`status-tag status-${result.report.status}`}>{result.report.status}</span>
          </p>
          <h3>Nearby mechanics</h3>
          {result.nearby_mechanics.length === 0 ? (
            <p className="helper-text">None listed in your area yet.</p>
          ) : (
            <div className="row-list">
              {result.nearby_mechanics.map((m) => (
                <div key={m.id} className="row-item">
                  <div className="row-item-badge">🔧</div>
                  <div className="row-item-body">
                    <div className="row-item-title" style={{ textTransform: 'none' }}>{m.name}</div>
                    <div className="row-item-meta">
                      {m.phone} · {m.region || 'region not set'}
                      {m.distance_km != null && <> · {m.distance_km} km away</>}
                      {m.avg_rating && <> · ★ {m.avg_rating} ({m.total_ratings})</>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="section-gap">
        <h2>Your reports</h2>
        {myReports.length === 0 ? (
          <div className="empty-state">No breakdown reports yet.</div>
        ) : (
          <div className="row-list">
            {myReports.map((r) => (
              <div key={r.id} className="row-item">
                <div className="row-item-badge">🔧</div>
                <div className="row-item-body">
                  <div className="row-item-title">{r.equipment_type}</div>
                  <div className="row-item-meta">
                    {r.mechanic_name ? `Mechanic: ${r.mechanic_name} (${r.mechanic_phone}) · ` : ''}
                    {r.required_time ? `Needed by ${new Date(r.required_time).toLocaleString()}` : `Reported ${new Date(r.created_at).toLocaleString()}`}
                  </div>
                  {r.description && <div className="row-item-desc">{r.description}</div>}
                  {r.status === 'resolved' && !r.rating && (
                    <div className="star-row" style={{ marginTop: 8 }}>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button key={n} type="button" className="star-btn" onClick={() => rate(r.id, n)}>★</button>
                      ))}
                    </div>
                  )}
                  {r.rating && <div className="row-item-desc">You rated this {r.rating}★</div>}
                </div>
                <div className="row-item-action">
                  <span className={`status-tag status-${r.status}`}>{r.status.replace('_', ' ')}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
