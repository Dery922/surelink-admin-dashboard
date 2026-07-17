import client from "./client.js";

/**
 * Validate email + password.
 * Returns: { admin, session: { token, expires_at } }
 */
export async function loginRequest(email, password) {
  const res = await client.post("/api/admin/auth/login", { email, password });
  return res.data.data;
}

/**
 * Logout — revoke the current session token.
 */
export async function logoutRequest(token) {
  const res = await client.post("/api/admin/auth/logout", { session_token: token });
  return res.data;
}

/**
 * Refresh — rotate the session token.
 * Returns: { session: { token, expires_at } }
 */
export async function refreshRequest(token) {
  const res = await client.post("/api/admin/auth/refresh", { session_token: token });
  return res.data.data;
}

/**
 * Fetch the currently authenticated admin's profile.
 * Returns: { admin }
 */
export async function getMeRequest() {
  const res = await client.get("/api/admin/auth/me");
  return res.data.data;
}
