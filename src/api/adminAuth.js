import client from "./client.js";

/**
 * Step 1 — validate email + password.
 * Returns: { requires_otp: true, pending_token, dev_otp? }
 */
export async function loginRequest(email, password) {
  const res = await client.post("/api/admin/auth/login", { email, password });
  return res.data.data;
}

/**
 * Step 2a — submit OTP code.
 * Returns: { admin, session: { token, expires_at } }
 */
export async function verifyOtpRequest(pending_token, otp) {
  const res = await client.post("/api/admin/auth/verify-otp", { pending_token, otp });
  return res.data.data;
}

/**
 * Step 2b — resend OTP (invalidates current code, returns new pending_token).
 * Returns: { requires_otp: true, pending_token, dev_otp? }
 */
export async function resendOtpRequest(pending_token) {
  const res = await client.post("/api/admin/auth/resend-otp", { pending_token });
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
