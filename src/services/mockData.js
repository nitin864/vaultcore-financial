// ═══════════════════════════════════════════════════
// VaultCore Financial — Mock Data for UI Demo
// ═══════════════════════════════════════════════════

export const mockUser = {
  username: 'nitin',
  name: 'Nitin Garapati',
  email: 'nitin@vaultcore.io',
  accountNumber: 'VC-4892-7731',
  ifsc: 'VCOR0001234',
  balance: 284750.60,
  currency: 'INR',
  roles: ['ROLE_USER'],
};

export const mockTransactions = [
  { id: 'TXN001', type: 'credit', amount: 50000, recipient: 'Salary - Zaalima Corp', date: '2026-04-25T09:00:00', status: 'success', category: 'Income' },
  { id: 'TXN002', type: 'debit',  amount: 12500, recipient: 'Amazon India',         date: '2026-04-24T14:32:00', status: 'success', category: 'Shopping' },
  { id: 'TXN003', type: 'debit',  amount: 85000, recipient: 'Rahul Sharma',         date: '2026-04-23T11:15:00', status: 'flagged', category: 'Transfer' },
  { id: 'TXN004', type: 'credit', amount: 25000, recipient: 'Freelance Payment',    date: '2026-04-22T16:45:00', status: 'success', category: 'Income' },
  { id: 'TXN005', type: 'debit',  amount: 3200,  recipient: 'Swiggy',               date: '2026-04-21T20:10:00', status: 'success', category: 'Food' },
  { id: 'TXN006', type: 'debit',  amount: 15000, recipient: 'HDFC Bank Loan EMI',   date: '2026-04-20T08:00:00', status: 'success', category: 'Loan' },
  { id: 'TXN007', type: 'credit', amount: 8000,  recipient: 'Cashback Rewards',     date: '2026-04-19T12:00:00', status: 'success', category: 'Rewards' },
  { id: 'TXN008', type: 'debit',  amount: 5500,  recipient: 'Netflix & Spotify',    date: '2026-04-18T00:00:00', status: 'success', category: 'Entertainment' },
  { id: 'TXN009', type: 'debit',  amount: 120000,recipient: 'Unknown Merchant',     date: '2026-04-17T03:22:00', status: 'blocked', category: 'Transfer' },
  { id: 'TXN010', type: 'credit', amount: 10000, recipient: 'Dividend Credit',      date: '2026-04-15T10:00:00', status: 'success', category: 'Investment' },
];

export const mockPortfolio = [
  { symbol: 'RELIANCE', name: 'Reliance Industries', qty: 50,  avgBuy: 2400, ltp: 2875.50, sector: 'Energy' },
  { symbol: 'TCS',      name: 'Tata Consultancy',   qty: 25,  avgBuy: 3200, ltp: 3512.00, sector: 'IT' },
  { symbol: 'INFY',     name: 'Infosys Ltd',         qty: 100, avgBuy: 1450, ltp: 1389.75, sector: 'IT' },
  { symbol: 'HDFCBANK', name: 'HDFC Bank',           qty: 75,  avgBuy: 1580, ltp: 1720.30, sector: 'Finance' },
  { symbol: 'BAJFINANCE',name:'Bajaj Finance',       qty: 10,  avgBuy: 6800, ltp: 7245.00, sector: 'Finance' },
  { symbol: 'WIPRO',    name: 'Wipro Ltd',           qty: 200, avgBuy: 420,  ltp: 398.60,  sector: 'IT' },
];

export const mockActivityLogs = [
  { id: 'LOG001', action: 'Login',              ip: '103.21.124.5',  device: 'Chrome / Windows', timestamp: '2026-04-25T22:30:00', status: 'success' },
  { id: 'LOG002', action: 'Password Changed',   ip: '103.21.124.5',  device: 'Chrome / Windows', timestamp: '2026-04-24T11:00:00', status: 'success' },
  { id: 'LOG003', action: 'Transfer Initiated', ip: '103.21.124.5',  device: 'Chrome / Windows', timestamp: '2026-04-23T11:15:00', status: 'flagged' },
  { id: 'LOG004', action: 'Login Attempt',      ip: '91.195.240.10', device: 'Unknown / Linux',   timestamp: '2026-04-22T03:44:00', status: 'blocked' },
  { id: 'LOG005', action: 'Statement Export',   ip: '103.21.124.5',  device: 'Chrome / Windows', timestamp: '2026-04-20T09:12:00', status: 'success' },
  { id: 'LOG006', action: 'Profile Update',     ip: '103.21.124.5',  device: 'Chrome / Windows', timestamp: '2026-04-18T14:30:00', status: 'success' },
];

export const mockChartData = {
  portfolioTrend: {
    labels: ['Oct','Nov','Dec','Jan','Feb','Mar','Apr'],
    values: [180000, 195000, 210000, 225000, 208000, 240000, 267000],
  },
  transactionTrend: {
    labels: ['Week 1','Week 2','Week 3','Week 4'],
    credits: [75000, 33000, 25000, 58000],
    debits:  [41200, 38500, 145000, 23700],
  },
  sectorAllocation: {
    labels: ['Energy','IT','Finance'],
    values: [143775, 221196, 201272],
  },
};

export const mockStatements = [
  { month: 'March 2026',    openingBal: 196450, closingBal: 234750, totalCredit: 85000, totalDebit: 46700 },
  { month: 'February 2026', openingBal: 152300, closingBal: 196450, totalCredit: 75000, totalDebit: 30850 },
  { month: 'January 2026',  openingBal: 108000, closingBal: 152300, totalCredit: 70000, totalDebit: 25700 },
];
