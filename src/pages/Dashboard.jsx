import { useEffect, useRef, useMemo } from 'react';
import { useUIStore, useTransactionStore, usePortfolioStore } from '../store/useStore';
import { useAuth } from '../context/AuthContext';
import { mockTransactions, mockPortfolio, mockChartData } from '../services/mockData';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, BarElement, ArcElement, Tooltip, Legend, Filler,
} from 'chart.js';
import './Dashboard.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Tooltip, Legend, Filler);

const fmt = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(n);
const pct = (n) => `${n >= 0 ? '+' : ''}${n.toFixed(2)}%`;

export default function Dashboard() {
  const { user } = useAuth();
  const { balance, balanceLoading, refreshBalance } = useUIStore();
  const { setTransactions } = useTransactionStore();
  const { holdings, setHoldings, tickPrices } = usePortfolioStore();
  const tickRef = useRef(null);

  useEffect(() => {
    setTransactions(mockTransactions);
    setHoldings(mockPortfolio);
    // Near real-time balance simulation
    tickRef.current = setInterval(tickPrices, 3000);
    return () => clearInterval(tickRef.current);
  }, []);

  // Compute derived portfolio values reactively
  const totalValue = useMemo(() => holdings.reduce((s, h) => s + h.qty * h.ltp, 0), [holdings]);
  const totalCost  = useMemo(() => holdings.reduce((s, h) => s + h.qty * h.avgBuy, 0), [holdings]);
  const totalPnl   = totalValue - totalCost;
  const totalPnlPct = totalCost ? (totalPnl / totalCost) * 100 : 0;

  const recentTxns = mockTransactions.slice(0, 5);
  const positiveDay = totalPnl >= 0;

  // ── Chart configs ─────────────────────────────────
  const lineData = {
    labels: mockChartData.portfolioTrend.labels,
    datasets: [{
      label: 'Portfolio Value',
      data: mockChartData.portfolioTrend.values,
      borderColor: '#6366f1',
      backgroundColor: 'rgba(99,102,241,0.08)',
      tension: 0.4,
      fill: true,
      pointRadius: 4,
      pointBackgroundColor: '#6366f1',
    }],
  };

  const doughnutData = {
    labels: mockChartData.sectorAllocation.labels,
    datasets: [{
      data: mockChartData.sectorAllocation.values,
      backgroundColor: ['#6366f1','#06b6d4','#22c55e'],
      borderWidth: 0,
    }],
  };

  const barData = {
    labels: mockChartData.transactionTrend.labels,
    datasets: [
      { label: 'Credits', data: mockChartData.transactionTrend.credits, backgroundColor: 'rgba(34,197,94,0.7)', borderRadius: 4 },
      { label: 'Debits',  data: mockChartData.transactionTrend.debits,  backgroundColor: 'rgba(239,68,68,0.7)',  borderRadius: 4 },
    ],
  };

  const chartOpts = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { color: 'rgba(148,163,184,0.06)' }, ticks: { color: '#64748b' } },
      y: { grid: { color: 'rgba(148,163,184,0.06)' }, ticks: { color: '#64748b' } },
    },
  };

  const donutOpts = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8', padding: 16, font: { size: 12 } } } },
    cutout: '70%',
  };

  return (
    <div className="dashboard animate-fade">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header__row">
          <div>
            <h1 className="page-header__title">Good evening, {user?.username} 👋</h1>
            <p className="page-header__subtitle">Here's your financial overview for today</p>
          </div>
          <button className="vc-btn vc-btn-secondary dash-refresh" onClick={refreshBalance}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: balanceLoading ? 'spin 0.8s linear infinite' : 'none' }}>
              <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
              <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* Stat Cards Row */}
      <div className="dash-stats">
        {/* Balance */}
        <div className="stat-card stat-card--primary">
          <div className="stat-card__icon"><BankIcon /></div>
          <div className="stat-card__body">
            <p className="stat-card__label">Account Balance</p>
            {balanceLoading
              ? <div className="vc-skeleton" style={{ height: 32, width: 160, marginTop: 6 }} />
              : <h2 className="stat-card__value">{fmt(balance)}</h2>
            }
            <p className="stat-card__sub">Savings Account • VC-4892-7731</p>
          </div>
          <div className="stat-card__pulse" />
        </div>

        {/* Portfolio Value */}
        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--cyan"><ChartLineIcon /></div>
          <div className="stat-card__body">
            <p className="stat-card__label">Portfolio Value</p>
            <h2 className="stat-card__value">{fmt(totalValue)}</h2>
            <p className={`stat-card__sub ${positiveDay ? 'text-success' : 'text-danger'}`}>
              {pct(totalPnlPct)} all time P&amp;L
            </p>
          </div>
        </div>

        {/* Today's P&L */}
        <div className="stat-card">
          <div className={`stat-card__icon ${positiveDay ? 'stat-card__icon--green' : 'stat-card__icon--red'}`}>
            {positiveDay ? <ArrowUpIcon /> : <ArrowDownIcon />}
          </div>
          <div className="stat-card__body">
            <p className="stat-card__label">Unrealised P&amp;L</p>
            <h2 className={`stat-card__value ${positiveDay ? 'text-success' : 'text-danger'}`}>
              {fmt(totalPnl)}
            </h2>
            <p className="stat-card__sub">{pct(totalPnlPct)} from cost</p>
          </div>
        </div>

        {/* Total Transactions */}
        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--purple"><TxnIcon /></div>
          <div className="stat-card__body">
            <p className="stat-card__label">Total Transactions</p>
            <h2 className="stat-card__value">{mockTransactions.length}</h2>
            <p className="stat-card__sub">This month</p>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="dash-charts">
        <div className="vc-card dash-charts__portfolio">
          <div className="dash-chart-header">
            <h3>Portfolio Performance</h3>
            <span className="vc-badge vc-badge-success">Live</span>
          </div>
          <div style={{ height: 220, marginTop: 12 }}>
            <Line data={lineData} options={chartOpts} />
          </div>
        </div>

        <div className="vc-card dash-charts__donut">
          <div className="dash-chart-header"><h3>Sector Mix</h3></div>
          <div style={{ height: 200, marginTop: 12 }}>
            <Doughnut data={doughnutData} options={donutOpts} />
          </div>
        </div>
      </div>

      {/* Bar chart + Recent Transactions */}
      <div className="dash-bottom">
        <div className="vc-card dash-bottom__bar">
          <div className="dash-chart-header">
            <h3>Monthly Cash Flow</h3>
            <div style={{ display:'flex', gap:12 }}>
              <span style={{ fontSize:'0.75rem', color:'var(--vc-success)' }}>▮ Credits</span>
              <span style={{ fontSize:'0.75rem', color:'var(--vc-danger)'  }}>▮ Debits</span>
            </div>
          </div>
          <div style={{ height: 200, marginTop: 12 }}>
            <Bar data={barData} options={chartOpts} />
          </div>
        </div>

        <div className="vc-card dash-bottom__txns">
          <div className="dash-chart-header">
            <h3>Recent Transactions</h3>
            <a href="/transactions" className="dash-view-all">View all →</a>
          </div>
          <div className="dash-txn-list">
            {recentTxns.map((t) => (
              <div key={t.id} className="dash-txn-item">
                <div className={`dash-txn-icon ${t.type === 'credit' ? 'dash-txn-icon--credit' : 'dash-txn-icon--debit'}`}>
                  {t.type === 'credit' ? '↓' : '↑'}
                </div>
                <div className="dash-txn-info">
                  <p className="dash-txn-name">{t.recipient}</p>
                  <p className="dash-txn-date">{new Date(t.date).toLocaleDateString('en-IN')}</p>
                </div>
                <div className="dash-txn-right">
                  <p className={`dash-txn-amount ${t.type === 'credit' ? 'text-success' : 'text-danger'}`}>
                    {t.type === 'credit' ? '+' : '-'}{fmt(t.amount)}
                  </p>
                  <span className={`vc-badge vc-badge-${t.status === 'success' ? 'success' : t.status === 'flagged' ? 'warning' : 'danger'}`}>
                    {t.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Icons ───────────────────────────────────────────── */
function BankIcon() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>; }
function ChartLineIcon() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>; }
function TxnIcon() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="18" rx="2"/><line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="16" y2="14"/></svg>; }
function ArrowUpIcon() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>; }
function ArrowDownIcon() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>; }
