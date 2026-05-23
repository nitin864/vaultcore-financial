import { useState } from 'react';
import { mockTransactions } from '../services/mockData';
import { toast } from '../components/Toast';
import './FraudAlerts.css';

const HIGH_VALUE = 50000;

const alerts = mockTransactions
  .filter(t => t.status === 'flagged' || t.status === 'blocked' || t.amount >= HIGH_VALUE)
  .map(t => ({
    ...t,
    risk: t.status === 'blocked' ? 'critical' : t.amount >= HIGH_VALUE ? 'high' : 'medium',
    reason: t.status === 'blocked'
      ? 'Transaction blocked by fraud detection system — unusual origin'
      : t.amount >= HIGH_VALUE
      ? 'High-value transaction exceeding ₹50,000 threshold'
      : 'Suspicious pattern detected — manual review recommended',
  }));

const fmt = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(n);

export default function FraudAlerts() {
  const [dismissed, setDismissed] = useState([]);

  function dismiss(id) {
    setDismissed(p => [...p, id]);
    toast('Alert dismissed', 'info');
  }
  function report(id) {
    toast('Transaction reported for investigation', 'danger');
  }

  const visible = alerts.filter(a => !dismissed.includes(a.id));

  return (
    <div className="fraud-page animate-fade">
      <div className="page-header">
        <div className="page-header__row">
          <div>
            <h1 className="page-header__title">Fraud Alerts</h1>
            <p className="page-header__subtitle">Real-time fraud detection &amp; risk monitoring</p>
          </div>
          <div className="fraud-score-badge">
            <span>Risk Score</span>
            <strong style={{ color: visible.some(a=>a.risk==='critical') ? 'var(--vc-danger)' : 'var(--vc-warning)' }}>
              {visible.some(a=>a.risk==='critical') ? 'HIGH ⚠' : 'MEDIUM'}
            </strong>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="fraud-summary">
        {[
          { label: 'Total Alerts',    val: alerts.length,                                    color: '' },
          { label: 'Critical',        val: alerts.filter(a=>a.risk==='critical').length,      color: 'red' },
          { label: 'High Risk',       val: alerts.filter(a=>a.risk==='high').length,          color: 'warn' },
          { label: 'Resolved',        val: dismissed.length,                                  color: 'green' },
        ].map(c => (
          <div key={c.label} className={`fraud-stat fraud-stat--${c.color}`}>
            <p className="fraud-stat__label">{c.label}</p>
            <p className="fraud-stat__val">{c.val}</p>
          </div>
        ))}
      </div>

      {/* Alert cards */}
      <div className="fraud-alerts">
        {visible.length === 0 && (
          <div className="fraud-empty">
            <div style={{ fontSize:'3rem' }}>🛡️</div>
            <h3>All Clear!</h3>
            <p>No active fraud alerts. Your account is secure.</p>
          </div>
        )}
        {visible.map(alert => (
          <div key={alert.id} className={`fraud-alert fraud-alert--${alert.risk}`}>
            <div className="fraud-alert__icon">
              {alert.risk === 'critical' ? '🚫' : alert.risk === 'high' ? '⚠️' : '🔍'}
            </div>
            <div className="fraud-alert__body">
              <div className="fraud-alert__header">
                <span className="fraud-alert__id">{alert.id}</span>
                <span className={`vc-badge ${alert.risk === 'critical' ? 'vc-badge-danger' : alert.risk === 'high' ? 'vc-badge-warning' : 'vc-badge-info'}`}>
                  {alert.risk.toUpperCase()}
                </span>
              </div>
              <p className="fraud-alert__desc">{alert.recipient}</p>
              <p className="fraud-alert__reason">{alert.reason}</p>
              <div className="fraud-alert__meta">
                <span>Amount: <strong>{fmt(alert.amount)}</strong></span>
                <span>Date: <strong>{new Date(alert.date).toLocaleDateString('en-IN')}</strong></span>
                <span>Status: <strong>{alert.status}</strong></span>
              </div>
            </div>
            <div className="fraud-alert__actions">
              <button className="vc-btn vc-btn-danger" style={{ padding:'8px 14px', fontSize:'0.8rem' }} onClick={() => report(alert.id)}>
                🚩 Report
              </button>
              <button className="vc-btn vc-btn-ghost" style={{ padding:'8px 14px', fontSize:'0.8rem' }} onClick={() => dismiss(alert.id)}>
                Dismiss
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* OTP 2FA Simulation */}
      <div className="vc-card fraud-2fa">
        <h3 className="fraud-2fa__title">🔐 Two-Factor Authentication Status</h3>
        <p className="fraud-2fa__sub">High-value transfers (&gt;₹50,000) require OTP verification before processing.</p>
        <div className="fraud-2fa__items">
          {[
            { label: 'SMS OTP', status: 'Enabled', icon: '📱' },
            { label: 'Email OTP', status: 'Enabled', icon: '📧' },
            { label: 'Authenticator App', status: 'Not Configured', icon: '🔑' },
          ].map(item => (
            <div key={item.label} className="fraud-2fa__item">
              <span>{item.icon} {item.label}</span>
              <span className={`vc-badge ${item.status === 'Enabled' ? 'vc-badge-success' : 'vc-badge-warning'}`}>{item.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
