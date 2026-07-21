import { useCallback, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePageTitle } from '../context/PageTitleContext.jsx';
import DetailPageLayout, { Card, Field } from '../components/shared/DetailPageLayout.jsx';
import StatusBadge from '../components/shared/StatusBadge.jsx';
import Timeline from '../components/shared/Timeline.jsx';
import ErrorBanner from '../components/shared/ErrorBanner.jsx';
import ConfirmDialog from '../components/shared/ConfirmDialog.jsx';
import { getTransaction, refundTransaction, disputeTransaction, resolveDispute } from '../api/transactions.js';

const money = (amount, currency = 'GHS') =>
  amount != null ? `GH₵${Number(amount).toLocaleString()} ${currency}`.trim() : '—';

export default function TransactionDetailPage() {
  const { id } = useParams();
  const { setPageTitle } = usePageTitle();
  const [tx, setTx] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dialog, setDialog] = useState(null); // 'refund' | 'dispute' | 'resolve'
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => { setPageTitle('Transaction Detail'); }, [setPageTitle]);

  const fetchTransaction = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setTx(await getTransaction(id));
    } catch {
      setError('Failed to load transaction.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchTransaction(); }, [fetchTransaction]);

  async function runAction(value) {
    setActionLoading(true);
    setError('');
    try {
      if (dialog === 'refund') await refundTransaction(id, value);
      if (dialog === 'dispute') await disputeTransaction(id, value);
      if (dialog === 'resolve') await resolveDispute(id, value);
      setDialog(null);
      await fetchTransaction();
    } catch (err) {
      setError(err?.response?.data?.message || 'Action failed. Please try again.');
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-gray-400 gap-2 text-sm">
        <i className="fa-solid fa-spinner fa-spin" /> Loading transaction…
      </div>
    );
  }

  if (error && !tx) {
    return (
      <div className="p-6 max-w-[1280px] mx-auto space-y-4">
        <ErrorBanner message={error} onDismiss={() => setError('')} />
      </div>
    );
  }

  const t = tx;
  const canRefund = t.status === 'paid' && t.refund?.state === 'none';
  const canDispute = t.status === 'paid' && t.dispute?.state === 'none';
  const canResolve = t.dispute?.state === 'open';

  const actions = (
    <>
      {canRefund && (
        <button
          onClick={() => setDialog('refund')}
          className="inline-flex items-center gap-2 rounded-lg border border-purple-200 px-3.5 py-2 text-[13px] font-semibold text-purple-700 hover:bg-purple-50"
        >
          <i className="fa-solid fa-rotate-left text-[12px]" /> Refund
        </button>
      )}
      {canDispute && (
        <button
          onClick={() => setDialog('dispute')}
          className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3.5 py-2 text-[13px] font-semibold text-red-600 hover:bg-red-50"
        >
          <i className="fa-solid fa-triangle-exclamation text-[12px]" /> Open Dispute
        </button>
      )}
      {canResolve && (
        <button
          onClick={() => setDialog('resolve')}
          className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 px-3.5 py-2 text-[13px] font-semibold text-emerald-700 hover:bg-emerald-50"
        >
          <i className="fa-solid fa-circle-check text-[12px]" /> Resolve Dispute
        </button>
      )}
    </>
  );

  const bookingRef = t.booking?.reference;
  const aside = (
    <>
      <Card title="Customer" icon="fa-user">
        <dl>
          <Field label="Name">{t.customer?.name}</Field>
        </dl>
      </Card>
      <Card title="Provider" icon="fa-building">
        <dl>
          <Field label="Name">{t.provider?.name || 'Unassigned'}</Field>
        </dl>
      </Card>
      <Card title="Linked Booking" icon="fa-calendar-check">
        <dl>
          <Field label="Reference">
            {t.booking?.id ? (
              <Link to={`/bookings/${t.booking.id}`} className="font-semibold text-[#0057FF] hover:underline">
                {bookingRef}
              </Link>
            ) : (
              bookingRef
            )}
          </Field>
        </dl>
      </Card>
    </>
  );

  return (
    <>
      <DetailPageLayout
        backTo="/transactions"
        backLabel="Back to transactions"
        title={t.reference}
        subtitle={money(t.amount, t.currency)}
        actions={actions}
        aside={aside}
      >
        {error && <ErrorBanner message={error} onDismiss={() => setError('')} />}

        <Card title="Status" icon="fa-circle-info">
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge status={t.status} />
            {t.refund?.state && t.refund.state !== 'none' && (
              <span className="text-[12px] text-gray-500">Refund: {t.refund.state}{t.refund.reason ? ` — ${t.refund.reason}` : ''}</span>
            )}
            {t.dispute?.state && t.dispute.state !== 'none' && (
              <span className="text-[12px] text-gray-500">Dispute: {t.dispute.state}{t.dispute.reason ? ` — ${t.dispute.reason}` : ''}</span>
            )}
          </div>
        </Card>

        <Card title="Amount Breakdown" icon="fa-money-bill-wave">
          <dl className="divide-y divide-gray-50">
            <div className="flex items-center justify-between py-2">
              <dt className="text-[13px] text-gray-500">Gross amount</dt>
              <dd className="text-[13px] font-semibold text-[#1A1A1A] tabular-nums">{money(t.amount, t.currency)}</dd>
            </div>
            <div className="flex items-center justify-between py-2">
              <dt className="text-[13px] text-gray-500">Platform fee</dt>
              <dd className="text-[13px] text-gray-600 tabular-nums">− {money(t.fees?.platform, t.currency)}</dd>
            </div>
            <div className="flex items-center justify-between py-2">
              <dt className="text-[13px] text-gray-500">Processing fee</dt>
              <dd className="text-[13px] text-gray-600 tabular-nums">− {money(t.fees?.processing, t.currency)}</dd>
            </div>
            <div className="flex items-center justify-between py-2">
              <dt className="text-[13px] font-semibold text-[#1A1A1A]">Provider payout</dt>
              <dd className="text-[13px] font-bold text-emerald-600 tabular-nums">{money(t.fees?.provider_payout, t.currency)}</dd>
            </div>
            <div className="flex items-center justify-between py-2">
              <dt className="text-[13px] text-gray-500">Payment method</dt>
              <dd className="text-[13px] text-[#1A1A1A] capitalize">{t.method?.replace('_', ' ') || '—'}</dd>
            </div>
          </dl>
        </Card>

        <Card title="Audit Trail" icon="fa-clock-rotate-left">
          <Timeline events={t.audit} />
        </Card>
      </DetailPageLayout>

      <ConfirmDialog
        open={dialog === 'refund'}
        title="Refund transaction?"
        body="This refunds the full amount to the customer and marks the transaction refunded."
        confirmLabel="Issue refund"
        reasonRequired
        reasonLabel="Refund reason"
        loading={actionLoading}
        onConfirm={runAction}
        onCancel={() => setDialog(null)}
      />
      <ConfirmDialog
        open={dialog === 'dispute'}
        title="Open dispute?"
        body="This flags the transaction as disputed for review."
        confirmLabel="Open dispute"
        confirmVariant="danger"
        reasonRequired
        reasonLabel="Dispute reason"
        loading={actionLoading}
        onConfirm={runAction}
        onCancel={() => setDialog(null)}
      />
      <ConfirmDialog
        open={dialog === 'resolve'}
        title="Resolve dispute?"
        body="This marks the dispute as resolved."
        confirmLabel="Resolve dispute"
        reasonRequired
        reasonLabel="Resolution note"
        loading={actionLoading}
        onConfirm={runAction}
        onCancel={() => setDialog(null)}
      />
    </>
  );
}
