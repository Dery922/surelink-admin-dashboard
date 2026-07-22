import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { usePageTitle } from '../context/PageTitleContext.jsx';
import DetailPageLayout, { Card, Field } from '../components/shared/DetailPageLayout.jsx';
import StatusBadge from '../components/shared/StatusBadge.jsx';
import Timeline from '../components/shared/Timeline.jsx';
import ErrorBanner from '../components/shared/ErrorBanner.jsx';
import ConfirmDialog from '../components/shared/ConfirmDialog.jsx';
import { getVerification, approveVerification, rejectVerification } from '../api/verifications.js';

const fmt = (d) => (d ? new Date(d).toLocaleString() : '—');
const isPdf = (url) => /\.pdf($|\?)/i.test(url || '');

function DocumentPreview({ doc }) {
  const [broken, setBroken] = useState(false);
  const pdf = isPdf(doc.url);

  return (
    <a
      href={doc.url}
      target="_blank"
      rel="noreferrer"
      className="group block overflow-hidden rounded-lg border border-gray-100 bg-gray-50 transition-colors hover:border-[#C7D9FF]"
    >
      <div className="flex h-32 items-center justify-center bg-white">
        {pdf || broken ? (
          <i className={`fa-solid ${pdf ? 'fa-file-pdf text-red-400' : 'fa-image text-gray-300'} text-[32px]`} />
        ) : (
          <img src={doc.url} alt={doc.label} onError={() => setBroken(true)} className="h-full w-full object-cover" />
        )}
      </div>
      <div className="flex items-center justify-between gap-2 border-t border-gray-100 px-3 py-2">
        <span className="truncate text-[12px] font-medium text-[#1A1A1A]">{doc.label}</span>
        <i className="fa-solid fa-arrow-up-right-from-square text-[10px] text-gray-400 group-hover:text-[#0057FF]" />
      </div>
    </a>
  );
}

export default function VerificationDetailPage() {
  const { id } = useParams();
  const { setPageTitle } = usePageTitle();
  const [ver, setVer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dialog, setDialog] = useState(null); // 'approve' | 'reject'
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => { setPageTitle('Verification Detail'); }, [setPageTitle]);

  const fetchVerification = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setVer(await getVerification(id));
    } catch {
      setError('Failed to load verification.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchVerification(); }, [fetchVerification]);

  async function runAction(value) {
    setActionLoading(true);
    setError('');
    try {
      if (dialog === 'approve') await approveVerification(id, value);
      if (dialog === 'reject') await rejectVerification(id, value);
      setDialog(null);
      await fetchVerification();
    } catch (err) {
      setError(err?.response?.data?.message || 'Action failed. Please try again.');
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-gray-400 gap-2 text-sm">
        <i className="fa-solid fa-spinner fa-spin" /> Loading verification…
      </div>
    );
  }

  if (error && !ver) {
    return (
      <div className="p-6 max-w-[1280px] mx-auto space-y-4">
        <ErrorBanner message={error} onDismiss={() => setError('')} />
      </div>
    );
  }

  const v = ver;
  const isPending = v.status === 'pending';
  const documents = v.documents || [];

  const actions = isPending && (
    <>
      <button
        onClick={() => setDialog('approve')}
        className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 px-3.5 py-2 text-[13px] font-semibold text-emerald-700 hover:bg-emerald-50"
      >
        <i className="fa-solid fa-circle-check text-[12px]" /> Approve
      </button>
      <button
        onClick={() => setDialog('reject')}
        className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3.5 py-2 text-[13px] font-semibold text-red-600 hover:bg-red-50"
      >
        <i className="fa-solid fa-circle-xmark text-[12px]" /> Reject
      </button>
    </>
  );

  const aside = (
    <>
      <Card title="Provider" icon="fa-building">
        <dl>
          <Field label="Name">{v.provider?.name || '—'}</Field>
          <Field label="Email">{v.provider?.email || '—'}</Field>
          <Field label="Phone">{v.provider?.phone || '—'}</Field>
        </dl>
      </Card>
      <Card title="Review" icon="fa-user-shield">
        <dl>
          <Field label="Submitted">{fmt(v.submitted_at)}</Field>
          <Field label="Reviewed">{fmt(v.reviewed_at)}</Field>
          <Field label="Reviewed by">{v.reviewed_by || '—'}</Field>
        </dl>
      </Card>
    </>
  );

  return (
    <>
      <DetailPageLayout
        backTo="/verifications"
        backLabel="Back to verifications"
        title={v.reference}
        subtitle={v.provider?.name}
        actions={actions}
        aside={aside}
      >
        {error && <ErrorBanner message={error} onDismiss={() => setError('')} />}

        <Card title="Status" icon="fa-circle-info">
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge status={v.status} />
            {v.rejection_reason && (
              <span className="text-[12px] text-gray-500">Reason: {v.rejection_reason}</span>
            )}
          </div>
        </Card>

        <Card title="Documents" icon="fa-folder-open">
          {documents.length ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {documents.map((doc, i) => (
                <DocumentPreview key={`${doc.type}-${i}`} doc={doc} />
              ))}
            </div>
          ) : (
            <p className="text-[12px] text-gray-400">No documents submitted.</p>
          )}
        </Card>

        <Card title="Verification History" icon="fa-clock-rotate-left">
          <Timeline events={v.events} />
        </Card>
      </DetailPageLayout>

      <ConfirmDialog
        open={dialog === 'approve'}
        title="Approve verification?"
        body="This approves the provider's identity submission and activates their account."
        confirmLabel="Approve"
        reasonRequired={false}
        reasonLabel="Note"
        loading={actionLoading}
        onConfirm={runAction}
        onCancel={() => setDialog(null)}
      />
      <ConfirmDialog
        open={dialog === 'reject'}
        title="Reject verification?"
        body="This rejects the submission. The provider will need to resubmit."
        confirmLabel="Reject"
        confirmVariant="danger"
        reasonRequired
        reasonLabel="Rejection reason"
        loading={actionLoading}
        onConfirm={runAction}
        onCancel={() => setDialog(null)}
      />
    </>
  );
}
