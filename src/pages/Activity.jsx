import { mockActivityLogs } from '../services/mockData';
import './Activity.css';

export default function Activity() {
  return (
    <div className="activity-page animate-fade">
      <div className="page-header">
        <h1 className="page-header__title">Activity Log</h1>
        <p className="page-header__subtitle">Complete audit trail of your account actions</p>
      </div>

      {/* Stats row */}
      <div className="act-stats">
        {[
          { label: 'Total Events',    val: mockActivityLogs.length,                                               color: '' },
          { label: 'Successful',      val: mockActivityLogs.filter(l=>l.status==='success').length,               color: 'green' },
          { label: 'Flagged Events',  val: mockActivityLogs.filter(l=>l.status==='flagged').length,               color: 'warn' },
          { label: 'Blocked Attempts',val: mockActivityLogs.filter(l=>l.status==='blocked').length,               color: 'red' },
        ].map(c => (
          <div key={c.label} className={`act-stat-card act-stat-card--${c.color}`}>
            <p className="act-stat-card__label">{c.label}</p>
            <p className="act-stat-card__val">{c.val}</p>
          </div>
        ))}
      </div>

      {/* Timeline */}
      <div className="vc-card act-card">
        <h3 className="act-card__title">Event Timeline</h3>
        <div className="act-timeline">
          {mockActivityLogs.map((log, idx) => (
            <div key={log.id} className={`act-event act-event--${log.status}`}>
              <div className="act-event__dot" />
              {idx < mockActivityLogs.length - 1 && <div className="act-event__line" />}
              <div className="act-event__body">
                <div className="act-event__header">
                  <span className="act-event__action">{log.action}</span>
                  <span className={`vc-badge vc-badge-${log.status === 'success' ? 'success' : log.status === 'flagged' ? 'warning' : 'danger'}`}>
                    {log.status}
                  </span>
                </div>
                <div className="act-event__meta">
                  <span>🕐 {new Date(log.timestamp).toLocaleString('en-IN', { dateStyle:'medium', timeStyle:'short' })}</span>
                  <span>🌐 {log.ip}</span>
                  <span>💻 {log.device}</span>
                </div>
                <p className="act-event__id">{log.id}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Table view */}
      <div className="vc-card act-table-wrap">
        <h3 className="act-card__title">Detailed Log</h3>
        <div style={{ overflowX: 'auto', marginTop: 16 }}>
          <table className="act-table">
            <thead>
              <tr><th>Log ID</th><th>Timestamp</th><th>Action</th><th>IP Address</th><th>Device</th><th>Status</th></tr>
            </thead>
            <tbody>
              {mockActivityLogs.map(log => (
                <tr key={log.id} className={`act-row act-row--${log.status}`}>
                  <td className="mono">{log.id}</td>
                  <td>{new Date(log.timestamp).toLocaleString('en-IN', { dateStyle:'medium', timeStyle:'short' })}</td>
                  <td className="act-action">{log.action}</td>
                  <td className="mono">{log.ip}</td>
                  <td>{log.device}</td>
                  <td>
                    <span className={`vc-badge vc-badge-${log.status === 'success' ? 'success' : log.status === 'flagged' ? 'warning' : 'danger'}`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
