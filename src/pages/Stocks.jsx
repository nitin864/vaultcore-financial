import { useEffect, useRef, useState } from 'react';
import { usePortfolioStore } from '../store/useStore';
import { mockPortfolio } from '../services/mockData';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler } from 'chart.js';
import './Stocks.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

const fmt = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(n);

export default function Stocks() {
  const { holdings, setHoldings, priceFlash, tickPrices } = usePortfolioStore();
  const [selected, setSelected] = useState(null);
  const [history, setHistory]   = useState({});
  const tickRef = useRef(null);

  useEffect(() => {
    setHoldings(mockPortfolio);
    // Build initial price history per symbol
    const h = {};
    mockPortfolio.forEach(s => {
      h[s.symbol] = Array.from({ length: 20 }, (_, i) =>
        +(s.ltp * (0.97 + Math.random() * 0.06)).toFixed(2)
      );
    });
    setHistory(h);

    tickRef.current = setInterval(() => {
      tickPrices();
      setHistory(prev => {
        const next = { ...prev };
        mockPortfolio.forEach(s => {
          if (next[s.symbol]) {
            const last = next[s.symbol].slice(-1)[0];
            const newP = +(last * (0.998 + Math.random() * 0.004)).toFixed(2);
            next[s.symbol] = [...next[s.symbol].slice(-19), newP];
          }
        });
        return next;
      });
    }, 2000);
    return () => clearInterval(tickRef.current);
  }, []);

  const sel = selected ? holdings.find(h => h.symbol === selected) || mockPortfolio.find(h => h.symbol === selected) : null;

  function miniChart(symbol, color) {
    const pts = history[symbol] || [];
    return {
      labels: pts.map((_, i) => i),
      datasets: [{ data: pts, borderColor: color, borderWidth: 1.5, fill: true, backgroundColor: `${color}18`, pointRadius: 0, tension: 0.4 }],
    };
  }
  const miniOpts = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { enabled: false } }, scales: { x: { display: false }, y: { display: false } } };

  return (
    <div className="stocks-page animate-fade">
      <div className="page-header">
        <h1 className="page-header__title">Stock Market</h1>
        <p className="page-header__subtitle">Live prices • NSE &amp; BSE • Auto-refreshing every 2s</p>
      </div>

      <div className="stocks-layout">
        {/* Market list */}
        <div className="stocks-list">
          {(holdings.length ? holdings : mockPortfolio).map(s => {
            const chg    = s.ltp - s.avgBuy;
            const chgPct = (chg / s.avgBuy) * 100;
            const isUp   = chg >= 0;
            const flash  = priceFlash[s.symbol];
            return (
              <div
                key={s.symbol}
                className={`stock-card ${selected === s.symbol ? 'stock-card--active' : ''}`}
                onClick={() => setSelected(s.symbol === selected ? null : s.symbol)}
              >
                <div className="stock-card__info">
                  <span className="stock-card__symbol">{s.symbol}</span>
                  <span className="stock-card__name">{s.name}</span>
                  <span className="stock-card__sector">{s.sector}</span>
                </div>
                <div className="stock-card__chart">
                  <Line data={miniChart(s.symbol, isUp ? '#22c55e' : '#ef4444')} options={miniOpts} />
                </div>
                <div className="stock-card__price">
                  <span className={`stock-ltp stock-ltp--${flash || (isUp ? 'up' : 'down')}`}>{fmt(s.ltp)}</span>
                  <span className={isUp ? 'text-success' : 'text-danger'}>
                    {isUp ? '▲' : '▼'} {Math.abs(chgPct).toFixed(2)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Detail panel */}
        {sel ? (
          <div className="stock-detail animate-slide">
            <div className="vc-card">
              <div className="stock-detail__header">
                <div>
                  <h2 className="stock-detail__symbol">{sel.symbol}</h2>
                  <p className="stock-detail__name">{sel.name}</p>
                </div>
                <button className="vc-btn vc-btn-ghost" onClick={() => setSelected(null)}>✕</button>
              </div>
              <div className="stock-detail__price">
                {fmt(sel.ltp)}
                <span className={sel.ltp >= sel.avgBuy ? 'text-success' : 'text-danger'} style={{ fontSize: '1rem', marginLeft: 10 }}>
                  {sel.ltp >= sel.avgBuy ? '▲' : '▼'} {Math.abs(((sel.ltp - sel.avgBuy) / sel.avgBuy) * 100).toFixed(2)}%
                </span>
              </div>
              <div style={{ height: 180, marginTop: 16 }}>
                <Line
                  data={miniChart(sel.symbol, sel.ltp >= sel.avgBuy ? '#6366f1' : '#ef4444')}
                  options={{ ...miniOpts, plugins: { ...miniOpts.plugins, tooltip: { enabled: true } }, scales: { x: { display: false }, y: { display: true, grid: { color: 'rgba(148,163,184,0.06)' }, ticks: { color: '#64748b', font: { size: 11 } } } } }}
                />
              </div>
              <div className="stock-detail__stats">
                {[
                  ['Qty Held', sel.qty],
                  ['Avg Buy', fmt(sel.avgBuy)],
                  ['Current Val', fmt(sel.ltp * sel.qty)],
                  ['P&L', fmt((sel.ltp - sel.avgBuy) * sel.qty)],
                  ['Sector', sel.sector],
                ].map(([l, v]) => (
                  <div key={l} className="stock-detail__stat">
                    <span>{l}</span><strong>{v}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="stock-detail-empty">
            <div className="stock-detail-empty__icon">📈</div>
            <p>Select a stock to view details &amp; live chart</p>
          </div>
        )}
      </div>
    </div>
  );
}
