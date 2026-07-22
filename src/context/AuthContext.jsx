import { createContext, useCallback, useEffect, useState } from "react";
import {
  getMeRequest,
  loginRequest,
  logoutRequest,
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
   * Validate credentials, store the session token, and set admin state.
   * Returns the admin object on success.
   */
  const login = useCallback(async (email, password) => {
    const { admin: adminData, session } = await loginRequest(email, password);
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
    <AuthContext.Provider value={{ admin, isLoading, isAuth: admin !== null, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
