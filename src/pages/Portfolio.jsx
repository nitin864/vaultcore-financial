import { useEffect, useRef, useMemo } from 'react';
import { usePortfolioStore } from '../store/useStore';
import { mockPortfolio, mockChartData } from '../services/mockData';
import { Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend, Filler } from 'chart.js';
import './Portfolio.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend, Filler);

const fmt  = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(n);
const pct  = (n) => `${n >= 0 ? '+' : ''}${n.toFixed(2)}%`;

export default function Portfolio() {
  const { holdings, setHoldings, priceFlash, tickPrices } = usePortfolioStore();
  const tickRef = useRef(null);

  useEffect(() => {
    setHoldings(mockPortfolio);
    tickRef.current = setInterval(tickPrices, 2500);
    return () => clearInterval(tickRef.current);
  }, []);

  // Reactive derived values
  const totalValue  = useMemo(() => holdings.reduce((s, h) => s + h.qty * h.ltp, 0), [holdings]);
  const totalCost   = useMemo(() => holdings.reduce((s, h) => s + h.qty * h.avgBuy, 0), [holdings]);
  const totalPnl    = totalValue - totalCost;
  const totalPnlPct = totalCost ? (totalPnl / totalCost) * 100 : 0;


  const lineData = {
    labels: mockChartData.portfolioTrend.labels,
    datasets: [{ label: 'Portfolio ₹', data: mockChartData.portfolioTrend.values, borderColor: '#6366f1', backgroundColor: 'rgba(99,102,241,0.08)', tension: 0.4, fill: true, pointRadius: 4, pointBackgroundColor: '#6366f1' }],
  };
  const donutData = {
    labels: mockChartData.sectorAllocation.labels,
    datasets: [{ data: mockChartData.sectorAllocation.values, backgroundColor: ['#6366f1','#06b6d4','#22c55e'], borderWidth: 0 }],
  };
  const chartOpts = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { color: 'rgba(148,163,184,0.06)' }, ticks: { color: '#64748b' } }, y: { grid: { color: 'rgba(148,163,184,0.06)' }, ticks: { color: '#64748b' } } } };
  const donutOpts = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8', padding: 14 } } }, cutout: '68%' };

  return (
    <div className="portfolio-page animate-fade">
      <div className="page-header">
        <h1 className="page-header__title">Portfolio</h1>
        <p className="page-header__subtitle">Real-time stock holdings &amp; performance</p>
      </div>

      {/* Summary row */}
      <div className="port-summary">
        {[
          { label: 'Current Value',  val: fmt(totalValue), sub: 'Live prices',       color: '' },
          { label: 'Invested Cost',  val: fmt(totalCost),  sub: 'Total cost basis',  color: '' },
          { label: 'Unrealised P&L', val: fmt(totalPnl),   sub: pct(totalPnlPct),   color: totalPnl >= 0 ? 'green' : 'red' },
          { label: 'Holdings',       val: holdings.length,  sub: 'Active positions',  color: '' },
        ].map(c => (
          <div key={c.label} className={`port-stat-card ${c.color ? `port-stat-card--${c.color}` : ''}`}>
            <p className="port-stat-card__label">{c.label}</p>
            <p className={`port-stat-card__val ${c.color === 'green' ? 'text-success' : c.color === 'red' ? 'text-danger' : ''}`}>{c.val}</p>
            <p className="port-stat-card__sub">{c.sub}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="port-charts">
        <div className="vc-card">
          <h3 className="port-chart-title">Performance Trend</h3>
          <div style={{ height: 220, marginTop: 12 }}><Line data={lineData} options={chartOpts} /></div>
        </div>
        <div className="vc-card">
          <h3 className="port-chart-title">Sector Allocation</h3>
          <div style={{ height: 220, marginTop: 12 }}><Doughnut data={donutData} options={donutOpts} /></div>
        </div>
      </div>

      {/* Holdings table */}
      <div className="vc-card port-table-wrap">
        <div className="port-table-header">
          <h3>Holdings</h3>
          <span className="vc-badge vc-badge-success" style={{ fontSize: '0.7rem' }}>● Live Prices</span>
        </div>
        <div className="port-table-scroll">
          <table className="port-table">
            <thead>
              <tr><th>Symbol</th><th>Company</th><th>Sector</th><th>Qty</th><th>Avg Buy</th><th>LTP</th><th>Current Val</th><th>P&amp;L</th><th>P&amp;L %</th></tr>
            </thead>
            <tbody>
              {holdings.map(h => {
                const pnl = (h.ltp - h.avgBuy) * h.qty;
                const pnlPct = ((h.ltp - h.avgBuy) / h.avgBuy) * 100;
                const flash = priceFlash[h.symbol];
                return (
                  <tr key={h.symbol}>
                    <td><span className="port-symbol">{h.symbol}</span></td>
                    <td className="port-name">{h.name}</td>
                    <td><span className="port-sector">{h.sector}</span></td>
                    <td>{h.qty}</td>
                    <td>{fmt(h.avgBuy)}</td>
                    <td className={`port-ltp port-ltp--${flash || ''}`}>{fmt(h.ltp)}</td>
                    <td>{fmt(h.ltp * h.qty)}</td>
                    <td className={pnl >= 0 ? 'text-success' : 'text-danger'}>{fmt(pnl)}</td>
                    <td className={pnl >= 0 ? 'text-success' : 'text-danger'}>{pct(pnlPct)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
