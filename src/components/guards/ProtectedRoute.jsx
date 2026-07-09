import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";

/**
 * ProtectedRoute
 *
 * Blocks access to any route that requires authentication.
 * Redirects unauthenticated users to /login, preserving the intended
 * destination in location state so login can redirect back after success.
 *
 * Shows nothing (null) while the initial session check is still in flight
 * to prevent a flash of the login page for already-authenticated admins.
 *
 * Usage (in App.jsx):
 *   <Route element={<ProtectedRoute />}>
 *     <Route path="/dashboard" element={<Dashboard />} />
 *     <Route path="/providers" element={<Providers />} />
 *   </Route>
 */
export default function ProtectedRoute() {
  const { isAuth, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return null;

  if (!isAuth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
