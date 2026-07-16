import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";

/**
 * RoleRoute
 *
 * Restricts a route (or a group of routes) to admins with a specific role.
 * Must be nested inside <ProtectedRoute> — authentication is assumed.
 *
 * Props:
 *   allowedRoles  — array of role strings that may access these routes
 *   fallback      — where to redirect on insufficient role (default: "/dashboard")
 *
 * Usage (in App.jsx):
 *   <Route element={<ProtectedRoute />}>
 *     <Route
 *       element={<RoleRoute allowedRoles={["SUPER_ADMIN"]} />}
 *     >
 *       <Route path="/admin/settings" element={<Settings />} />
 *     </Route>
 *
 *     <Route
 *       element={
 *         <RoleRoute
 *           allowedRoles={["SUPER_ADMIN", "PROVIDER_MANAGEMENT_ADMIN"]}
 *         />
 *       }
 *     >
 *       <Route path="/providers" element={<Providers />} />
 *     </Route>
 *   </Route>
 */
export default function RoleRoute({ allowedRoles = [], fallback = "/dashboard" }) {
  const { admin, isLoading } = useAuth();

  if (isLoading) return null;

  if (!admin || !allowedRoles.includes(admin.role)) {
    return <Navigate to={fallback} replace />;
  }

  return <Outlet />;
}
