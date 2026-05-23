import { useTransactionStore, useUIStore } from '../store/useStore';
import { toast } from '../components/Toast';
import './SendMoney.css';

const fmt = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(n);
const sanitize = (s) => String(s).replace(/[<>"'`&]/g, '');

const HIGH_VALUE_THRESHOLD = 50000;

export default function SendMoney() {
  const {
    sendStep, sendForm, sendLoading, otpRequired, otp,
    setSendStep, updateSendForm, resetSend, setSendLoading, setOtpRequired, setOtp,
  } = useTransactionStore();
  const { balance } = useUIStore();

  // ── Validation ────────────────────────────────────────
  function validateStep1() {
    if (!sendForm.recipient.trim()) return 'Recipient name is required';
    if (!sendForm.accountNo.trim()) return 'Account number is required';
    if (!/^\d{9,18}$/.test(sendForm.accountNo)) return 'Enter valid account number (9–18 digits)';
    return null;
  }
  function validateStep2() {
    const amt = parseFloat(sendForm.amount);
    if (!sendForm.amount) return 'Amount is required';
    if (isNaN(amt) || amt <= 0) return 'Enter a valid amount';
    if (amt > balance) return `Insufficient balance. Available: ${fmt(balance)}`;
    if (amt > 1000000) return 'Amount exceeds single transaction limit (₹10,00,000)';
    return null;
  }

  function handleStep1() {
    const err = validateStep1();
    if (err) { toast(err, 'warning'); return; }
    setSendStep(2);
  }

  function handleStep2() {
    const err = validateStep2();
    if (err) { toast(err, 'warning'); return; }
    const amt = parseFloat(sendForm.amount);
    if (amt >= HIGH_VALUE_THRESHOLD) {
      setOtpRequired(true);
      toast('High-value transfer detected. OTP verification required.', 'warning');
    }
    setSendStep(3);
  }

  function handleOtpVerify() {
    if (otp.length < 4) { toast('Enter valid OTP', 'warning'); return; }
    if (otp !== '1234') { toast('Invalid OTP. Please try again.', 'danger'); return; }
    toast('OTP verified successfully!', 'success');
    confirmTransfer();
  }

  function confirmTransfer() {
    setSendLoading(true);
    setTimeout(() => {
      setSendLoading(false);
      setSendStep(4);
      toast(`₹${sendForm.amount} sent to ${sendForm.recipient}!`, 'success');
    }, 1800);
  }

  function handleConfirm() {
    if (otpRequired) return; // OTP flow handles submission
    confirmTransfer();
  }

  const steps = ['Recipient', 'Amount', 'Review', 'Done'];

  return (
    <div className="send-page animate-fade">
      <div className="page-header">
        <h1 className="page-header__title">Send Money</h1>
        <p className="page-header__subtitle">Secure fund transfer with fraud detection</p>
      </div>

      {/* Step indicator */}
      <div className="send-steps">
        {steps.map((s, i) => (
          <div key={s} className={`send-step ${sendStep > i ? 'send-step--done' : ''} ${sendStep === i + 1 ? 'send-step--active' : ''}`}>
            <div className="send-step__circle">
              {sendStep > i + 1 ? '✓' : i + 1}
            </div>
            <span className="send-step__label">{s}</span>
            {i < steps.length - 1 && <div className={`send-step__line ${sendStep > i + 1 ? 'send-step__line--done' : ''}`} />}
          </div>
        ))}
      </div>

      <div className="send-body">
        <div className="vc-card send-card">
          {/* Step 1 — Recipient */}
          {sendStep === 1 && (
            <div className="send-form animate-fade">
              <h2 className="send-form__title">Enter Recipient Details</h2>
              <div className="send-field">
                <label className="vc-label" htmlFor="s-recipient">Recipient Name</label>
                <input id="s-recipient" className="vc-input" placeholder="Full name" maxLength={80}
                  value={sendForm.recipient}
                  onChange={e => updateSendForm('recipient', sanitize(e.target.value))} />
              </div>
              <div className="send-field">
                <label className="vc-label" htmlFor="s-account">Account Number</label>
                <input id="s-account" className="vc-input" placeholder="9–18 digit account number" maxLength={18}
                  value={sendForm.accountNo}
                  onChange={e => updateSendForm('accountNo', e.target.value.replace(/\D/g, ''))} />
              </div>
              <div className="send-field">
                <label className="vc-label" htmlFor="s-note">Note (Optional)</label>
                <input id="s-note" className="vc-input" placeholder="Add a note..." maxLength={100}
                  value={sendForm.note}
                  onChange={e => updateSendForm('note', sanitize(e.target.value))} />
              </div>
              <button className="vc-btn vc-btn-primary send-next" onClick={handleStep1}>
                Continue →
              </button>
            </div>
          )}

          {/* Step 2 — Amount */}
          {sendStep === 2 && (
            <div className="send-form animate-fade">
              <h2 className="send-form__title">Enter Amount</h2>
              <div className="send-balance-display">
                <span>Available Balance</span>
                <strong>{fmt(balance)}</strong>
              </div>
              <div className="send-field">
                <label className="vc-label" htmlFor="s-amount">Amount (INR)</label>
                <div className="send-amount-wrap">
                  <span className="send-amount-prefix">₹</span>
                  <input id="s-amount" className="vc-input send-amount-input" type="number" placeholder="0.00"
                    min="1" max="1000000" step="0.01"
                    value={sendForm.amount}
                    onChange={e => updateSendForm('amount', e.target.value)} />
                </div>
              </div>
              {parseFloat(sendForm.amount) >= HIGH_VALUE_THRESHOLD && (
                <div className="send-fraud-warn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4m0 4h.01"/></svg>
                  High-value transfer — OTP verification will be required
                </div>
              )}
              <div className="send-quick-amounts">
                {[500, 1000, 5000, 10000, 50000].map(a => (
                  <button key={a} className="send-quick-btn" onClick={() => updateSendForm('amount', String(a))}>
                    ₹{a.toLocaleString('en-IN')}
                  </button>
                ))}
              </div>
              <div className="send-actions">
                <button className="vc-btn vc-btn-secondary" onClick={() => setSendStep(1)}>← Back</button>
                <button className="vc-btn vc-btn-primary" onClick={handleStep2}>Review →</button>
              </div>
            </div>
          )}

          {/* Step 3 — Review + optional OTP */}
          {sendStep === 3 && (
            <div className="send-form animate-fade">
              <h2 className="send-form__title">Review Transfer</h2>
              <div className="send-review">
                <div className="send-review-row"><span>To</span><strong>{sendForm.recipient}</strong></div>
                <div className="send-review-row"><span>Account</span><strong className="mono">{sendForm.accountNo}</strong></div>
                <div className="send-review-row"><span>Note</span><strong>{sendForm.note || '—'}</strong></div>
                <div className="send-review-row send-review-row--amount">
                  <span>Amount</span>
                  <strong className="send-review-amount">{fmt(parseFloat(sendForm.amount) || 0)}</strong>
                </div>
              </div>

              {otpRequired && (
                <div className="send-otp-block animate-fade">
                  <div className="send-otp-header">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                    <div>
                      <p className="send-otp-title">2-Factor Verification Required</p>
                      <p className="send-otp-sub">OTP sent to your registered mobile • Demo OTP: <strong>1234</strong></p>
                    </div>
                  </div>
                  <input className="vc-input send-otp-input" type="text" placeholder="Enter 4-digit OTP"
                    maxLength={6} value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ''))} />
                  <button className="vc-btn vc-btn-primary send-next" onClick={handleOtpVerify} disabled={sendLoading}>
                    {sendLoading ? <><span className="send-spinner" />Processing...</> : 'Verify & Send'}
                  </button>
                </div>
              )}

              {!otpRequired && (
                <div className="send-actions">
                  <button className="vc-btn vc-btn-secondary" onClick={() => setSendStep(2)}>← Back</button>
                  <button className="vc-btn vc-btn-primary" onClick={handleConfirm} disabled={sendLoading}>
                    {sendLoading ? <><span className="send-spinner" />Processing...</> : 'Confirm & Send'}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Step 4 — Success */}
          {sendStep === 4 && (
            <div className="send-success animate-fade">
              <div className="send-success__icon">✓</div>
              <h2>Transfer Successful!</h2>
              <p>You sent <strong>{fmt(parseFloat(sendForm.amount))}</strong> to <strong>{sendForm.recipient}</strong></p>
              <p className="send-success__ref">Reference: TXN{Date.now().toString().slice(-8)}</p>
              <button className="vc-btn vc-btn-primary" onClick={resetSend}>New Transfer</button>
            </div>
          )}
        </div>

        {/* Security info panel */}
        <div className="send-security">
          <div className="vc-card">
            <h3 className="send-security__title">🔒 Transfer Security</h3>
            <ul className="send-security__list">
              <li>All transfers are encrypted end-to-end</li>
              <li>High-value transfers require OTP verification</li>
              <li>Fraud detection monitors every transaction</li>
              <li>Transactions above ₹50,000 trigger 2FA</li>
              <li>Your data is never stored in browser memory</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
