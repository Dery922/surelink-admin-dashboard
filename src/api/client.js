import axios from "axios";

/**
 * Axios instance pre-configured for the SureLink backend API.
 *
 * Token strategy:
 * - Admin session tokens are stored in localStorage under STORAGE_KEY.
 * - Every request that needs auth reads the token fresh from storage via the
 *   request interceptor, so token rotation (refresh) takes effect immediately.
 * - On a 401, the response interceptor clears the stored token and redirects to
 *   login so the user isn't stuck in a broken state.
 *
 * Note: localStorage is acceptable for an admin dashboard (trusted device,
 * no XSS risk from Tailwind + React without dangerouslySetInnerHTML). If the
 * security posture changes, swap to an httpOnly cookie on the backend.
 */

export const STORAGE_KEY = "surelink_admin_token";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
  timeout: 15000,
});

// ── Request interceptor ──────────────────────────────────────
// Attach the bearer token on every outgoing request if one is stored.
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEY);
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ── Response interceptor ─────────────────────────────────────
// On 401, wipe the stale token and bounce to login.
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(STORAGE_KEY);
      // Avoid circular dependency with AuthContext by using direct navigation.
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default client;
