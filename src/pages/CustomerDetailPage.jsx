import { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePageTitle } from '../context/PageTitleContext.jsx';
import DetailPageLayout, { Card, Field } from '../components/shared/DetailPageLayout.jsx';
import StatusBadge from '../components/shared/StatusBadge.jsx';
import DataTable from '../components/shared/DataTable.jsx';
import EmptyState from '../components/shared/EmptyState.jsx';
import ErrorBanner from '../components/shared/ErrorBanner.jsx';
import { getCustomer } from '../api/customers.js';

const money = (p) => (p?.amount != null ? `GH₵${Number(p.amount).toLocaleString()}` : '—');
const fmt = (d) => (d ? new Date(d).toLocaleString() : '—');

const BOOKING_COLUMNS = [
  { key: 'reference', header: 'Reference' },
  { key: 'service', header: 'Service' },
  { key: 'payment', header: 'Payment', align: 'right' },
  { key: 'status', header: 'Status' },
  { key: 'created', header: 'Created' },
];

export default function CustomerDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setPageTitle } = usePageTitle();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { setPageTitle('Customer Detail'); }, [setPageTitle]);

  const fetchCustomer = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setData(await getCustomer(id));
    } catch {
      setError('Failed to load customer.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchCustomer(); }, [fetchCustomer]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-gray-400 gap-2 text-sm">
        <i className="fa-solid fa-spinner fa-spin" /> Loading customer…
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="p-6 max-w-[1280px] mx-auto space-y-4">
        <ErrorBanner message={error} onDismiss={() => setError('')} />
      </div>
    );
  }

  const c = data.customer;
  const bookings = data.bookings || [];

  const renderCell = (b, key) => {
    switch (key) {
      case 'reference': return <span className="font-semibold text-[#0057FF]">{b.reference}</span>;
      case 'service': return b.service?.category || '—';
      case 'payment': return <span className="font-medium text-[#1A1A1A] tabular-nums">{money(b.payment)}</span>;
      case 'status': return <StatusBadge status={b.status} />;
      case 'created': return <span className="text-gray-500 tabular-nums">{new Date(b.createdAt).toLocaleDateString()}</span>;
      default: return null;
    }
  };

  const aside = (
    <>
      <Card title="Account" icon="fa-id-badge">
        <dl>
          <Field label="Status"><StatusBadge status={c.status} /></Field>
          <Field label="Joined">{fmt(c.createdAt)}</Field>
          <Field label="Last login">{fmt(c.audit?.last_login_at)}</Field>
        </dl>
      </Card>
      <Card title="Trust" icon="fa-star">
        <dl>
          <Field label="Trust score">{c.trust?.score ?? '—'}</Field>
          <Field label="Avg rating">{c.trust?.average_rating != null ? c.trust.average_rating.toFixed(1) : '—'}</Field>
          <Field label="Total ratings">{c.trust?.total_ratings ?? 0}</Field>
        </dl>
      </Card>
    </>
  );

  return (
    <DetailPageLayout
      backTo="/customers"
      backLabel="Back to customers"
      title={c.name?.full || 'Customer'}
      subtitle={c.email}
      aside={aside}
    >
      {error && <ErrorBanner message={error} onDismiss={() => setError('')} />}

      <Card title="Profile" icon="fa-user">
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
          <Field label="Full name">{c.name?.full}</Field>
          <Field label="Phone">{c.phone}</Field>
          <Field label="Email">{c.email}</Field>
          <Field label="Area">{c.location?.home_address?.area}</Field>
        </dl>
      </Card>

      <Card title="Booking History" icon="fa-calendar-check">
        <DataTable
          columns={BOOKING_COLUMNS}
          rows={bookings}
          renderCell={renderCell}
          onRowClick={(b) => navigate(`/bookings/${b._id}`)}
          minWidth={640}
          empty={<EmptyState icon="fa-calendar-xmark" title="No bookings yet" message="This customer has not made any bookings." />}
        />
      </Card>
    </DetailPageLayout>
  );
}
