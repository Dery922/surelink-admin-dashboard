import { createContext, useCallback, useEffect, useState } from "react";
import {
  getMeRequest,
  loginRequest,
  logoutRequest,
  verifyOtpRequest,
} from "../api/adminAuth.js";
import { STORAGE_KEY } from "../api/client.js";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Rehydrate session on mount
  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEY);
    if (!token) {
      setIsLoading(false);
      return;
    }
    getMeRequest()
      .then(({ admin }) => setAdmin(admin))
      .catch(() => localStorage.removeItem(STORAGE_KEY))
      .finally(() => setIsLoading(false));
  }, []);

  /**
   * Step 1 — validate credentials.
   * Returns { requires_otp: true, pending_token, dev_otp? } to the caller.
   * The caller (LoginForm) owns the pending_token in component state —
   * it is never stored in localStorage.
   */
  const login = useCallback(async (email, password) => {
    return loginRequest(email, password);
  }, []);

  /**
   * Step 2 — verify OTP and complete login.
   * Stores session token, sets admin state.
   */
  const verifyOtp = useCallback(async (pending_token, otp) => {
    const { admin: adminData, session } = await verifyOtpRequest(pending_token, otp);
    localStorage.setItem(STORAGE_KEY, session.token);
    setAdmin(adminData);
    return adminData;
  }, []);

  const logout = useCallback(async () => {
    const token = localStorage.getItem(STORAGE_KEY);
    if (token) logoutRequest(token).catch(() => {});
    localStorage.removeItem(STORAGE_KEY);
    setAdmin(null);
  }, []);

  return (
    <AuthContext.Provider value={{ admin, isLoading, isAuth: admin !== null, login, verifyOtp, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
