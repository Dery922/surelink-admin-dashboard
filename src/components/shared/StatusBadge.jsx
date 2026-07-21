const STYLES = {
  active:               'bg-emerald-50 text-emerald-700',
  pending:              'bg-amber-50 text-amber-700',
  verification_pending: 'bg-amber-50 text-amber-700',
  suspended:            'bg-red-50 text-red-700',
  banned:               'bg-red-50 text-red-700',
  inactive:             'bg-gray-100 text-gray-500',
  in_transit:           'bg-[#EEF4FF] text-[#0057FF]',
  completed:            'bg-emerald-50 text-emerald-700',
  delayed:              'bg-orange-50 text-[#FF6B00]',
  // Booking statuses
  confirmed:            'bg-[#EEF4FF] text-[#0057FF]',
  in_progress:          'bg-indigo-50 text-indigo-700',
  cancelled:            'bg-gray-100 text-gray-600',
  disputed:             'bg-orange-50 text-[#FF6B00]',
  refunded:             'bg-purple-50 text-purple-700',
  // Transaction statuses
  paid:                 'bg-emerald-50 text-emerald-700',
  failed:               'bg-red-50 text-red-700',
  processing:           'bg-amber-50 text-amber-700',
  // Verification statuses
  approved:             'bg-emerald-50 text-emerald-700',
  rejected:             'bg-red-50 text-red-700',
};

const DOTS = {
  active: 'bg-emerald-500',
  pending: 'bg-amber-500',
  verification_pending: 'bg-amber-500',
  suspended: 'bg-red-500',
  banned: 'bg-red-500',
  inactive: 'bg-gray-400',
  in_transit: 'bg-[#0057FF]',
  completed: 'bg-emerald-500',
  delayed: 'bg-[#FF6B00]',
  confirmed: 'bg-[#0057FF]',
  in_progress: 'bg-indigo-500',
  cancelled: 'bg-gray-400',
  disputed: 'bg-[#FF6B00]',
  refunded: 'bg-purple-500',
  paid: 'bg-emerald-500',
  failed: 'bg-red-500',
  processing: 'bg-amber-500',
  approved: 'bg-emerald-500',
  rejected: 'bg-red-500',
};

const LABELS = {
  active: 'Active', pending: 'Pending', verification_pending: 'Pending Review',
  suspended: 'Suspended', banned: 'Banned', inactive: 'Inactive',
  in_transit: 'In Transit', completed: 'Completed', delayed: 'Delayed',
  confirmed: 'Confirmed', in_progress: 'In Progress', cancelled: 'Cancelled',
  disputed: 'Disputed', refunded: 'Refunded',
  paid: 'Paid', failed: 'Failed', processing: 'Processing',
  approved: 'Approved', rejected: 'Rejected',
};

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full ${STYLES[status] || 'bg-gray-100 text-gray-500'}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${DOTS[status] || 'bg-gray-400'}`} />
      {LABELS[status] || status}
    </span>
  );
}
