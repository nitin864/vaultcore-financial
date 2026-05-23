import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

// Input sanitizer (XSS prevention)
const sanitize = (s) => String(s).replace(/[<>"'`&]/g, '');

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [showPass, setShowPass] = useState(false);

  function validate() {
    const errs = {};
    if (!form.username.trim()) errs.username = 'Username is required';
    else if (form.username.length < 3) errs.username = 'Min 3 characters';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 3) errs.password = 'Min 3 characters';
    return errs;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: sanitize(value) }));
    setErrors((er) => ({ ...er, [name]: '' }));
    setApiError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const user = await login(form.username.trim(), form.password);
      const isAdmin = user.roles?.includes('ROLE_ADMIN') || user.roles?.includes('ROLE_SUPER_ADMIN');
      navigate(isAdmin ? '/users' : '/dashboard');
    } catch (err) {
      // Never expose internal error details
      setApiError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  // Demo login shortcuts
  function demoLogin(u, p) {
    setForm({ username: u, password: p });
    setErrors({});
    setApiError('');
  }

  return (
    <div className="login-page">
      {/* Animated background */}
      <div className="login-bg">
        <div className="login-bg__orb login-bg__orb--1" />
        <div className="login-bg__orb login-bg__orb--2" />
        <div className="login-bg__orb login-bg__orb--3" />
        <div className="login-grid" />
      </div>

      <div className="login-container animate-fade">
        {/* Brand */}
        <div className="login-brand">
          <div className="login-brand__icon">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M14 2L26 8v12L14 26 2 20V8L14 2z" fill="url(#lg1)" />
              <path d="M14 8l7 4v8L14 24l-7-4V12l7-4z" fill="rgba(255,255,255,0.15)" />
              <path d="M11 14h6M14 11v6" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
              <defs>
                <linearGradient id="lg1" x1="2" y1="2" x2="26" y2="26" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#6366f1" /><stop offset="1" stopColor="#4f46e5" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div>
            <h1 className="login-brand__name">VaultCore</h1>
            <p className="login-brand__tagline">Secure Digital Banking &amp; Trading</p>
          </div>
        </div>

        <div className="login-card">
          <h2 className="login-card__title">Welcome back</h2>
          <p className="login-card__subtitle">Sign in to your secure account</p>

          {apiError && (
            <div className="login-alert" role="alert">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 10a1 1 0 110-2 1 1 0 010 2zm1-4H7V5h2v2z"/></svg>
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate autoComplete="off">
            <div className="login-field">
              <label className="vc-label" htmlFor="username">Username</label>
              <input
                id="username"
                className={`vc-input ${errors.username ? 'vc-input--error' : ''}`}
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Enter your username"
                autoComplete="username"
                maxLength={50}
              />
              {errors.username && <span className="login-field__error">{errors.username}</span>}
            </div>

            <div className="login-field">
              <label className="vc-label" htmlFor="password">Password</label>
              <div className="login-field__pass">
                <input
                  id="password"
                  className={`vc-input ${errors.password ? 'vc-input--error' : ''}`}
                  type={showPass ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  maxLength={64}
                />
                <button type="button" className="login-field__eye" onClick={() => setShowPass(v => !v)}>
                  {showPass
                    ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22"/></svg>
                    : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
              {errors.password && <span className="login-field__error">{errors.password}</span>}
            </div>

            <button type="submit" id="btn-login" className="vc-btn vc-btn-primary login-submit" disabled={loading}>
              {loading
                ? <><span className="login-spinner" />Signing in...</>
                : <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                    Sign In Securely
                  </>
              }
            </button>
          </form>

          {/* Demo credentials */}
          <div className="login-demo">
            <p className="login-demo__label">Quick Demo Access</p>
            <div className="login-demo__btns">
              <button className="login-demo__btn" onClick={() => demoLogin('nitin','1234')}>
                <span>👤</span> User
              </button>
              <button className="login-demo__btn" onClick={() => demoLogin('admin','admin')}>
                <span>🔑</span> Admin
              </button>
              <button className="login-demo__btn" onClick={() => demoLogin('manager','manager')}>
                <span>📊</span> Manager
              </button>
            </div>
          </div>
        </div>

        {/* Security badges */}
        <div className="login-badges">
          <span className="login-badge"><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg> 256-bit Encryption</span>
          <span className="login-badge"><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> JWT Secured</span>
          <span className="login-badge"><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg> Zero Trust</span>
        </div>
      </div>
    </div>
  );
}
