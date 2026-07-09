import { useEffect, useState } from 'react';
import { usePageTitle } from '../context/PageTitleContext.jsx';
import { useAuth } from '../hooks/useAuth.js';
import StatusBadge from '../components/shared/StatusBadge.jsx';
import { getAdmins, createAdmin, deleteAdmin, unlockAdmin } from '../api/adminManagement.js';
import { getSettings, updateSettings } from '../api/settings.js';
import { ROLE_LABELS } from '../constants/navigation.js';
import { ADMIN_ROLES } from '../constants/navigation.js';
import { relativeTime } from '../utils/relativeTime.js';

const TABS = [
  { id: 'admins', label: 'Admin Accounts', icon: 'fa-solid fa-users-gear' },
  { id: 'platform', label: 'Platform', icon: 'fa-solid fa-sliders' },
  { id: 'security', label: 'Security', icon: 'fa-solid fa-shield-halved' },
];

// ── Admin Accounts Tab ────────────────────────────────────────
function AdminsTab() {
  const { admin: currentAdmin } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', role: 'OPERATIONS_ADMIN', password: '' });
  const [submitting, setSubmitting] = useState(false);

  async function fetchAdmins() {
    setLoading(true);
    try { setAdmins(await getAdmins()); }
    catch { setError('Failed to load admins.'); }
    finally { setLoading(false); }
  }

  useEffect(() => { fetchAdmins(); }, []);

  async function handleCreate(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createAdmin(form);
      setShowCreate(false);
      setForm({ name: '', email: '', role: 'OPERATIONS_ADMIN', password: '' });
      await fetchAdmins();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to create admin.');
    } finally { setSubmitting(false); }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this admin account? This cannot be undone.')) return;
    try { await deleteAdmin(id); await fetchAdmins(); }
    catch (err) { setError(err?.response?.data?.message || 'Failed to delete admin.'); }
  }

  async function handleUnlock(id) {
    try { await unlockAdmin(id); await fetchAdmins(); }
    catch { setError('Failed to unlock account.'); }
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-lg px-4 py-3 text-xs text-red-600">
          <i className="fa-solid fa-circle-exclamation" />{error}
          <button onClick={() => setError('')} className="ml-auto"><i className="fa-solid fa-xmark" /></button>
        </div>
      )}

      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-400">{admins.length} admin account{admins.length !== 1 ? 's' : ''}</p>
        <button onClick={() => setShowCreate(v => !v)}
          className="flex items-center gap-2 bg-[#0057FF] text-white text-xs font-bold px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
          <i className={`fa-solid ${showCreate ? 'fa-xmark' : 'fa-plus'} text-[10px]`} />
          {showCreate ? 'Cancel' : 'Invite Admin'}
        </button>
      </div>

      {showCreate && (
        <form onSubmit={handleCreate} className="bg-white rounded-xl border border-[#C7D9FF] shadow-sm p-5 space-y-3">
          <h3 className="text-sm font-semibold text-[#1A1A1A]">New Admin Account</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Full name', key: 'name', type: 'text', placeholder: 'John Doe' },
              { label: 'Email', key: 'email', type: 'email', placeholder: 'admin@surelink.dev' },
              { label: 'Password', key: 'password', type: 'password', placeholder: 'Min. 8 characters' },
            ].map(({ label, key, type, placeholder }) => (
              <div key={key}>
                <label className="block text-[11px] font-semibold text-[#1A1A1A] mb-1">{label}</label>
                <input type={type} placeholder={placeholder} value={form[key]}
                  onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:border-[#0057FF] focus:bg-white transition-all" />
              </div>
            ))}
            <div>
              <label className="block text-[11px] font-semibold text-[#1A1A1A] mb-1">Role</label>
              <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:border-[#0057FF] focus:bg-white transition-all">
                {Object.entries(ROLE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setShowCreate(false)}
              className="text-xs font-semibold text-gray-500 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">Cancel</button>
            <button type="submit" disabled={submitting}
              className="flex items-center gap-2 bg-[#0057FF] text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
              {submitting ? <><i className="fa-solid fa-spinner fa-spin" />Creating…</> : 'Create Account'}
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-10 text-gray-400 text-xs gap-2">
            <i className="fa-solid fa-spinner fa-spin" /> Loading…
          </div>
        ) : (
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50/60 border-b border-gray-50">
                {['Admin', 'Role', 'Status', 'Last Login', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {admins.map((a, i) => {
                const isSelf = a.email === currentAdmin?.email;
                return (
                  <tr key={a.id} className={`border-b border-gray-50 hover:bg-[#F5F8FF] transition-colors ${i === admins.length - 1 ? 'border-0' : ''}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#0057FF] to-blue-400 flex items-center justify-center flex-shrink-0">
                          <i className="fa-solid fa-user text-white text-[10px]" />
                        </div>
                        <div>
                          <p className="font-semibold text-[#1A1A1A] flex items-center gap-1.5">
                            {a.name?.full || a.name}
                            {isSelf && <span className="text-[10px] font-medium bg-[#EEF4FF] text-[#0057FF] px-1.5 py-0.5 rounded-full border border-[#C7D9FF]">You</span>}
                          </p>
                          <p className="text-[10px] text-gray-400">{a.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 font-medium">{ROLE_LABELS[a.role] || a.role}</td>
                    <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                    <td className="px-4 py-3 text-gray-400">{a.last_login_at ? relativeTime(a.last_login_at) : '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        {a.locked_until && new Date(a.locked_until) > new Date() && (
                          <button onClick={() => handleUnlock(a.id)}
                            className="w-7 h-7 rounded-lg border border-amber-200 text-amber-600 hover:bg-amber-50 flex items-center justify-center transition-colors" title="Unlock account">
                            <i className="fa-solid fa-lock-open text-[10px]" />
                          </button>
                        )}
                        {!isSelf && (
                          <button onClick={() => handleDelete(a.id)}
                            className="w-7 h-7 rounded-lg border border-red-200 text-red-400 hover:bg-red-50 flex items-center justify-center transition-colors" title="Remove">
                            <i className="fa-solid fa-trash text-[10px]" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ── Platform / Security tabs ─────────────────────────────────
function Toggle({ value, onChange }) {
  return (
    <button onClick={() => onChange(!value)}
      className={`relative w-9 h-5 rounded-full transition-colors ${value ? 'bg-[#0057FF]' : 'bg-gray-200'}`}>
      <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${value ? 'translate-x-4' : ''}`} />
    </button>
  );
}

function SettingRow({ label, description, children }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0">
      <div>
        <p className="text-xs font-semibold text-[#1A1A1A]">{label}</p>
        {description && <p className="text-[11px] text-gray-400 mt-0.5">{description}</p>}
      </div>
      <div className="flex-shrink-0 ml-8">{children}</div>
    </div>
  );
}

function NumericInput({ value, onChange, suffix }) {
  return (
    <div className="flex items-center gap-2">
      <input type="number" value={value ?? ''} onChange={e => onChange(Number(e.target.value))}
        className="w-16 text-xs font-semibold text-[#1A1A1A] text-center border border-gray-200 rounded-lg py-1.5 focus:outline-none focus:border-[#0057FF]" />
      {suffix && <span className="text-xs text-gray-400 font-medium">{suffix}</span>}
    </div>
  );
}

function PlatformTab({ settings, setSettings, onSave, saving }) {
  if (!settings) return <div className="flex justify-center py-10 text-xs text-gray-400 gap-2"><i className="fa-solid fa-spinner fa-spin" /> Loading…</div>;
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
      <div className="px-5 pt-4 pb-3 border-b border-gray-50">
        <h3 className="text-sm font-semibold text-[#1A1A1A]">Platform Configuration</h3>
        <p className="text-[11px] text-gray-400 mt-0.5">System-wide settings for the SureLink platform</p>
      </div>
      <div className="px-5">
        <SettingRow label="Max delivery radius" description="Maximum service radius allowed for provider registration">
          <NumericInput value={settings.max_delivery_radius_km} onChange={v => setSettings(s => ({ ...s, max_delivery_radius_km: v }))} suffix="km" />
        </SettingRow>
        <SettingRow label="Provider auto-approval" description="Automatically approve providers that pass document verification">
          <Toggle value={settings.provider_auto_approval} onChange={v => setSettings(s => ({ ...s, provider_auto_approval: v }))} />
        </SettingRow>
        <SettingRow label="Maintenance mode" description="Take the platform offline for maintenance">
          <Toggle value={settings.maintenance_mode} onChange={v => setSettings(s => ({ ...s, maintenance_mode: v }))} />
        </SettingRow>
        <SettingRow label="OTP expiry" description="How long an OTP code remains valid after issue">
          <NumericInput value={settings.otp_expiry_minutes} onChange={v => setSettings(s => ({ ...s, otp_expiry_minutes: v }))} suffix="minutes" />
        </SettingRow>
        <SettingRow label="Push notifications" description="Enable push notifications to customers and providers">
          <Toggle value={settings.push_notifications_enabled} onChange={v => setSettings(s => ({ ...s, push_notifications_enabled: v }))} />
        </SettingRow>
      </div>
      <div className="px-5 py-4 border-t border-gray-50 flex justify-end">
        <button onClick={onSave} disabled={saving}
          className="flex items-center gap-2 bg-[#0057FF] text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50">
          {saving ? <><i className="fa-solid fa-spinner fa-spin" />Saving…</> : <><i className="fa-solid fa-floppy-disk text-[10px]" />Save changes</>}
        </button>
      </div>
    </div>
  );
}

function SecurityTab({ settings, setSettings, onSave, saving }) {
  if (!settings) return <div className="flex justify-center py-10 text-xs text-gray-400 gap-2"><i className="fa-solid fa-spinner fa-spin" /> Loading…</div>;
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
      <div className="px-5 pt-4 pb-3 border-b border-gray-50">
        <h3 className="text-sm font-semibold text-[#1A1A1A]">Security Settings</h3>
        <p className="text-[11px] text-gray-400 mt-0.5">Authentication and access control configuration</p>
      </div>
      <div className="px-5">
        <SettingRow label="Admin session TTL" description="How long an admin session token stays valid">
          <NumericInput value={settings.admin_session_ttl_hours} onChange={v => setSettings(s => ({ ...s, admin_session_ttl_hours: v }))} suffix="hours" />
        </SettingRow>
        <SettingRow label="Login lockout threshold" description="Failed login attempts before account is locked">
          <NumericInput value={settings.login_lockout_threshold} onChange={v => setSettings(s => ({ ...s, login_lockout_threshold: v }))} suffix="attempts" />
        </SettingRow>
        <SettingRow label="Lockout duration" description="How long a locked admin account remains inaccessible">
          <NumericInput value={settings.lockout_duration_minutes} onChange={v => setSettings(s => ({ ...s, lockout_duration_minutes: v }))} suffix="minutes" />
        </SettingRow>
        <SettingRow label="Require strong passwords" description="Enforce minimum 12 characters with mixed case, numbers, and symbols">
          <Toggle value={settings.require_strong_passwords} onChange={v => setSettings(s => ({ ...s, require_strong_passwords: v }))} />
        </SettingRow>
        <SettingRow label="Token rotation on refresh" description="Issue a new token on every session refresh (revokes the old one)">
          <Toggle value={settings.token_rotation_on_refresh} onChange={v => setSettings(s => ({ ...s, token_rotation_on_refresh: v }))} />
        </SettingRow>
      </div>
      <div className="px-5 py-4 border-t border-gray-50 flex justify-end">
        <button onClick={onSave} disabled={saving}
          className="flex items-center gap-2 bg-[#0057FF] text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50">
          {saving ? <><i className="fa-solid fa-spinner fa-spin" />Saving…</> : <><i className="fa-solid fa-floppy-disk text-[10px]" />Save changes</>}
        </button>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────
export default function SettingsPage() {
  const { setPageTitle } = usePageTitle();
  const [activeTab, setActiveTab] = useState('admins');
  const [settings, setSettings] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  useEffect(() => { setPageTitle('Settings'); }, [setPageTitle]);

  useEffect(() => {
    if ((activeTab === 'platform' || activeTab === 'security') && !settings) {
      getSettings().then(setSettings).catch(() => {});
    }
  }, [activeTab, settings]);

  async function handleSave() {
    setSaving(true);
    setSaveMsg('');
    try {
      const updated = await updateSettings(settings);
      setSettings(updated);
      setSaveMsg('Settings saved.');
      setTimeout(() => setSaveMsg(''), 3000);
    } catch {
      setSaveMsg('Failed to save settings.');
    } finally { setSaving(false); }
  }

  return (
    <div className="p-5 max-w-[1280px] mx-auto space-y-4">
      <div>
        <h1 className="text-base font-bold text-[#1A1A1A] tracking-tight">Settings</h1>
        <p className="text-xs text-gray-400 mt-0.5">Platform configuration and admin account management</p>
      </div>

      {saveMsg && (
        <div className={`flex items-center gap-2 rounded-lg px-4 py-3 text-xs font-medium ${saveMsg.includes('Failed') ? 'bg-red-50 border border-red-100 text-red-600' : 'bg-emerald-50 border border-emerald-100 text-emerald-700'}`}>
          <i className={`fa-solid ${saveMsg.includes('Failed') ? 'fa-circle-exclamation' : 'fa-circle-check'}`} />
          {saveMsg}
        </div>
      )}

      <div className="flex items-center gap-1 bg-white rounded-xl border border-gray-100 shadow-sm p-1 w-fit">
        {TABS.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${activeTab === tab.id ? 'bg-[#EEF4FF] text-[#0057FF] shadow-[inset_0_0_0_1px_#C7D9FF]' : 'text-gray-500 hover:text-[#1A1A1A] hover:bg-gray-50'}`}>
            <i className={`${tab.icon} text-[11px]`} />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'admins' && <AdminsTab />}
      {activeTab === 'platform' && <PlatformTab settings={settings} setSettings={setSettings} onSave={handleSave} saving={saving} />}
      {activeTab === 'security' && <SecurityTab settings={settings} setSettings={setSettings} onSave={handleSave} saving={saving} />}
    </div>
  );
}
