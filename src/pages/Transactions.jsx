import { useEffect, useState, useMemo } from 'react';
import { useTransactionStore } from '../store/useStore';
import { mockTransactions } from '../services/mockData';
import './Transactions.css';

const fmt = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(n);

export default function Transactions() {
  const { transactions, setTransactions, filters, setFilter, clearFilters } = useTransactionStore();
  const [sortDir, setSortDir] = useState('desc');

  useEffect(() => {
    setTransactions(mockTransactions);
  }, []);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const q = filters.search.toLowerCase();
      const matchSearch = !q ||
        t.recipient?.toLowerCase().includes(q) ||
        t.id?.toLowerCase().includes(q) ||
        t.category?.toLowerCase().includes(q);
      const matchType   = filters.type   === 'all' || t.type   === filters.type;
      const matchStatus = filters.status === 'all' || t.status === filters.status;
      return matchSearch && matchType && matchStatus;
    });
  }, [transactions, filters]);

  const sorted = [...filteredTransactions].sort((a, b) =>
    sortDir === 'desc'
      ? new Date(b.date) - new Date(a.date)
      : new Date(a.date) - new Date(b.date)
  );

  const totalCredit = sorted.filter(t => t.type === 'credit').reduce((s, t) => s + t.amount, 0);
  const totalDebit  = sorted.filter(t => t.type === 'debit').reduce((s, t) => s + t.amount, 0);

  return (
    <div className="txn-page animate-fade">
      <div className="page-header">
        <div className="page-header__row">
          <div>
            <h1 className="page-header__title">Transaction History</h1>
            <p className="page-header__subtitle">Complete ledger of all debits and credits</p>
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <div className="txn-summary">
        <div className="txn-summary-card txn-summary-card--credit">
          <span className="txn-summary-card__label">Total Credits</span>
          <span className="txn-summary-card__val">{fmt(totalCredit)}</span>
        </div>
        <div className="txn-summary-card txn-summary-card--debit">
          <span className="txn-summary-card__label">Total Debits</span>
          <span className="txn-summary-card__val">{fmt(totalDebit)}</span>
        </div>
        <div className="txn-summary-card">
          <span className="txn-summary-card__label">Net Balance</span>
          <span className={`txn-summary-card__val ${totalCredit - totalDebit >= 0 ? 'text-success' : 'text-danger'}`}>
            {fmt(totalCredit - totalDebit)}
          </span>
        </div>
        <div className="txn-summary-card">
          <span className="txn-summary-card__label">Transactions</span>
          <span className="txn-summary-card__val">{sorted.length}</span>
        </div>
      </div>

      {/* Filters */}
      <div className="vc-card txn-filters">
        <div className="txn-filters__search">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            className="txn-filters__input"
            placeholder="Search by recipient, ID, category..."
            value={filters.search}
            onChange={e => setFilter('search', e.target.value)}
            aria-label="Search transactions"
          />
        </div>
        <div className="txn-filters__row">
          <select className="txn-filters__select" value={filters.type} onChange={e => setFilter('type', e.target.value)} aria-label="Filter by type">
            <option value="all">All Types</option>
            <option value="credit">Credit</option>
            <option value="debit">Debit</option>
          </select>
          <select className="txn-filters__select" value={filters.status} onChange={e => setFilter('status', e.target.value)} aria-label="Filter by status">
            <option value="all">All Status</option>
            <option value="success">Success</option>
            <option value="flagged">Flagged</option>
            <option value="blocked">Blocked</option>
          </select>
          <button
            className="txn-filters__select txn-sort-btn"
            onClick={() => setSortDir(d => d === 'desc' ? 'asc' : 'desc')}
          >
            Date {sortDir === 'desc' ? '↓' : '↑'}
          </button>
          {(filters.search || filters.type !== 'all' || filters.status !== 'all') && (
            <button className="vc-btn vc-btn-ghost txn-clear" onClick={clearFilters}>Clear</button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="vc-card txn-table-wrap">
        {sorted.length === 0
          ? <div className="txn-empty">No transactions match your filters.</div>
          : (
            <table className="txn-table" aria-label="Transaction ledger">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map(t => (
                  <tr key={t.id} className={`txn-row txn-row--${t.status}`}>
                    <td className="txn-id">{t.id}</td>
                    <td className="txn-date">{new Date(t.date).toLocaleString('en-IN', { dateStyle:'medium', timeStyle:'short' })}</td>
                    <td className="txn-desc">{t.recipient}</td>
                    <td><span className="txn-category">{t.category}</span></td>
                    <td>
                      <span className={`vc-badge ${t.type === 'credit' ? 'vc-badge-success' : 'vc-badge-danger'}`}>
                        {t.type === 'credit' ? '↓ Credit' : '↑ Debit'}
                      </span>
                    </td>
                    <td className={`txn-amount ${t.type === 'credit' ? 'text-success' : 'text-danger'}`}>
                      {t.type === 'credit' ? '+' : '-'}{fmt(t.amount)}
                    </td>
                    <td>
                      <span className={`vc-badge vc-badge-${t.status === 'success' ? 'success' : t.status === 'flagged' ? 'warning' : 'danger'}`}>
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        }
      </div>
    </div>
  );
}
