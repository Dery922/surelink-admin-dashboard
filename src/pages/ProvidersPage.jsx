import { useEffect, useState, useCallback } from 'react';
import { usePageTitle } from '../context/PageTitleContext.jsx';
import StatusBadge from '../components/shared/StatusBadge.jsx';
import { getProviders, approveProvider, suspendProvider, reinstateProvider } from '../api/providers.js';

const STATUSES = ['All', 'active', 'pending', 'suspended'];

function initials(name) {
  if (!name) return '—';
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase() || '—';
}

function StarRating({ rating }) {
  const has = rating > 0;
  return (
    <span className="inline-flex items-center gap-1 font-semibold tabular-nums">
      <i className={`fa-solid fa-star text-[11px] ${has ? 'text-[#FF6B00]' : 'text-gray-300'}`} />
      <span className={has ? 'text-[#1A1A1A]' : 'text-gray-400'}>{has ? Number(rating).toFixed(1) : '—'}</span>
    </span>
  );
}

export default function ProvidersPage() {
  const { setPageTitle } = usePageTitle();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => { setPageTitle('Providers'); }, [setPageTitle]);

  const fetchProviders = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await getProviders({
        ...(statusFilter !== 'All' && { status: statusFilter }),
        ...(search && { search }),
      });
      setData(result);
    } catch {
      setError('Failed to load providers.');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    const t = setTimeout(fetchProviders, search ? 400 : 0);
    return () => clearTimeout(t);
  }, [fetchProviders, search]);

  async function handleAction(id, action) {
    setActionLoading(id);
    try {
      if (action === 'approve') await approveProvider(id);
      if (action === 'suspend') await suspendProvider(id);
      if (action === 'reinstate') await reinstateProvider(id);
      await fetchProviders();
    } catch (err) {
      setError(err?.response?.data?.message || 'Action failed. Please try again.');
    } finally {
      setActionLoading(null);
    }
  }

  const stats = data?.stats || {};
  const providers = data?.providers || [];
  const total = data?.total || 0;

  return (
    <div className="p-6 max-w-[1280px] mx-auto space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-[20px] font-bold text-[#1A1A1A] tracking-tight">Providers</h1>
        <p className="text-[13.5px] text-gray-500 mt-0.5">
          Review and manage provider accounts registered through the SureLink platform
        </p>
      </div>

      {/* Stat strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total',     value: stats.total     ?? '—', dot: 'bg-gray-300',    color: 'text-[#1A1A1A]' },
          { label: 'Active',    value: stats.active    ?? '—', dot: 'bg-emerald-500', color: 'text-emerald-600' },
          { label: 'Pending',   value: stats.pending   ?? '—', dot: 'bg-amber-500',   color: 'text-amber-600' },
          { label: 'Suspended', value: stats.suspended ?? '—', dot: 'bg-red-500',     color: 'text-red-600' },
        ].map(({ label, value, dot, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <div className="flex items-center gap-2 text-[12px] font-medium text-gray-500">
              <span className={`h-2 w-2 rounded-full ${dot}`} />
              {label}
            </div>
            <p className={`mt-2 text-[24px] font-bold leading-none tracking-tight tabular-nums ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-lg px-4 py-3 text-xs text-red-600">
          <i className="fa-solid fa-circle-exclamation" />
          {error}
          <button onClick={() => setError('')} className="ml-auto"><i className="fa-solid fa-xmark" /></button>
        </div>
      )}

      {/* Table card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">

        {/* Filter bar */}
        <div className="flex flex-col gap-3 border-b border-gray-100 p-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-xs">
            <i className="fa-solid fa-magnifying-glass pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[12px] text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email or phone…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-[13px] text-[#1A1A1A] placeholder:text-gray-400 outline-none transition-all focus:border-[#C7D9FF] focus:bg-white focus:ring-2 focus:ring-[#0057FF]/20"
            />
          </div>
          <div className="flex items-center gap-1.5">
            {STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`text-[12px] font-semibold px-3 py-1.5 rounded-lg transition-colors capitalize ${
                  statusFilter === s
                    ? 'bg-[#0057FF] text-white shadow-sm'
                    : 'text-gray-500 font-medium hover:bg-gray-100 hover:text-[#1A1A1A]'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-400 gap-2 text-xs">
            <i className="fa-solid fa-spinner fa-spin" /> Loading providers…
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] text-left">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/60 text-[11px] font-semibold uppercase tracking-[0.06em] text-gray-400">
                  <th className="px-5 py-3">Provider</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Rating</th>
                  <th className="px-4 py-3 text-right">Rate/hr</th>
                  <th className="px-4 py-3 text-right">Radius</th>
                  <th className="px-4 py-3">Joined</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-[13px]">
                {providers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-12 text-gray-400 text-xs">
                      <i className="fa-solid fa-building text-2xl text-gray-200 block mb-2" />
                      No providers match your filters
                    </td>
                  </tr>
                ) : providers.map((p) => {
                  const isPending = p.status === 'verification_pending';
                  const isActive = p.status === 'active';
                  const isSuspended = p.status === 'suspended';

                  return (
                    <tr key={p._id} className="group transition-colors hover:bg-[#F5F8FF]">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EEF4FF] text-[12px] font-semibold text-[#0057FF]">
                            {initials(p.name?.full)}
                          </div>
                          <div className="min-w-0 leading-tight">
                            <p className="font-semibold text-[#1A1A1A]">{p.name?.full || '—'}</p>
                            <p className="text-[11.5px] text-gray-400">{p.email || p.phone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-gray-600">{p.provider_profile?.category || '—'}</td>
                      <td className="px-4 py-3.5"><StatusBadge status={p.status} /></td>
                      <td className="px-4 py-3.5"><StarRating rating={p.trust?.average_rating || 0} /></td>
                      <td className="px-4 py-3.5 text-right font-medium text-[#1A1A1A] tabular-nums">
                        {p.provider_profile?.hourly_rate ? `GH₵${p.provider_profile.hourly_rate}` : '—'}
                      </td>
                      <td className="px-4 py-3.5 text-right text-gray-600 tabular-nums">
                        {p.provider_profile?.service_radius_km ? `${p.provider_profile.service_radius_km} km` : '—'}
                      </td>
                      <td className="px-4 py-3.5 text-gray-500 tabular-nums">{new Date(p.createdAt).toLocaleDateString()}</td>
                      <td className="px-5 py-3.5">
                        {actionLoading === p._id ? (
                          <div className="flex justify-end"><i className="fa-solid fa-spinner fa-spin text-gray-400" /></div>
                        ) : (
                          <div className="flex items-center justify-end gap-1.5">
                            {isPending && (
                              <button
                                onClick={() => handleAction(p._id, 'approve')}
                                className="flex h-7 w-7 items-center justify-center rounded-md text-gray-400 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                                title="Approve"
                              >
                                <i className="fa-solid fa-check text-[12px]" />
                              </button>
                            )}
                            {isActive && (
                              <button
                                onClick={() => handleAction(p._id, 'suspend')}
                                className="flex h-7 w-7 items-center justify-center rounded-md text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                                title="Suspend"
                              >
                                <i className="fa-solid fa-ban text-[12px]" />
                              </button>
                            )}
                            {isSuspended && (
                              <button
                                onClick={() => handleAction(p._id, 'reinstate')}
                                className="flex h-7 w-7 items-center justify-center rounded-md text-gray-400 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                                title="Reinstate"
                              >
                                <i className="fa-solid fa-rotate-left text-[12px]" />
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="px-5 py-3.5 border-t border-gray-100">
          <p className="text-[12px] text-gray-500">
            Showing <span className="font-semibold text-[#1A1A1A]">{providers.length}</span> of {total} providers
          </p>
        </div>
      </div>
    </div>
  );
}
