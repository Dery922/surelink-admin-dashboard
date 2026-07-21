import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePageTitle } from '../context/PageTitleContext.jsx';
import StatusBadge from '../components/shared/StatusBadge.jsx';
import DataTable from '../components/shared/DataTable.jsx';
import Pagination from '../components/shared/Pagination.jsx';
import ErrorBanner from '../components/shared/ErrorBanner.jsx';
import EmptyState from '../components/shared/EmptyState.jsx';
import { getCustomers } from '../api/customers.js';

const STATUSES = ['all', 'active', 'pending', 'suspended', 'banned'];
const LIMIT = 20;

const COLUMNS = [
  { key: 'name', header: 'Customer' },
  { key: 'contact', header: 'Contact' },
  { key: 'area', header: 'Area' },
  { key: 'rating', header: 'Rating', align: 'right' },
  { key: 'status', header: 'Status' },
  { key: 'joined', header: 'Joined' },
];

export default function CustomersPage() {
  const { setPageTitle } = usePageTitle();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { setPageTitle('Customers'); }, [setPageTitle]);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await getCustomers({
        page, limit: LIMIT,
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(search && { search }),
      });
      setData(result);
    } catch {
      setError('Failed to load customers.');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, page]);

  useEffect(() => {
    const t = setTimeout(fetchCustomers, search ? 400 : 0);
    return () => clearTimeout(t);
  }, [fetchCustomers, search]);

  useEffect(() => { setPage(1); }, [search, statusFilter]);

  const stats = data?.stats || {};
  const customers = data?.customers || [];
  const total = data?.total || 0;

  const renderCell = (c, key) => {
    switch (key) {
      case 'name': return <span className="font-semibold text-[#0057FF]">{c.name?.full || '—'}</span>;
      case 'contact':
        return (
          <div className="leading-tight">
            <p className="text-[#1A1A1A]">{c.phone || '—'}</p>
            {c.email && <p className="text-[11.5px] text-gray-400">{c.email}</p>}
          </div>
        );
      case 'area': return c.location?.home_address?.area || <span className="text-gray-400">—</span>;
      case 'rating':
        return c.trust?.average_rating != null
          ? <span className="tabular-nums text-[#1A1A1A]"><i className="fa-solid fa-star text-[#FF6B00] text-[10px] mr-1" />{c.trust.average_rating.toFixed(1)}</span>
          : <span className="text-gray-400">—</span>;
      case 'status': return <StatusBadge status={c.status} />;
      case 'joined': return <span className="text-gray-500 tabular-nums">{new Date(c.createdAt).toLocaleDateString()}</span>;
      default: return null;
    }
  };

  return (
    <div className="p-6 max-w-[1280px] mx-auto space-y-6">
      <div>
        <h1 className="text-[20px] font-bold text-[#1A1A1A] tracking-tight">Customers</h1>
        <p className="text-[13.5px] text-gray-500 mt-0.5">View and manage customer accounts on the SureLink platform</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: stats.total ?? '—', dot: 'bg-gray-300', color: 'text-[#1A1A1A]' },
          { label: 'Active', value: stats.active ?? '—', dot: 'bg-emerald-500', color: 'text-emerald-600' },
          { label: 'Pending', value: stats.pending ?? '—', dot: 'bg-amber-500', color: 'text-amber-600' },
          { label: 'Suspended', value: stats.suspended ?? '—', dot: 'bg-red-500', color: 'text-red-600' },
        ].map(({ label, value, dot, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <div className="flex items-center gap-2 text-[12px] font-medium text-gray-500">
              <span className={`h-2 w-2 rounded-full ${dot}`} />{label}
            </div>
            <p className={`mt-2 text-[24px] font-bold leading-none tracking-tight tabular-nums ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      <ErrorBanner message={error} onDismiss={() => setError('')} />

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="flex flex-col gap-3 border-b border-gray-100 p-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-xs">
            <i className="fa-solid fa-magnifying-glass pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[12px] text-gray-400" />
            <input
              type="text"
              aria-label="Search customers"
              placeholder="Search by name, email, phone…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-[13px] text-[#1A1A1A] placeholder:text-gray-400 outline-none transition-all focus:border-[#C7D9FF] focus:bg-white focus:ring-2 focus:ring-[#0057FF]/20"
            />
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`whitespace-nowrap text-[12px] font-semibold px-3 py-1.5 rounded-lg transition-colors capitalize ${
                  statusFilter === s ? 'bg-[#0057FF] text-white shadow-sm' : 'text-gray-500 font-medium hover:bg-gray-100 hover:text-[#1A1A1A]'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <DataTable
          columns={COLUMNS}
          rows={customers}
          renderCell={renderCell}
          loading={loading}
          loadingLabel="Loading customers…"
          onRowClick={(c) => navigate(`/customers/${c._id}`)}
          empty={<EmptyState icon="fa-users" title="No customers found" message="Try adjusting your search or filters." />}
        />

        <Pagination page={page} limit={LIMIT} total={total} shown={customers.length} onPageChange={setPage} />
      </div>
    </div>
  );
}
