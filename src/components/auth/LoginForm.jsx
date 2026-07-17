/**
 * LoginForm.jsx
 *
 * Single-step admin login.
 *
 * Admin enters email + password. On success AuthContext stores the session
 * token in localStorage, sets the admin state, and the user is redirected to
 * the page they originally tried to visit (or /dashboard).
 */

import { useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';

// ─── Error message map ────────────────────────────────────────
// Maps backend error codes to user-facing messages.
const CRED_ERRORS = {
  ADMIN_AUTH_INVALID_CREDENTIALS: 'Invalid email or password.',
  ADMIN_AUTH_ACCOUNT_INACTIVE: 'Account is inactive. Contact a Super Admin.',
  ADMIN_AUTH_ACCOUNT_LOCKED: 'Account locked after too many attempts. Try again in 15 minutes.',
  default: 'Something went wrong. Please try again.',
};

function errorMsg(map, code) {
  return map[code] ?? map.default;
}

// ─── Credentials form ────────────────────────────────────────
/**
 * Collects email + password and calls AuthContext.login().
 * On success, calls onSuccess() so the parent can navigate away.
 */
function CredentialsStep({ onSuccess }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      onSuccess();
    } catch (err) {
      setPassword('');
      const code = err?.response?.data?.error?.code;
      setError(errorMsg(CRED_ERRORS, code));
      setLoading(false);
    }
  }

  return (
    <>
      <div className="mb-6">
        <h2 className="text-lg font-bold text-[#1A1A1A] tracking-tight mb-0.5">Welcome back</h2>
        <p className="text-xs text-gray-400">Sign in to your admin account</p>
      </div>

      {error && (
        <div className="mb-4 flex items-start gap-2.5 bg-red-50 border border-red-100 rounded-lg px-3 py-2.5">
          <i className="fa-solid fa-circle-exclamation text-red-400 text-xs mt-0.5 flex-shrink-0" />
          <p className="text-xs text-red-600 font-medium">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-xs font-semibold text-[#1A1A1A] mb-1.5">
            Email address
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <i className="fa-solid fa-envelope text-gray-300 text-xs" />
            </span>
            <input id="email" type="email" autoComplete="email" required value={email}
              onChange={(e) => setEmail(e.target.value)} placeholder="admin@surelink.dev"
              className="w-full pl-8 pr-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-[#1A1A1A] text-xs placeholder-gray-300 focus:outline-none focus:border-[#0057FF] focus:ring-2 focus:ring-[#0057FF]/15 focus:bg-white transition-all" />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-xs font-semibold text-[#1A1A1A] mb-1.5">
            Password
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <i className="fa-solid fa-lock text-gray-300 text-xs" />
            </span>
            <input id="password" type={showPw ? 'text' : 'password'} autoComplete="current-password"
              required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
              className="w-full pl-8 pr-9 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-[#1A1A1A] text-xs placeholder-gray-300 focus:outline-none focus:border-[#0057FF] focus:ring-2 focus:ring-[#0057FF]/15 focus:bg-white transition-all" />
            <button type="button" onClick={() => setShowPw((v) => !v)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-300 hover:text-gray-500 transition-colors">
              <i className={`fa-solid ${showPw ? 'fa-eye-slash' : 'fa-eye'} text-xs`} />
            </button>
          </div>
        </div>

        <button type="submit" disabled={loading || !email || !password}
          className="w-full bg-[#0057FF] text-white font-bold text-xs px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-1 shadow-sm">
          {loading
            ? <><i className="fa-solid fa-spinner fa-spin text-xs" />Signing in…</>
            : <><i className="fa-solid fa-right-to-bracket text-xs" />Sign in</>}
        </button>
      </form>
    </>
  );
}

// ─── Page shell ───────────────────────────────────────────────
/**
 * LoginForm — root component for the /login page.
 *
 * On successful login, navigates the admin to wherever they originally
 * tried to go (or /dashboard as default).
 */
export default function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSuccess = useCallback(() => {
    navigate(from, { replace: true });
  }, [navigate, from]);

  return (
    <div className="w-full md:w-[58%] bg-gray-50 flex items-center justify-center p-6 md:p-12">
      <div className="w-full max-w-sm">
        {/* Mobile brand mark — hidden on desktop where the left panel shows it */}
        <div className="md:hidden flex items-center gap-2.5 mb-8">
          <div className="w-8 h-8 rounded-lg bg-[#0057FF] flex items-center justify-center shadow-sm">
            <i className="fa-solid fa-shield-halved text-white text-xs" />
          </div>
          <div>
            <p className="font-bold text-[#1A1A1A] text-sm">SureLink</p>
            <p className="text-[10px] text-gray-400">Admin Portal</p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
          <CredentialsStep onSuccess={handleSuccess} />
        </div>

        <p className="mt-5 text-center text-[11px] text-gray-400">
          Access restricted to authorised SureLink administrators.
        </p>
      </div>
    </div>
  );
}
