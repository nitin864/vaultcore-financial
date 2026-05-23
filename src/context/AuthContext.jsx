import { createContext, useContext, useEffect } from 'react';
import { useAuthStore } from '../store/useStore';
import { apiLogin } from '../services/api';

const AuthContext = createContext(null);

// ── Input sanitizer ───────────────────────────────────
const sanitize = (s) => String(s).replace(/[<>"'`&]/g, '');

function parseJwt(token) {
  try {
    const b = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(b));
  } catch { return null; }
}

export function AuthProvider({ children }) {
  const { user, loading, setUser, logout, markSessionExpired, setLoading } = useAuthStore();

  // Auto session expiry watcher
  useEffect(() => {
    if (!user?.expiresAt) return;
    const remaining = user.expiresAt - Date.now();
    if (remaining <= 0) { markSessionExpired(); return; }
    const timer = setTimeout(markSessionExpired, remaining);
    return () => clearTimeout(timer);
  }, [user, markSessionExpired]);

  async function login(username, password) {
    setLoading(true);
    try {
      const data = await apiLogin(sanitize(username), sanitize(password));
      const payload = parseJwt(data.access_token);
      const userObj = {
        username: payload?.sub || username,
        roles: payload?.roles || [],
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expiresAt: Date.now() + 10 * 60 * 1000,
      };
      setUser(userObj);
      return userObj;
    } finally {
      setLoading(false);
    }
  }

  const isAdmin =
    user?.roles?.includes('ROLE_ADMIN') ||
    user?.roles?.includes('ROLE_SUPER_ADMIN');

  const isManager = user?.roles?.includes('ROLE_MANAGER');

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAdmin, isManager }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
