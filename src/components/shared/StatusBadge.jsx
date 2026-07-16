const STYLES = {
  active:               'bg-emerald-50 text-emerald-700 border border-emerald-200',
  pending:              'bg-amber-50 text-amber-700 border border-amber-200',
  verification_pending: 'bg-amber-50 text-amber-700 border border-amber-200',
  suspended:            'bg-red-50 text-red-600 border border-red-200',
  banned:               'bg-red-50 text-red-600 border border-red-200',
  inactive:             'bg-gray-100 text-gray-500 border border-gray-200',
  in_transit:           'bg-[#EEF4FF] text-[#0057FF] border border-[#C7D9FF]',
  completed:            'bg-emerald-50 text-emerald-700 border border-emerald-200',
  delayed:              'bg-orange-50 text-[#FF6B00] border border-orange-200',
};

const LABELS = {
  active: 'Active', pending: 'Pending', verification_pending: 'Pending Review',
  suspended: 'Suspended', banned: 'Banned', inactive: 'Inactive',
  in_transit: 'In Transit', completed: 'Completed', delayed: 'Delayed',
};

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-full ${STYLES[status] || 'bg-gray-100 text-gray-500 border border-gray-200'}`}>
      {LABELS[status] || status}
    </span>
  );
}
