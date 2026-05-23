import { useEffect, useState } from 'react';
import { apiGetUsers, apiSaveUser, apiAddRoleToUser } from '../services/api';
import { toast } from '../components/Toast';
import './UserManagement.css';

const sanitize = (s) => String(s).replace(/[<>"'`&]/g, '');

export default function UserManagement() {
  const [users, setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm]     = useState({ name: '', username: '', password: '' });
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  async function load() {
    setLoading(true);
    try {
      const data = await apiGetUsers();
      setUsers(data);
    } catch {
      // Backend may be offline — use mock fallback
      setUsers([
        { id: 1, name: 'Nitin Garapati', username: 'nitin',   roles: [{ name: 'ROLE_USER' }] },
        { id: 2, name: 'Admin',          username: 'admin',   roles: [{ name: 'ROLE_ADMIN' }] },
        { id: 3, name: 'Root',           username: 'root',    roles: [{ name: 'ROLE_SUPER_ADMIN' }] },
        { id: 4, name: 'Manager',        username: 'manager', roles: [{ name: 'ROLE_MANAGER' }] },
      ]);
      toast('Using demo data — backend offline', 'warning');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleSave(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.username.trim() || !form.password.trim()) {
      toast('All fields are required', 'warning'); return;
    }
    setSaving(true);
    try {
      await apiSaveUser({ name: sanitize(form.name), username: sanitize(form.username), password: form.password, roles: [] });
      toast(`User "${form.username}" created successfully`, 'success');
      setForm({ name: '', username: '', password: '' });
      setShowForm(false);
      await load();
    } catch (err) {
      toast(`Error: ${err.message}`, 'danger');
    } finally {
      setSaving(false);
    }
  }

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.username?.toLowerCase().includes(search.toLowerCase())
  );

  function roleColor(roleName) {
    if (roleName?.includes('SUPER')) return 'danger';
    if (roleName?.includes('ADMIN')) return 'warning';
    if (roleName?.includes('MANAGER')) return 'info';
    return 'success';
  }

  return (
    <div className="um-page animate-fade">
      <div className="page-header">
        <div className="page-header__row">
          <div>
            <h1 className="page-header__title">User Management</h1>
            <p className="page-header__subtitle">Admin panel — manage users and roles</p>
          </div>
          <button id="btn-add-user" className="vc-btn vc-btn-primary" onClick={() => setShowForm(v => !v)}>
            {showForm ? '✕ Cancel' : '＋ Add User'}
          </button>
        </div>
      </div>

      {/* Add user form */}
      {showForm && (
        <div className="vc-card um-form animate-fade">
          <h3 className="um-form__title">Create New User</h3>
          <form onSubmit={handleSave} className="um-form__grid" autoComplete="off">
            <div>
              <label className="vc-label" htmlFor="um-name">Full Name</label>
              <input id="um-name" className="vc-input" placeholder="Full name" maxLength={80}
                value={form.name} onChange={e => setForm(f => ({ ...f, name: sanitize(e.target.value) }))} />
            </div>
            <div>
              <label className="vc-label" htmlFor="um-user">Username</label>
              <input id="um-user" className="vc-input" placeholder="username" maxLength={40}
                value={form.username} onChange={e => setForm(f => ({ ...f, username: sanitize(e.target.value) }))} />
            </div>
            <div>
              <label className="vc-label" htmlFor="um-pass">Password</label>
              <input id="um-pass" className="vc-input" type="password" placeholder="Password" maxLength={64}
                value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
            </div>
            <button type="submit" className="vc-btn vc-btn-primary um-save" disabled={saving}>
              {saving ? 'Saving...' : 'Save User'}
            </button>
          </form>
        </div>
      )}

      {/* Stats */}
      <div className="um-stats">
        {[
          { label: 'Total Users', val: users.length },
          { label: 'Admins',      val: users.filter(u => u.roles?.some(r => r.name?.includes('ADMIN'))).length },
          { label: 'Managers',    val: users.filter(u => u.roles?.some(r => r.name?.includes('MANAGER'))).length },
          { label: 'Regular',     val: users.filter(u => u.roles?.some(r => r.name === 'ROLE_USER')).length },
        ].map(c => (
          <div key={c.label} className="um-stat">
            <p className="um-stat__label">{c.label}</p>
            <p className="um-stat__val">{c.val}</p>
          </div>
        ))}
      </div>

      {/* Search + Table */}
      <div className="vc-card">
        <div className="um-search-row">
          <div className="um-search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input className="um-search__input" placeholder="Search users..." value={search}
              onChange={e => setSearch(e.target.value)} aria-label="Search users" />
          </div>
          <button className="vc-btn vc-btn-secondary" onClick={load} style={{ padding:'8px 16px' }}>
            ↺ Refresh
          </button>
        </div>

        {loading ? (
          <div className="um-loading">
            {[1,2,3,4].map(i => (
              <div key={i} className="vc-skeleton" style={{ height: 52, borderRadius: 8 }} />
            ))}
          </div>
        ) : (
          <div style={{ overflowX: 'auto', marginTop: 16 }}>
            <table className="um-table">
              <thead>
                <tr><th>#</th><th>Name</th><th>Username</th><th>Roles</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filtered.map(u => (
                  <tr key={u.id}>
                    <td className="um-id">{u.id}</td>
                    <td className="um-name">
                      <div className="um-avatar">{u.name?.[0]?.toUpperCase()}</div>
                      {u.name}
                    </td>
                    <td><span className="um-username">{u.username}</span></td>
                    <td>
                      <div className="um-roles">
                        {u.roles?.map(r => (
                          <span key={r.name} className={`vc-badge vc-badge-${roleColor(r.name)}`} style={{ fontSize:'0.7rem' }}>
                            {r.name?.replace('ROLE_', '')}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <div style={{ display:'flex', gap:8 }}>
                        <button className="vc-btn vc-btn-secondary" style={{ padding:'5px 12px', fontSize:'0.78rem' }}
                          onClick={() => toast(`Edit user: ${u.username}`, 'info')}>Edit</button>
                        <button className="vc-btn vc-btn-ghost" style={{ padding:'5px 12px', fontSize:'0.78rem', color:'var(--vc-danger)' }}
                          onClick={() => toast(`Delete not permitted in demo mode`, 'warning')}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={5} style={{ textAlign:'center', padding:'40px', color:'var(--vc-text-muted)' }}>No users found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
