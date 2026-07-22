import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { usePageTitle } from '../context/PageTitleContext.jsx';
import DetailPageLayout, { Card, Field } from '../components/shared/DetailPageLayout.jsx';
import StatusBadge from '../components/shared/StatusBadge.jsx';
import Timeline from '../components/shared/Timeline.jsx';
import ErrorBanner from '../components/shared/ErrorBanner.jsx';
import ConfirmDialog from '../components/shared/ConfirmDialog.jsx';
import { getBooking, cancelBooking, refundBooking, reassignBooking } from '../api/bookings.js';

const TERMINAL = ['cancelled', 'completed', 'refunded'];
const money = (p) => (p?.amount != null ? `GH₵${Number(p.amount).toLocaleString()} ${p.currency || ''}`.trim() : '—');
const fmt = (d) => (d ? new Date(d).toLocaleString() : '—');

export default function BookingDetailPage() {
  const { id } = useParams();
  const { setPageTitle } = usePageTitle();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dialog, setDialog] = useState(null); // 'cancel' | 'refund' | 'reassign'
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => { setPageTitle('Booking Detail'); }, [setPageTitle]);

  const fetchBooking = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setBooking(await getBooking(id));
    } catch {
      setError('Failed to load booking.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchBooking(); }, [fetchBooking]);

  async function runAction(value) {
    setActionLoading(true);
    setError('');
    try {
      if (dialog === 'cancel') await cancelBooking(id, value);
      if (dialog === 'refund') await refundBooking(id, value);
      if (dialog === 'reassign') await reassignBooking(id, value);
      setDialog(null);
      await fetchBooking();
    } catch (err) {
      setError(err?.response?.data?.message || 'Action failed. Please try again.');
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-gray-400 gap-2 text-sm">
        <i className="fa-solid fa-spinner fa-spin" /> Loading booking…
      </div>
    );
  }

  if (error && !booking) {
    return (
      <div className="p-6 max-w-[1280px] mx-auto space-y-4">
        <ErrorBanner message={error} onDismiss={() => setError('')} />
      </div>
    );
  }

  const b = booking;
  const isTerminal = TERMINAL.includes(b.status);
  const canRefund = b.payment?.status === 'paid';

  const actions = (
    <>
      {!isTerminal && (
        <button
          onClick={() => setDialog('reassign')}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3.5 py-2 text-[13px] font-semibold text-gray-600 hover:bg-gray-50"
        >
          <i className="fa-solid fa-user-pen text-[12px]" /> Reassign
        </button>
      )}
      {canRefund && (
        <button
          onClick={() => setDialog('refund')}
          className="inline-flex items-center gap-2 rounded-lg border border-purple-200 px-3.5 py-2 text-[13px] font-semibold text-purple-700 hover:bg-purple-50"
        >
          <i className="fa-solid fa-rotate-left text-[12px]" /> Refund
        </button>
      )}
      {!isTerminal && (
        <button
          onClick={() => setDialog('cancel')}
          className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3.5 py-2 text-[13px] font-semibold text-red-600 hover:bg-red-50"
        >
          <i className="fa-solid fa-ban text-[12px]" /> Cancel
        </button>
      )}
    </>
  );

  const aside = (
    <>
      <Card title="Customer" icon="fa-user">
        <dl>
          <Field label="Name">{b.customer?.name}</Field>
          <Field label="Phone">{b.customer?.phone}</Field>
          <Field label="Email">{b.customer?.email}</Field>
        </dl>
      </Card>
      <Card title="Provider" icon="fa-building">
        <dl>
          <Field label="Name">{b.provider?.name || 'Unassigned'}</Field>
          <Field label="Phone">{b.provider?.phone}</Field>
        </dl>
      </Card>
    </>
  );

  return (
    <>
      <DetailPageLayout
        backTo="/bookings"
        backLabel="Back to bookings"
        title={b.reference}
        subtitle={b.service?.category}
        actions={actions}
        aside={aside}
      >
        {error && <ErrorBanner message={error} onDismiss={() => setError('')} />}

        <Card title="Status" icon="fa-circle-info">
          <div className="flex items-center gap-3">
            <StatusBadge status={b.status} />
            {b.cancelled_reason && <span className="text-[12px] text-gray-500">Reason: {b.cancelled_reason}</span>}
          </div>
        </Card>

        <Card title="Service Details" icon="fa-clipboard-list">
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
            <Field label="Category">{b.service?.category}</Field>
            <Field label="Location">{b.service?.location}</Field>
            <Field label="Scheduled">{fmt(b.service?.scheduled_at)}</Field>
            <Field label="Description">{b.service?.description}</Field>
          </dl>
        </Card>

        <Card title="Payment" icon="fa-money-bill-wave">
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
            <Field label="Amount">{money(b.payment)}</Field>
            <Field label="Status"><StatusBadge status={b.payment?.status} /></Field>
            <Field label="Method">{b.payment?.method?.replace('_', ' ')}</Field>
          </dl>
        </Card>

        <Card title="Status Timeline" icon="fa-clock-rotate-left">
          <Timeline events={b.timeline} />
        </Card>
      </DetailPageLayout>

      <ConfirmDialog
        open={dialog === 'cancel'}
        title="Cancel booking?"
        body="This will cancel the booking and notify the customer and provider."
        confirmLabel="Cancel booking"
        confirmVariant="danger"
        reasonRequired
        reasonLabel="Cancellation reason"
        loading={actionLoading}
        onConfirm={runAction}
        onCancel={() => setDialog(null)}
      />
      <ConfirmDialog
        open={dialog === 'refund'}
        title="Issue refund?"
        body="This refunds the full amount to the customer and marks the booking refunded."
        confirmLabel="Issue refund"
        reasonRequired
        reasonLabel="Refund reason"
        loading={actionLoading}
        onConfirm={runAction}
        onCancel={() => setDialog(null)}
      />
      <ConfirmDialog
        open={dialog === 'reassign'}
        title="Reassign provider"
        body="Enter the ID of the provider to assign this booking to."
        confirmLabel="Reassign"
        reasonRequired
        reasonLabel="Provider ID"
        loading={actionLoading}
        onConfirm={runAction}
        onCancel={() => setDialog(null)}
      />
    </>
  );
}
