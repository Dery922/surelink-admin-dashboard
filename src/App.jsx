import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/guards/ProtectedRoute.jsx'
import RoleRoute from './components/guards/RoleRoute.jsx'
import AdminShell from './components/layout/AdminShell.jsx'
import LoginPage from './pages/LoginPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import ProvidersPage from './pages/ProvidersPage.jsx'
import OperationsPage from './pages/OperationsPage.jsx'
import SettingsPage from './pages/SettingsPage.jsx'

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
