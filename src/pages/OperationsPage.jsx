import { useEffect, useState, useCallback } from 'react';
import { usePageTitle } from '../context/PageTitleContext.jsx';
import StatusBadge from '../components/shared/StatusBadge.jsx';
import { getOperationsSummary, getDeliveries } from '../api/operations.js';
import { relativeTime } from '../utils/relativeTime.js';

function ZoneBar({ utilisation }) {
  const color = utilisation >= 90 ? 'bg-red-500' : utilisation >= 75 ? 'bg-[#FF6B00]' : 'bg-emerald-500';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${Math.min(utilisation, 100)}%` }} />
      </div>
      <span className={`text-[11px] font-semibold w-8 text-right ${utilisation >= 90 ? 'text-red-500' : utilisation >= 75 ? 'text-[#FF6B00]' : 'text-emerald-600'}`}>{utilisation}%</span>
    </div>
  );
}

export default function OperationsPage() {
  const { setPageTitle } = usePageTitle();
  const [statusFilter, setStatusFilter] = useState('all');
  const [summary, setSummary] = useState(null);
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { setPageTitle('Operations'); }, [setPageTitle]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [sum, delData] = await Promise.all([
        getOperationsSummary(),
        getDeliveries({ ...(statusFilter !== 'all' && { status: statusFilter }) }),
      ]);
      setSummary(sum);
      setDeliveries(delData.deliveries || []);
    } catch {
      setError('Failed to load operations data.');
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const zones = summary?.zones || [];

  return (
    <div className="p-5 max-w-[1280px] mx-auto space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-base font-bold text-[#1A1A1A] tracking-tight">Operations</h1>
          <p className="text-xs text-gray-400 mt-0.5">Monitor live deliveries and zone performance</p>
        </div>
        <button onClick={fetchData} className="flex items-center gap-2 bg-white text-[#1A1A1A] text-xs font-bold px-3 py-2 rounded-lg border border-gray-200 hover:border-[#0057FF] hover:text-[#0057FF] transition-colors shadow-sm">
          <i className={`fa-solid fa-arrow-rotate-right text-[10px] ${loading ? 'fa-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Stat strip */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Active Deliveries', value: summary?.active_deliveries ?? '—', icon: 'fa-solid fa-truck-fast', color: 'text-[#0057FF]', bg: 'bg-[#EEF4FF]' },
          { label: 'Completed Today', value: summary?.completed_today ?? '—', icon: 'fa-solid fa-circle-check', color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Delayed', value: summary?.delayed ?? '—', icon: 'fa-solid fa-triangle-exclamation', color: 'text-[#FF6B00]', bg: 'bg-orange-50' },
          { label: 'Avg Delivery Time', value: summary?.avg_delivery_minutes ? `${summary.avg_delivery_minutes} min` : '—', icon: 'fa-solid fa-stopwatch', color: 'text-purple-600', bg: 'bg-purple-50' },
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

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-lg px-4 py-3 text-xs text-red-600">
          <i className="fa-solid fa-circle-exclamation" />{error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Deliveries */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-gray-50">
            <div>
              <h2 className="text-sm font-semibold text-[#1A1A1A] tracking-tight">Live Deliveries</h2>
              <p className="text-[11px] text-gray-400 mt-0.5">All deliveries in the last 24 hours</p>
            </div>
            <div className="flex items-center gap-1 flex-wrap">
              {['all', 'in_transit', 'delayed', 'completed'].map((s) => (
                <button key={s} onClick={() => setStatusFilter(s)}
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border transition-colors capitalize ${statusFilter === s ? 'bg-[#0057FF] text-white border-[#0057FF]' : 'bg-white text-gray-500 border-gray-200 hover:border-[#0057FF] hover:text-[#0057FF]'}`}>
                  {s === 'all' ? 'All' : s.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-12 text-gray-400 text-xs gap-2">
              <i className="fa-solid fa-spinner fa-spin" /> Loading…
            </div>
          ) : (
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50/60 border-b border-gray-50">
                  {['ID', 'Customer', 'Route', 'Status', 'ETA', 'Started'].map(h => (
                    <th key={h} className="text-left px-4 py-2.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {deliveries.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-10 text-gray-400 text-xs">
                    <i className="fa-solid fa-truck-fast text-2xl text-gray-200 block mb-2" />
                    No deliveries found
                  </td></tr>
                ) : deliveries.map((d, i) => (
                  <tr key={d._id} className={`border-b border-gray-50 hover:bg-[#F5F8FF] transition-colors ${i === deliveries.length - 1 ? 'border-0' : ''}`}>
                    <td className="px-4 py-3 font-mono font-semibold text-[#0057FF]">{d.reference}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-[#1A1A1A]">{d.customer_name}</p>
                      <p className="text-[10px] text-gray-400">{d.driver_name || '—'}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-gray-500">
                        <span>{d.from_address}</span>
                        <i className="fa-solid fa-arrow-right text-[9px] text-gray-300" />
                        <span>{d.to_address}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={d.status} /></td>
                    <td className="px-4 py-3 font-medium text-[#1A1A1A]">{d.eta_minutes ? `${d.eta_minutes} min` : '—'}</td>
                    <td className="px-4 py-3 text-gray-400">{d.started_at ? relativeTime(d.started_at) : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Zones */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="px-4 pt-4 pb-3 border-b border-gray-50">
            <h2 className="text-sm font-semibold text-[#1A1A1A] tracking-tight">Zone Utilisation</h2>
            <p className="text-[11px] text-gray-400 mt-0.5">Active drivers vs capacity per zone</p>
          </div>
          <div className="p-4 space-y-4">
            {zones.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-4">No zones configured</p>
            ) : zones.map((z) => (
              <div key={z.id}>
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-xs font-medium text-[#1A1A1A] leading-tight">{z.name}</p>
                  <span className="text-[11px] text-gray-400">{z.active_drivers}/{z.capacity}</span>
                </div>
                <ZoneBar utilisation={z.utilisation_pct} />
              </div>
            ))}
            <div className="pt-2 border-t border-gray-50 flex items-center gap-3 text-[11px] text-gray-400">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />Normal</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#FF6B00] inline-block" />High</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500 inline-block" />Critical</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
