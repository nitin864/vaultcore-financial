import { useState } from 'react';
import { mockStatements, mockTransactions } from '../services/mockData';
import { toast } from '../components/Toast';
import './Statements.css';

const fmt = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(n);

export default function Statements() {
  const [selected, setSelected] = useState(0);

  function handleDownload() {
    toast('Generating PDF statement... Download will start shortly.', 'info');
    // In production: trigger PDF export API
    setTimeout(() => toast('Statement downloaded successfully!', 'success'), 1500);
  }

  const stmt = mockStatements[selected];
  const monthTxns = mockTransactions.slice(0, 5); // mock month transactions

  return (
    <div className="stmt-page animate-fade">
      <div className="page-header">
        <div className="page-header__row">
          <div>
            <h1 className="page-header__title">Statements</h1>
            <p className="page-header__subtitle">Monthly account statements &amp; reports</p>
          </div>
          <button id="btn-download-stmt" className="vc-btn vc-btn-primary" onClick={handleDownload}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Download PDF
          </button>
        </div>
      </div>

      <div className="stmt-layout">
        {/* Month selector */}
        <div className="stmt-months">
          <h3 className="stmt-months__title">Select Period</h3>
          {mockStatements.map((s, i) => (
            <button
              key={s.month}
              className={`stmt-month-btn ${selected === i ? 'stmt-month-btn--active' : ''}`}
              onClick={() => setSelected(i)}
            >
              <span>{s.month}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          ))}
        </div>

        {/* Statement detail */}
        <div className="stmt-detail">
          <div className="vc-card stmt-header-card">
            <div className="stmt-brand">
              <div className="stmt-brand__logo">
                <svg width="20" height="20" viewBox="0 0 28 28" fill="none">
                  <path d="M14 2L26 8v12L14 26 2 20V8L14 2z" fill="url(#stL)"/>
                  <path d="M11 14h6M14 11v6" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
                  <defs><linearGradient id="stL" x1="2" y1="2" x2="26" y2="26" gradientUnits="userSpaceOnUse"><stop stopColor="#6366f1"/><stop offset="1" stopColor="#4f46e5"/></linearGradient></defs>
                </svg>
              </div>
              <div>
                <p className="stmt-brand__name">VaultCore Financial</p>
                <p className="stmt-brand__sub">Account Statement</p>
              </div>
            </div>
            <div className="stmt-period">
              <p className="stmt-period__label">Period</p>
              <p className="stmt-period__val">{stmt.month}</p>
            </div>
          </div>

          {/* Summary grid */}
          <div className="stmt-grid">
            {[
              { label: 'Opening Balance', val: fmt(stmt.openingBal), color: '' },
              { label: 'Total Credits',   val: fmt(stmt.totalCredit), color: 'green' },
              { label: 'Total Debits',    val: fmt(stmt.totalDebit),  color: 'red' },
              { label: 'Closing Balance', val: fmt(stmt.closingBal),  color: 'accent' },
            ].map(c => (
              <div key={c.label} className={`stmt-stat stmt-stat--${c.color}`}>
                <p className="stmt-stat__label">{c.label}</p>
                <p className="stmt-stat__val">{c.val}</p>
              </div>
            ))}
          </div>

          {/* Transactions */}
          <div className="vc-card stmt-txn-card">
            <h3 className="stmt-txn-title">Transactions — {stmt.month}</h3>
            <div style={{ overflowX: 'auto' }}>
              <table className="stmt-table">
                <thead>
                  <tr><th>Date</th><th>Description</th><th>Type</th><th>Amount</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {monthTxns.map(t => (
                    <tr key={t.id}>
                      <td>{new Date(t.date).toLocaleDateString('en-IN')}</td>
                      <td>{t.recipient}</td>
                      <td>
                        <span className={`vc-badge ${t.type === 'credit' ? 'vc-badge-success' : 'vc-badge-danger'}`}>
                          {t.type}
                        </span>
                      </td>
                      <td className={t.type === 'credit' ? 'stmt-credit' : 'stmt-debit'}>
                        {t.type === 'credit' ? '+' : '-'}{fmt(t.amount)}
                      </td>
                      <td><span className={`vc-badge vc-badge-${t.status === 'success' ? 'success' : 'warning'}`}>{t.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
