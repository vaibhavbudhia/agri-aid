import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiRequest from '../api/client';

const ROLES = [
  { value: 'farmer', icon: '🌾', title: 'Farmer', desc: 'Find equipment and get help when you need it.' },
  { value: 'provider', icon: '🛠️', title: 'Provider', desc: 'Offer equipment or skilled repair services.' },
];
const PROVIDER_TYPES = [
  { value: 'farmer', icon: '🚜', title: 'Equipment owner', desc: 'Share machinery with nearby farmers.' },
  { value: 'mechanic', icon: '🔧', title: 'Mechanic', desc: 'Take on repair and maintenance requests.' },
];

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', phone: '', password: '', role: 'farmer', providerType: 'farmer', region: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  async function handleSubmit(e) {
    e.preventDefault(); setError(''); setLoading(true);
    try { const data = await apiRequest('/auth/register', { method: 'POST', body: form }); localStorage.setItem('agriaid_token', data.token); navigate('/dashboard'); }
    catch (err) { setError(err.message); } finally { setLoading(false); }
  }
  return <div className="auth-page">
    <section className="auth-showcase" aria-hidden="true">
      <div className="auth-showcase-brand"><span>✦</span> agriaid</div><div className="auth-orbit auth-orbit--one" /><div className="auth-orbit auth-orbit--two" />
      <div className="auth-showcase-copy"><div className="auth-kicker">GROWING TOGETHER</div><h1>Better days begin in the field.</h1><p>Connect with the people, equipment and expertise that keep your farm moving.</p></div><div className="auth-field-art">🌱</div>
    </section>
    <main className="auth-panel"><div className="auth-form-wrap">
      <Link className="auth-brand" to="/"><span>✦</span> agriaid</Link>
      <div className="auth-heading"><div className="auth-kicker">JOIN THE COMMUNITY</div><h1>Create your account</h1><p>Tell us how you’d like to use AgriAid.</p></div>
      <form onSubmit={handleSubmit}>
        <div className="field"><label className="field-label">I am a</label><div className="role-picker">{ROLES.map((r) => <button type="button" key={r.value} className={`role-option${form.role === r.value ? ' is-selected' : ''}`} onClick={() => setForm((f) => ({ ...f, role: r.value }))}><span className="role-option-icon">{r.icon}</span><div className="role-option-title">{r.title}</div><div className="role-option-desc">{r.desc}</div></button>)}</div></div>
        {form.role === 'provider' && <div className="field provider-kind-field"><label className="field-label">As a provider, I am an</label><div className="provider-picker">{PROVIDER_TYPES.map((type) => <button type="button" key={type.value} className={`provider-option${form.providerType === type.value ? ' is-selected' : ''}`} onClick={() => setForm((f) => ({ ...f, providerType: type.value }))}><span className="provider-option-icon">{type.icon}</span><span><strong>{type.title}</strong><small>{type.desc}</small></span></button>)}</div></div>}
        <div className="field"><label className="field-label" htmlFor="name">Name</label><input id="name" className="input" value={form.name} onChange={update('name')} required /></div>
        <div className="field"><label className="field-label" htmlFor="reg-phone">Phone</label><input id="reg-phone" className="input" inputMode="tel" value={form.phone} onChange={update('phone')} required /></div>
        <div className="field"><label className="field-label" htmlFor="reg-password">Password</label><input id="reg-password" className="input" type="password" value={form.password} onChange={update('password')} required /></div>
        <div className="field"><label className="field-label" htmlFor="region">Region <span className="field-optional">Optional</span></label><input id="region" className="input" placeholder="e.g. Gonda, UP" value={form.region} onChange={update('region')} /></div>
        {error && <p className="alert alert-error">{error}</p>}<button type="submit" className="btn btn-primary btn-block" disabled={loading}>{loading ? 'Creating account…' : `Create ${form.role} account`}</button>
      </form><p className="helper-text auth-footer">Already have an account? <Link to="/login">Log in</Link></p>
    </div></main>
  </div>;
}
