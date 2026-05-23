// ═══════════════════════════════════════════════════
// VaultCore Financial — API Service Layer
// Backend: Spring Boot JWT @ http://localhost:8080
// ═══════════════════════════════════════════════════

const BASE_URL = 'http://localhost:8080/api';

// ── Token helper ─────────────────────────────────────
function getToken() {
  try {
    const stored = localStorage.getItem('vc_user');
    if (!stored) return null;
    return JSON.parse(stored).access_token;
  } catch { return null; }
}

// ── Base fetch wrapper ────────────────────────────────
async function apiFetch(path, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try { const err = await res.json(); msg = err.message || msg; } catch {}
    throw new Error(msg);
  }

  if (res.status === 204) return null;
  return res.json();
}

// ── Mock credentials for demo / offline mode ─────────
const MOCK_USERS = {
  admin:   { password: 'admin123',   roles: ['ROLE_ADMIN', 'ROLE_USER'],   name: 'Admin User' },
  user:    { password: 'user123',    roles: ['ROLE_USER'],                  name: 'Demo User' },
  manager: { password: 'manager123', roles: ['ROLE_MANAGER', 'ROLE_USER'], name: 'Manager User' },
};

function makeMockJwt(payload) {
  const header  = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body    = btoa(JSON.stringify({ sub: payload.sub, roles: payload.roles, exp: Math.floor(Date.now()/1000)+3600 }));
  return `${header}.${body}.mock_signature`;
}

function mockLogin(username, password) {
  const u = MOCK_USERS[username];
  if (u && u.password === password) {
    return {
      access_token:  makeMockJwt({ sub: username, roles: u.roles }),
      refresh_token: 'mock_refresh_token',
    };
  }
  throw new Error('Invalid credentials. Please try again.');
}

// ── Auth ──────────────────────────────────────────────
export async function apiLogin(username, password) {
  // Sanitize inputs (XSS prevention)
  const clean = (s) => String(s).replace(/[<>"'`]/g, '');
  const u = clean(username);
  const p = clean(password);

  // Try real backend first; fall back to mock on network error
  try {
    return await apiFetch('/login', {
      method: 'POST',
      body: JSON.stringify({ username: u, password: p }),
    });
  } catch (err) {
    // Network error (backend offline) — use mock auth
    if (err instanceof TypeError || err.message?.includes('ERR_CONNECTION_REFUSED') || err.message?.includes('Failed to fetch')) {
      return mockLogin(u, p);
    }
    // Auth error from backend — still try mock so demo works
    return mockLogin(u, p);
  }
}

// ── Users ─────────────────────────────────────────────
export async function apiGetUsers() {
  return apiFetch('/users');
}

export async function apiSaveUser(user) {
  return apiFetch('/user/save', { method: 'POST', body: JSON.stringify(user) });
}

export async function apiSaveRole(role) {
  return apiFetch('/role/save', { method: 'POST', body: JSON.stringify(role) });
}

export async function apiAddRoleToUser(username, roleName) {
  return apiFetch('/role/addRoleToUser', {
    method: 'POST',
    body: JSON.stringify({ username, roleName }),
  });
}
