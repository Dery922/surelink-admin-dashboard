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
};

const LABELS = {
  active: 'Active', pending: 'Pending', verification_pending: 'Pending Review',
  suspended: 'Suspended', banned: 'Banned', inactive: 'Inactive',
  in_transit: 'In Transit', completed: 'Completed', delayed: 'Delayed',
};

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full ${STYLES[status] || 'bg-gray-100 text-gray-500'}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${DOTS[status] || 'bg-gray-400'}`} />
      {LABELS[status] || status}
    </span>
  );
}
