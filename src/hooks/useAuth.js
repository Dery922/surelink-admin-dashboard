import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";

/**
 * useAuth
 *
 * Convenience hook for consuming AuthContext.
 * Throws if used outside of <AuthProvider> so the error is caught early
 * rather than producing a confusing null-access failure downstream.
 *
 * Usage:
 *   const { admin, isAuth, isLoading, login, logout } = useAuth()
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (context === null) {
    throw new Error("useAuth must be used within an <AuthProvider>");
  }

  return context;
}
