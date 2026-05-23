import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// ═══════════════════════════════════════════════════════
// VaultCore Financial — Global Zustand Store
// Manages: Auth | Transactions | Portfolio | UI States
// ═══════════════════════════════════════════════════════

// ── Helpers ───────────────────────────────────────────
function parseJwt(token) {
  try {
    const b = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(b));
  } catch { return null; }
}

function loadUser() {
  try {
    const s = localStorage.getItem('vc_user');
    if (!s) return null;
    const u = JSON.parse(s);
    return u.expiresAt && Date.now() < u.expiresAt ? u : null;
  } catch { return null; }
}

// ══════════════════════════════════════════════════════
// 1. AUTH STORE
// ══════════════════════════════════════════════════════
export const useAuthStore = create(
  devtools(
    (set, get) => ({
      user: loadUser(),
      loading: false,
      sessionExpired: false,

      setUser: (user) => {
        localStorage.setItem('vc_user', JSON.stringify(user));
        set({ user, sessionExpired: false }, false, 'auth/setUser');
      },

      logout: () => {
        localStorage.removeItem('vc_user');
        set({ user: null, sessionExpired: false }, false, 'auth/logout');
      },

      markSessionExpired: () => {
        localStorage.removeItem('vc_user');
        set({ user: null, sessionExpired: true }, false, 'auth/sessionExpired');
      },

      setLoading: (v) => set({ loading: v }, false, 'auth/setLoading'),

      get isAdmin() {
        const u = get().user;
        return u?.roles?.includes('ROLE_ADMIN') || u?.roles?.includes('ROLE_SUPER_ADMIN');
      },
      get isManager() {
        return get().user?.roles?.includes('ROLE_MANAGER');
      },
    }),
    { name: 'VaultCore/Auth' }
  )
);

// ══════════════════════════════════════════════════════
// 2. TRANSACTIONS STORE
// ══════════════════════════════════════════════════════
export const useTransactionStore = create(
  devtools(
    (set, get) => ({
      transactions: [],
      loading: false,
      error: null,
      filters: { search: '', type: 'all', status: 'all' },
      sendStep: 1, // 1=recipient, 2=amount, 3=review, 4=done
      sendForm: { recipient: '', accountNo: '', amount: '', note: '' },
      sendLoading: false,
      otpRequired: false,
      otp: '',

      setTransactions: (txns) =>
        set({ transactions: txns }, false, 'txn/setTransactions'),

      setLoading: (v) => set({ loading: v }, false, 'txn/loading'),
      setError: (e) => set({ error: e }, false, 'txn/error'),

      setFilter: (key, val) =>
        set((s) => ({ filters: { ...s.filters, [key]: val } }), false, 'txn/filter'),

      clearFilters: () =>
        set({ filters: { search: '', type: 'all', status: 'all' } }, false, 'txn/clearFilters'),

      setSendStep: (step) => set({ sendStep: step }, false, 'txn/sendStep'),

      updateSendForm: (key, val) =>
        set((s) => ({ sendForm: { ...s.sendForm, [key]: val } }), false, 'txn/sendForm'),

      resetSend: () =>
        set({
          sendStep: 1,
          sendForm: { recipient: '', accountNo: '', amount: '', note: '' },
          sendLoading: false,
          otpRequired: false,
          otp: '',
        }, false, 'txn/resetSend'),

      setOtpRequired: (v) => set({ otpRequired: v }, false, 'txn/otpRequired'),
      setOtp: (v) => set({ otp: v }, false, 'txn/otp'),
      setSendLoading: (v) => set({ sendLoading: v }, false, 'txn/sendLoading'),

      get filteredTransactions() {
        const { transactions, filters } = get();
        return transactions.filter((t) => {
          const q = filters.search.toLowerCase();
          const matchSearch = !q ||
            t.recipient?.toLowerCase().includes(q) ||
            t.id?.toLowerCase().includes(q) ||
            t.category?.toLowerCase().includes(q);
          const matchType = filters.type === 'all' || t.type === filters.type;
          const matchStatus = filters.status === 'all' || t.status === filters.status;
          return matchSearch && matchType && matchStatus;
        });
      },
    }),
    { name: 'VaultCore/Transactions' }
  )
);

// ══════════════════════════════════════════════════════
// 3. PORTFOLIO / STOCKS STORE
// ══════════════════════════════════════════════════════
export const usePortfolioStore = create(
  devtools(
    (set, get) => ({
      holdings: [],
      loading: false,
      lastUpdated: null,
      priceFlash: {}, // { symbol: 'up'|'down' }

      setHoldings: (h) =>
        set({ holdings: h, lastUpdated: new Date().toISOString() }, false, 'portfolio/set'),

      setLoading: (v) => set({ loading: v }, false, 'portfolio/loading'),

      // Simulate real-time price tick
      tickPrices: () => {
        set((s) => {
          const flash = {};
          const updated = s.holdings.map((h) => {
            const delta = (Math.random() - 0.48) * h.ltp * 0.008;
            const newLtp = Math.max(1, +(h.ltp + delta).toFixed(2));
            flash[h.symbol] = newLtp > h.ltp ? 'up' : newLtp < h.ltp ? 'down' : '';
            return { ...h, ltp: newLtp };
          });
          return {
            holdings: updated,
            priceFlash: flash,
            lastUpdated: new Date().toISOString(),
          };
        }, false, 'portfolio/tick');
        // Clear flash after 800ms
        setTimeout(() =>
          set({ priceFlash: {} }, false, 'portfolio/clearFlash'), 800);
      },

      get totalValue() {
        return get().holdings.reduce((sum, h) => sum + h.qty * h.ltp, 0);
      },
      get totalCost() {
        return get().holdings.reduce((sum, h) => sum + h.qty * h.avgBuy, 0);
      },
      get totalPnl() {
        return get().totalValue - get().totalCost;
      },
      get totalPnlPct() {
        const cost = get().totalCost;
        return cost ? ((get().totalPnl / cost) * 100) : 0;
      },
    }),
    { name: 'VaultCore/Portfolio' }
  )
);

// ══════════════════════════════════════════════════════
// 4. UI / GLOBAL STATE STORE
// ══════════════════════════════════════════════════════
export const useUIStore = create(
  devtools(
    (set) => ({
      globalLoading: false,
      toasts: [],
      modal: null, // { type, data }
      balance: 284750.60,
      balanceLoading: false,

      setGlobalLoading: (v) =>
        set({ globalLoading: v }, false, 'ui/globalLoading'),

      showModal: (type, data = null) =>
        set({ modal: { type, data } }, false, 'ui/showModal'),
      closeModal: () =>
        set({ modal: null }, false, 'ui/closeModal'),

      setBalance: (v) => set({ balance: v }, false, 'ui/balance'),
      setBalanceLoading: (v) => set({ balanceLoading: v }, false, 'ui/balanceLoading'),

      // Simulate near-real-time balance update
      refreshBalance: () => {
        set({ balanceLoading: true });
        setTimeout(() => {
          set((s) => ({
            balance: s.balance + (Math.random() - 0.5) * 100,
            balanceLoading: false,
          }), false, 'ui/refreshBalance');
        }, 800);
      },
    }),
    { name: 'VaultCore/UI' }
  )
);
