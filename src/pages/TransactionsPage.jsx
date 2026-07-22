import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePageTitle } from '../context/PageTitleContext.jsx';
import StatusBadge from '../components/shared/StatusBadge.jsx';
import DataTable from '../components/shared/DataTable.jsx';
import Pagination from '../components/shared/Pagination.jsx';
import ErrorBanner from '../components/shared/ErrorBanner.jsx';
import EmptyState from '../components/shared/EmptyState.jsx';
import { getTransactions } from '../api/transactions.js';

const STATUSES = ['all', 'processing', 'paid', 'failed', 'refunded', 'disputed'];
const LIMIT = 20;

const money = (amount, currency = 'GHS') =>
  amount != null ? `GH₵${Number(amount).toLocaleString()} ${currency}`.trim() : '—';

const COLUMNS = [
  { key: 'reference', header: 'Reference' },
  { key: 'customer', header: 'Customer' },
  { key: 'booking', header: 'Booking' },
  { key: 'method', header: 'Method' },
  { key: 'amount', header: 'Amount', align: 'right' },
  { key: 'status', header: 'Status' },
  { key: 'created', header: 'Created' },
];

export default function TransactionsPage() {
  const { setPageTitle } = usePageTitle();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { setPageTitle('Transactions'); }, [setPageTitle]);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await getTransactions({
        page, limit: LIMIT,
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(search && { search }),
      });
      setData(result);
    } catch {
      setError('Failed to load transactions.');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, page]);

  useEffect(() => {
    const t = setTimeout(fetchTransactions, search ? 400 : 0);
    return () => clearTimeout(t);
  }, [fetchTransactions, search]);

  useEffect(() => { setPage(1); }, [search, statusFilter]);

  const stats = data?.stats || {};
  const transactions = data?.transactions || [];
  const total = data?.total || 0;

  const renderCell = (t, key) => {
    switch (key) {
      case 'reference': return <span className="font-semibold text-[#0057FF]">{t.reference}</span>;
      case 'customer': return t.customer?.name || '—';
      case 'booking': return t.booking?.reference || <span className="text-gray-400">—</span>;
      case 'method': return <span className="capitalize">{t.method?.replace('_', ' ') || '—'}</span>;
      case 'amount':
        return <span className="font-medium text-[#1A1A1A] tabular-nums">{money(t.amount, t.currency)}</span>;
      case 'status': return <StatusBadge status={t.status} />;
      case 'created': return <span className="text-gray-500 tabular-nums">{new Date(t.createdAt).toLocaleDateString()}</span>;
      default: return null;
    }
  };

  return (
    <div className="p-6 max-w-[1280px] mx-auto space-y-6">
      <div>
        <h1 className="text-[20px] font-bold text-[#1A1A1A] tracking-tight">Transactions</h1>
        <p className="text-[13.5px] text-gray-500 mt-0.5">Track payments, refunds, and disputes across the SureLink platform</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Paid Volume', value: stats.paid_volume != null ? money(stats.paid_volume) : '—', dot: 'bg-emerald-500', color: 'text-emerald-600' },
          { label: 'Processing', value: stats.processing ?? '—', dot: 'bg-[#0057FF]', color: 'text-[#0057FF]' },
          { label: 'Disputed', value: stats.disputed ?? '—', dot: 'bg-[#FF6B00]', color: 'text-[#FF6B00]' },
          { label: 'Refunded', value: stats.refunded ?? '—', dot: 'bg-gray-400', color: 'text-gray-600' },
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
              aria-label="Search transactions"
              placeholder="Search by reference, booking, customer…"
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
          rows={transactions}
          renderCell={renderCell}
          loading={loading}
          loadingLabel="Loading transactions…"
          onRowClick={(t) => navigate(`/transactions/${t._id}`)}
          empty={<EmptyState icon="fa-receipt" title="No transactions found" message="Try adjusting your search or filters." />}
        />

        <Pagination page={page} limit={LIMIT} total={total} shown={transactions.length} onPageChange={setPage} />
      </div>
    </div>
  );
}
