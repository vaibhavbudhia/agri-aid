// Left sidebar: brand, current-user card, role-aware nav, logout.
// Fetches its own profile from the token in storage so any page can drop
// it into <Layout> without prop drilling.
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import apiRequest from '../api/client';
import { IconHome, IconSearch, IconCalendar, IconWrench, IconLifeBuoy, IconLogOut } from './icons';

const LINKS = [
  { to: '/dashboard', label: 'Overview', icon: IconHome, roles: ['farmer', 'provider', 'admin'] },
  { to: '/resources', label: 'Explore equipment', icon: IconSearch, roles: ['farmer', 'admin'] },
  { to: '/resources', label: 'My listings', icon: IconSearch, roles: ['provider'] },
  { to: '/bookings', label: 'My bookings', icon: IconCalendar, roles: ['farmer', 'provider', 'admin'] },
  { to: '/breakdowns', label: 'Report breakdown', icon: IconWrench, roles: ['farmer', 'admin'] },
  { to: '/repair-queue', label: 'Repair queue', icon: IconWrench, roles: ['provider'] },
  { to: '/support', label: 'Support', icon: IconLifeBuoy, roles: ['farmer', 'provider', 'admin'] },
];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('agriaid_token');
    if (!token) return;
    apiRequest('/profile', { token })
      .then(setProfile)
      .catch(() => setProfile(null));
  }, [location.pathname]);

  function logout() {
    localStorage.removeItem('agriaid_token');
    navigate('/login');
  }

  const role = profile?.role || 'farmer';
  const links = LINKS.filter((l) => l.roles.includes(role));
  const initials = (profile?.name || '?').split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();

  return (
    <aside className="sidebar">
      <Link to="/dashboard" className="sidebar-brand">
        <span className="sidebar-brand-dot">✦</span> agriaid
      </Link>

      {profile && (
        <div className="sidebar-user">
          <div className="sidebar-user-avatar">{initials}</div>
          <div style={{ minWidth: 0 }}>
            <div className="sidebar-user-name">{profile.name}</div>
            <div className="sidebar-user-role">{profile.provider_type ? `${profile.provider_type} provider` : role}{profile.region ? ` · ${profile.region}` : ''}</div>
          </div>
        </div>
      )}

      <nav className="sidebar-nav">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.to + link.label}
              to={link.to}
              className={`sidebar-link${location.pathname === link.to ? ' is-active' : ''}`}
            >
              <Icon /> {link.label}
            </Link>
          );
        })}
      </nav>

      <button type="button" className="sidebar-logout" onClick={logout}>
        <IconLogOut /> Log out
      </button>
    </aside>
  );
}
