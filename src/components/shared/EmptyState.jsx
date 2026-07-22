/**
 * EmptyState — icon + message shown when a list/detail has no data.
 * Consumers: all list pages (table body) and detail pages.
 */
export default function EmptyState({ icon = 'fa-inbox', title = 'Nothing here yet', message }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <i className={`fa-solid ${icon} text-2xl text-gray-200 mb-2`} />
      <p className="text-[13px] font-semibold text-gray-500">{title}</p>
      {message && <p className="text-[12px] text-gray-400 mt-0.5">{message}</p>}
    </div>
  );
}
