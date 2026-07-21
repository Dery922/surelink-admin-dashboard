import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/guards/ProtectedRoute.jsx'
import RoleRoute from './components/guards/RoleRoute.jsx'
import AdminShell from './components/layout/AdminShell.jsx'
import LoginPage from './pages/LoginPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import ProvidersPage from './pages/ProvidersPage.jsx'
import OperationsPage from './pages/OperationsPage.jsx'
import SettingsPage from './pages/SettingsPage.jsx'
import BookingsPage from './pages/BookingsPage.jsx'
import BookingDetailPage from './pages/BookingDetailPage.jsx'
import TransactionsPage from './pages/TransactionsPage.jsx'
import TransactionDetailPage from './pages/TransactionDetailPage.jsx'
import CustomersPage from './pages/CustomersPage.jsx'
import CustomerDetailPage from './pages/CustomerDetailPage.jsx'
import VerificationsPage from './pages/VerificationsPage.jsx'
import VerificationDetailPage from './pages/VerificationDetailPage.jsx'

function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Protected — any authenticated admin */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminShell />}>
          <Route path="/dashboard" element={<DashboardPage />} />

          <Route
            element={
              <RoleRoute allowedRoles={['SUPER_ADMIN', 'PROVIDER_MANAGEMENT_ADMIN']} />
            }
          >
            <Route path="/providers" element={<ProvidersPage />} />
          </Route>

          <Route
            element={
              <RoleRoute allowedRoles={['SUPER_ADMIN', 'OPERATIONS_ADMIN']} />
            }
          >
            <Route path="/operations" element={<OperationsPage />} />
            <Route path="/bookings" element={<BookingsPage />} />
            <Route path="/bookings/:id" element={<BookingDetailPage />} />
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route path="/transactions/:id" element={<TransactionDetailPage />} />
            <Route path="/customers" element={<CustomersPage />} />
            <Route path="/customers/:id" element={<CustomerDetailPage />} />
          </Route>

          <Route
            element={
              <RoleRoute allowedRoles={['SUPER_ADMIN', 'PROVIDER_MANAGEMENT_ADMIN']} />
            }
          >
            <Route path="/verifications" element={<VerificationsPage />} />
            <Route path="/verifications/:id" element={<VerificationDetailPage />} />
          </Route>

          <Route element={<RoleRoute allowedRoles={['SUPER_ADMIN']} />}>
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default App
