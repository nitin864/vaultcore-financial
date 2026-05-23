import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import SendMoney from './pages/SendMoney';
import Portfolio from './pages/Portfolio';
import Stocks from './pages/Stocks';
import Activity from './pages/Activity';
import FraudAlerts from './pages/FraudAlerts';
import Statements from './pages/Statements';
import UserManagement from './pages/UserManagement';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />

          {/* Protected shell */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard"    element={<Dashboard />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="send-money"   element={<SendMoney />} />
            <Route path="portfolio"    element={<Portfolio />} />
            <Route path="stocks"       element={<Stocks />} />
            <Route path="activity"     element={<Activity />} />
            <Route path="fraud"        element={<FraudAlerts />} />
            <Route path="statements"   element={<Statements />} />
            <Route
              path="users"
              element={
                <ProtectedRoute requiredRole="ROLE_ADMIN">
                  <UserManagement />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
