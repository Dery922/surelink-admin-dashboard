import { useState, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { resendOtpRequest } from '../../api/adminAuth.js';

// ─── Error message map ────────────────────────────────────────
const CRED_ERRORS = {
  ADMIN_AUTH_INVALID_CREDENTIALS: 'Invalid email or password.',
  ADMIN_AUTH_ACCOUNT_INACTIVE: 'Account is inactive. Contact a Super Admin.',
  ADMIN_AUTH_ACCOUNT_LOCKED: 'Account locked after too many attempts. Try again in 15 minutes.',
  default: 'Something went wrong. Please try again.',
};

const OTP_ERRORS = {
  ADMIN_AUTH_OTP_INVALID: null, // message comes from server (includes remaining count)
  ADMIN_AUTH_OTP_ATTEMPTS_EXCEEDED: 'Too many incorrect attempts. Please start over.',
  ADMIN_AUTH_OTP_EXPIRED: 'OTP expired. Please log in again.',
  default: 'Something went wrong. Please try again.',
};

function errorMsg(map, code, serverMessage) {
  if (map[code] === null) return serverMessage; // use server message verbatim
  return map[code] ?? map.default;
}

// ─── 6-box OTP input ─────────────────────────────────────────
function OtpBoxes({ value, onChange, disabled }) {
  const refs = useRef([]);

  function handleKey(e, idx) {
    if (e.key === 'Backspace') {
      e.preventDefault();
      if (value[idx]) {
        const next = value.split('');
        next[idx] = '';
        onChange(next.join(''));
      } else if (idx > 0) {
        refs.current[idx - 1]?.focus();
        const next = value.split('');
        next[idx - 1] = '';
        onChange(next.join(''));
      }
    }
  }

  function handleChange(e, idx) {
    const digit = e.target.value.replace(/\D/g, '').slice(-1);
    const next = value.padEnd(6, ' ').split('');
    next[idx] = digit;
    const joined = next.join('').trimEnd();
    onChange(joined);
    if (digit && idx < 5) refs.current[idx + 1]?.focus();
  }

  function handlePaste(e) {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    onChange(pasted);
    const focusIdx = Math.min(pasted.length, 5);
    refs.current[focusIdx]?.focus();
  }

  return (
    <div className="flex gap-2 justify-center">
      {[...Array(6)].map((_, i) => (
        <input
          key={i}
          ref={(el) => (refs.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ''}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKey(e, i)}
          onPaste={i === 0 ? handlePaste : undefined}
          disabled={disabled}
          className="w-10 h-12 text-center text-base font-bold text-[#1A1A1A] rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:border-[#0057FF] focus:ring-2 focus:ring-[#0057FF]/15 focus:bg-white transition-all disabled:opacity-50 caret-transparent"
          autoComplete="off"
        />
      ))}
    </div>
  );
}

// ─── Credentials step ────────────────────────────────────────
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
      const result = await login(email, password);
      onSuccess(result); // { requires_otp, pending_token, dev_otp? }
    } catch (err) {
      setPassword('');
      const code = err?.response?.data?.error?.code;
      setError(errorMsg(CRED_ERRORS, code, err?.response?.data?.message));
    } finally {
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
            ? <><i className="fa-solid fa-spinner fa-spin text-xs" />Verifying…</>
            : <><i className="fa-solid fa-right-to-bracket text-xs" />Continue</>}
        </button>
      </form>
    </>
  );
}

// ─── OTP step ────────────────────────────────────────────────
function OtpStep({ pendingToken, devOtp, onBack, onSuccess }) {
  const { verifyOtp } = useAuth();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [currentPendingToken, setCurrentPendingToken] = useState(pendingToken);
  const [locked, setLocked] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (otp.length !== 6) return;
    setError('');
    setNotice('');
    setLoading(true);
    try {
      await verifyOtp(currentPendingToken, otp);
      onSuccess();
    } catch (err) {
      const code = err?.response?.data?.error?.code;
      const serverMsg = err?.response?.data?.message;
      if (code === 'ADMIN_AUTH_OTP_ATTEMPTS_EXCEEDED') setLocked(true);
      setOtp('');
      setError(errorMsg(OTP_ERRORS, code, serverMsg));
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setError('');
    setNotice('');
    setResending(true);
    try {
      const result = await resendOtpRequest(currentPendingToken);
      setCurrentPendingToken(result.pending_token);
      setOtp('');
      setNotice(result.dev_otp ? `New code sent. Dev code: ${result.dev_otp}` : 'New code sent.');
    } catch (err) {
      const code = err?.response?.data?.error?.code;
      if (code === 'ADMIN_AUTH_OTP_EXPIRED') {
        setError('Session expired. Please log in again.');
        setLocked(true);
      } else {
        setError('Failed to resend code. Please try again.');
      }
    } finally {
      setResending(false);
    }
  }

  return (
    <>
      <div className="mb-6">
        <div className="w-10 h-10 rounded-xl bg-[#EEF4FF] flex items-center justify-center mb-4">
          <i className="fa-solid fa-shield-halved text-[#0057FF] text-base" />
        </div>
        <h2 className="text-lg font-bold text-[#1A1A1A] tracking-tight mb-0.5">Two-step verification</h2>
        <p className="text-xs text-gray-400">
          Enter the 6-digit code sent to your registered email.
          {devOtp && (
            <span className="ml-1 text-amber-600 font-semibold">[Dev: {devOtp}]</span>
          )}
        </p>
      </div>

      {error && (
        <div className="mb-4 flex items-start gap-2.5 bg-red-50 border border-red-100 rounded-lg px-3 py-2.5">
          <i className="fa-solid fa-circle-exclamation text-red-400 text-xs mt-0.5 flex-shrink-0" />
          <p className="text-xs text-red-600 font-medium">{error}</p>
        </div>
      )}

      {notice && (
        <div className="mb-4 flex items-start gap-2.5 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2.5">
          <i className="fa-solid fa-circle-check text-emerald-500 text-xs mt-0.5 flex-shrink-0" />
          <p className="text-xs text-emerald-700 font-medium">{notice}</p>
        </div>
      )}

      {locked ? (
        <button onClick={onBack}
          className="w-full bg-[#0057FF] text-white font-bold text-xs px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-sm">
          <i className="fa-solid fa-arrow-left text-xs" />Back to login
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <OtpBoxes value={otp} onChange={setOtp} disabled={loading || resending} />

          <button type="submit" disabled={loading || resending || otp.length !== 6}
            className="w-full bg-[#0057FF] text-white font-bold text-xs px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm">
            {loading
              ? <><i className="fa-solid fa-spinner fa-spin text-xs" />Verifying…</>
              : <><i className="fa-solid fa-lock-open text-xs" />Verify & Sign in</>}
          </button>

          <div className="flex items-center justify-between text-[11px]">
            <button type="button" onClick={onBack} disabled={loading || resending}
              className="text-gray-400 hover:text-[#1A1A1A] transition-colors flex items-center gap-1 disabled:opacity-50">
              <i className="fa-solid fa-arrow-left text-[10px]" />Back
            </button>
            <button type="button" onClick={handleResend} disabled={loading || resending}
              className="text-[#0057FF] hover:text-blue-700 font-semibold transition-colors flex items-center gap-1 disabled:opacity-50">
              {resending
                ? <><i className="fa-solid fa-spinner fa-spin text-[10px]" />Sending…</>
                : <><i className="fa-solid fa-rotate-right text-[10px]" />Resend code</>}
            </button>
          </div>
        </form>
      )}
    </>
  );
}

// ─── Page shell ───────────────────────────────────────────────
export default function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const [step, setStep] = useState('credentials'); // 'credentials' | 'otp'
  const [pendingToken, setPendingToken] = useState('');
  const [devOtp, setDevOtp] = useState('');

  const handleCredSuccess = useCallback((result) => {
    setPendingToken(result.pending_token);
    setDevOtp(result.dev_otp || '');
    setStep('otp');
  }, []);

  const handleOtpSuccess = useCallback(() => {
    navigate(from, { replace: true });
  }, [navigate, from]);

  const handleBack = useCallback(() => {
    setPendingToken('');
    setDevOtp('');
    setStep('credentials');
  }, []);

  return (
    <div className="w-full md:w-[58%] bg-gray-50 flex items-center justify-center p-6 md:p-12">
      <div className="w-full max-w-sm">
        {/* Mobile brand */}
        <div className="md:hidden flex items-center gap-2.5 mb-8">
          <div className="w-8 h-8 rounded-lg bg-[#0057FF] flex items-center justify-center shadow-sm">
            <i className="fa-solid fa-shield-halved text-white text-xs" />
          </div>
          <div>
            <p className="font-bold text-[#1A1A1A] text-sm">SureLink</p>
            <p className="text-[10px] text-gray-400">Admin Portal</p>
          </div>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-5">
          {['credentials', 'otp'].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${
                step === s ? 'bg-[#0057FF] text-white' : i < ['credentials', 'otp'].indexOf(step) ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-400'
              }`}>
                {i < ['credentials', 'otp'].indexOf(step) ? <i className="fa-solid fa-check text-[8px]" /> : i + 1}
              </div>
              {i === 0 && <div className={`flex-1 h-px w-8 ${step === 'otp' ? 'bg-emerald-400' : 'bg-gray-200'}`} />}
            </div>
          ))}
          <span className="text-[10px] text-gray-400 ml-1">{step === 'credentials' ? 'Credentials' : 'Verification'}</span>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
          {step === 'credentials'
            ? <CredentialsStep onSuccess={handleCredSuccess} />
            : <OtpStep pendingToken={pendingToken} devOtp={devOtp} onBack={handleBack} onSuccess={handleOtpSuccess} />}
        </div>

        <p className="mt-5 text-center text-[11px] text-gray-400">
          Access restricted to authorised SureLink administrators.
        </p>
      </div>
    </div>
  );
}
