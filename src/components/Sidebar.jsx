import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

const NAV = [
  {
    group: 'Banking',
    items: [
      { to: '/dashboard', label: 'Dashboard', icon: GridIcon },
      { to: '/transactions', label: 'Transactions', icon: TxnIcon },
      { to: '/send-money', label: 'Send Money', icon: SendIcon },
      { to: '/statements', label: 'Statements', icon: DocIcon },
    ],
  },
  {
    group: 'Trading',
    items: [
      { to: '/portfolio', label: 'Portfolio', icon: ChartIcon },
      { to: '/stocks', label: 'Stock Market', icon: TrendIcon },
    ],
  },
  {
    group: 'Security',
    items: [
      { to: '/activity', label: 'Activity Log', icon: ShieldIcon },
      { to: '/fraud', label: 'Fraud Alerts', icon: AlertIcon },
    ],
  },
];

const ADMIN_NAV = {
  group: 'Admin',
  items: [
    { to: '/users', label: 'User Management', icon: UsersIcon },
  ],
};

export default function Sidebar({ open, onClose }) {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  const allNav = isAdmin ? [...NAV, ADMIN_NAV] : NAV;

  return (
    <>
      {/* Mobile overlay */}
      {open && <div className="sidebar-overlay" onClick={onClose} />}

      <aside className={`sidebar ${open ? 'sidebar--open' : ''}`}>
        {/* Brand */}
        <div className="sidebar__brand">
          <div className="sidebar__logo">
            <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
              <path d="M14 2L26 8v12L14 26 2 20V8L14 2z" fill="url(#sbl)" />
              <path d="M11 14h6M14 11v6" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
              <defs><linearGradient id="sbl" x1="2" y1="2" x2="26" y2="26" gradientUnits="userSpaceOnUse"><stop stopColor="#6366f1" /><stop offset="1" stopColor="#4f46e5" /></linearGradient></defs>
            </svg>
          </div>
          <div>
            <span className="sidebar__brand-name">VaultCore</span>
            <span className="sidebar__brand-sub">Financial</span>
          </div>
          <button className="sidebar__close" onClick={onClose} aria-label="Close menu">✕</button>
        </div>

        {/* User pill */}
        <div className="sidebar__user">
          <div className="sidebar__avatar">{user?.username?.[0]?.toUpperCase() || 'U'}</div>
          <div className="sidebar__user-info">
            <span className="sidebar__user-name">{user?.username}</span>
            <span className="sidebar__user-role">
              {user?.roles?.[0]?.replace('ROLE_', '') || 'USER'}
            </span>
          </div>
          <div className="sidebar__online" title="Online" />
        </div>

        {/* Navigation */}
        <nav className="sidebar__nav">
          {allNav.map((section) => (
            <div key={section.group} className="sidebar__section">
              <p className="sidebar__section-label">{section.group}</p>
              {section.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
                  }
                  onClick={onClose}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="sidebar__footer">
          <button id="btn-logout" className="sidebar__logout" onClick={handleLogout}>
            <LogoutIcon />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}

/* ── Icons ───────────────────────────────────────────── */
function GridIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>;
}
function TxnIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" /></svg>;
}
function SendIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>;
}
function DocIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="8" y1="13" x2="16" y2="13" /><line x1="8" y1="17" x2="16" y2="17" /></svg>;
}
function ChartIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>;
}
function TrendIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>;
}
function ShieldIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>;
}
function AlertIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>;
}
function UsersIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></svg>;
}
function LogoutIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>;
}
