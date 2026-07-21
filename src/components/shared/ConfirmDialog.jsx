import { useEffect, useRef, useState } from 'react';

/**
 * ConfirmDialog — modal for destructive/irreversible admin actions.
 * Consumers: detail pages (cancel/refund/reassign/approve/reject).
 * When reasonRequired, a textarea gates confirm and its trimmed value is passed to onConfirm.
 */
export default function ConfirmDialog({
  open,
  title,
  body,
  confirmLabel = 'Confirm',
  confirmVariant = 'primary',
  reasonRequired = false,
  reasonLabel = 'Reason',
  loading = false,
  onConfirm,
  onCancel,
}) {
  const [reason, setReason] = useState('');
  const firstFieldRef = useRef(null);

  useEffect(() => {
    if (open) {
      setReason('');
      const t = setTimeout(() => firstFieldRef.current?.focus(), 0);
      const onKey = (e) => e.key === 'Escape' && onCancel?.();
      window.addEventListener('keydown', onKey);
      return () => {
        clearTimeout(t);
        window.removeEventListener('keydown', onKey);
      };
    }
  }, [open, onCancel]);

  if (!open) return null;

  const canConfirm = !loading && (!reasonRequired || reason.trim().length > 0);
  const confirmClass =
    confirmVariant === 'danger'
      ? 'bg-red-600 hover:bg-red-700'
      : 'bg-[#0057FF] hover:bg-[#0047d6]';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
      >
        <h2 id="confirm-title" className="text-[16px] font-bold text-[#1A1A1A]">
          {title}
        </h2>
        {body && <p className="mt-2 text-[13px] text-gray-600">{body}</p>}

        {reasonRequired && (
          <div className="mt-4">
            <label htmlFor="confirm-reason" className="mb-1 block text-[12px] font-semibold text-gray-700">
              {reasonLabel}
            </label>
            <textarea
              id="confirm-reason"
              ref={firstFieldRef}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-[13px] focus:border-[#0057FF] focus:outline-none focus:ring-1 focus:ring-[#0057FF]"
              placeholder={`Enter ${reasonLabel.toLowerCase()}…`}
            />
          </div>
        )}

        <div className="mt-6 flex justify-end gap-2">
          <button
            ref={reasonRequired ? undefined : firstFieldRef}
            onClick={onCancel}
            disabled={loading}
            className="rounded-lg border border-gray-200 px-4 py-2 text-[13px] font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={() => canConfirm && onConfirm?.(reason.trim())}
            disabled={!canConfirm}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-[13px] font-semibold text-white disabled:opacity-50 ${confirmClass}`}
          >
            {loading && <i className="fa-solid fa-spinner fa-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
