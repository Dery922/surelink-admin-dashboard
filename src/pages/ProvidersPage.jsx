import { useEffect, useState, useCallback } from 'react';
import { usePageTitle } from '../context/PageTitleContext.jsx';
import StatusBadge from '../components/shared/StatusBadge.jsx';
import { getProviders, approveProvider, suspendProvider, reinstateProvider } from '../api/providers.js';

const STATUSES = ['All', 'active', 'pending', 'suspended'];

function StarRating({ rating }) {
  return (
    <span className="flex items-center gap-1 text-xs">
      <i className="fa-solid fa-star text-[#FF6B00] text-[10px]" />
      <span className="font-semibold text-[#1A1A1A]">{rating > 0 ? Number(rating).toFixed(1) : '—'}</span>
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
    <div className="p-5 max-w-[1280px] mx-auto space-y-4">

      {/* Header */}
      <div>
        <h1 className="text-base font-bold text-[#1A1A1A] tracking-tight">Providers</h1>
        <p className="text-xs text-gray-400 mt-0.5">
          Review and manage provider accounts registered through the SureLink platform
        </p>
      </div>

      {/* Stat strip */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total',     value: stats.total   ?? '—', icon: 'fa-solid fa-building',       color: 'text-[#0057FF]',  bg: 'bg-[#EEF4FF]' },
          { label: 'Active',    value: stats.active  ?? '—', icon: 'fa-solid fa-circle-check',   color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Pending',   value: stats.pending ?? '—', icon: 'fa-solid fa-hourglass-half', color: 'text-amber-600',  bg: 'bg-amber-50' },
          { label: 'Suspended', value: stats.suspended ?? '—', icon: 'fa-solid fa-ban',          color: 'text-red-500',    bg: 'bg-red-50' },
        ].map(({ label, value, icon, color, bg }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center flex-shrink-0`}>
              <i className={`${icon} ${color} text-xs`} />
            </div>
            <div>
              <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wide">{label}</p>
              <p className="text-lg font-bold text-[#1A1A1A] leading-tight">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-xs" />
          <input
            type="text"
            placeholder="Search by name, email or phone…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-gray-200 bg-gray-50 text-[#1A1A1A] placeholder-gray-300 focus:outline-none focus:border-[#0057FF] focus:ring-2 focus:ring-[#0057FF]/15 focus:bg-white transition-all"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] text-gray-400 font-medium">Status:</span>
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border transition-colors capitalize ${
                statusFilter === s
                  ? 'bg-[#0057FF] text-white border-[#0057FF]'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-[#0057FF] hover:text-[#0057FF]'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-lg px-4 py-3 text-xs text-red-600">
          <i className="fa-solid fa-circle-exclamation" />
          {error}
          <button onClick={() => setError('')} className="ml-auto"><i className="fa-solid fa-xmark" /></button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-400 gap-2 text-xs">
            <i className="fa-solid fa-spinner fa-spin" /> Loading providers…
          </div>
        ) : (
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/60">
                {['Provider', 'Category', 'Status', 'Rating', 'Rate/hr', 'Radius', 'Joined', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {providers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-gray-400 text-xs">
                    <i className="fa-solid fa-building text-2xl text-gray-200 block mb-2" />
                    No providers match your filters
                  </td>
                </tr>
              ) : providers.map((p, i) => {
                const isPending = p.status === 'verification_pending';
                const isActive = p.status === 'active';
                const isSuspended = p.status === 'suspended';

                return (
                  <tr
                    key={p._id}
                    className={`border-b border-gray-50 hover:bg-[#F5F8FF] transition-colors ${i === providers.length - 1 ? 'border-0' : ''}`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-[#EEF4FF] flex items-center justify-center flex-shrink-0">
                          <i className="fa-solid fa-building text-[#0057FF] text-[10px]" />
                        </div>
                        <div>
                          <p className="font-semibold text-[#1A1A1A]">{p.name?.full || '—'}</p>
                          <p className="text-[10px] text-gray-400">{p.email || p.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{p.provider_profile?.category || '—'}</td>
                    <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                    <td className="px-4 py-3">
                      <StarRating rating={p.trust?.average_rating || 0} />
                      <span className="text-[10px] text-gray-400 ml-1">({p.trust?.total_ratings || 0})</span>
                    </td>
                    <td className="px-4 py-3 font-medium text-[#1A1A1A]">
                      {p.provider_profile?.hourly_rate ? `GH₵${p.provider_profile.hourly_rate}` : '—'}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {p.provider_profile?.service_radius_km ? `${p.provider_profile.service_radius_km} km` : '—'}
                    </td>
                    <td className="px-4 py-3 text-gray-400">{new Date(p.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      {actionLoading === p._id ? (
                        <i className="fa-solid fa-spinner fa-spin text-gray-400" />
                      ) : (
                        <div className="flex items-center gap-1.5">
                          {isPending && (
                            <button
                              onClick={() => handleAction(p._id, 'approve')}
                              className="w-7 h-7 rounded-lg border border-emerald-200 text-emerald-600 hover:bg-emerald-50 flex items-center justify-center transition-colors"
                              title="Approve"
                            >
                              <i className="fa-solid fa-check text-[10px]" />
                            </button>
                          )}
                          {isActive && (
                            <button
                              onClick={() => handleAction(p._id, 'suspend')}
                              className="w-7 h-7 rounded-lg border border-orange-200 text-[#FF6B00] hover:bg-orange-50 flex items-center justify-center transition-colors"
                              title="Suspend"
                            >
                              <i className="fa-solid fa-ban text-[10px]" />
                            </button>
                          )}
                          {isSuspended && (
                            <button
                              onClick={() => handleAction(p._id, 'reinstate')}
                              className="w-7 h-7 rounded-lg border border-emerald-200 text-emerald-600 hover:bg-emerald-50 flex items-center justify-center transition-colors"
                              title="Reinstate"
                            >
                              <i className="fa-solid fa-rotate-left text-[10px]" />
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
        )}
        <div className="px-4 py-3 border-t border-gray-50 flex items-center justify-between">
          <p className="text-[11px] text-gray-400">
            Showing <span className="font-semibold text-[#1A1A1A]">{providers.length}</span> of {total} providers
          </p>
        </div>
      </div>
    </div>
  );
}
