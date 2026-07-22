/**
 * Pagination — prev/next + "showing X of Y". Consumers: Customers, Verifications lists.
 * Controlled: parent owns `page` and passes `onPageChange`.
 */
export default function Pagination({ page = 1, limit = 20, total = 0, shown = 0, onPageChange }) {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100">
      <p className="text-[12px] text-gray-500">
        Showing <span className="font-semibold text-[#1A1A1A]">{shown}</span> of {total}
      </p>
      <div className="flex items-center gap-2">
        <span className="text-[12px] text-gray-400 tabular-nums">Page {page} of {totalPages}</span>
        <button
          onClick={() => canPrev && onPageChange(page - 1)}
          disabled={!canPrev}
          aria-label="Previous page"
          className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <i className="fa-solid fa-chevron-left text-[11px]" />
        </button>
        <button
          onClick={() => canNext && onPageChange(page + 1)}
          disabled={!canNext}
          aria-label="Next page"
          className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <i className="fa-solid fa-chevron-right text-[11px]" />
        </button>
      </div>
    </div>
  );
}
