import EmptyState from './EmptyState';

/**
 * DataTable — shared list table with loading / empty / row-click states.
 * Consumers: all four list pages. columns: [{ key, header, align?, className? }].
 * renderCell(row, columnKey) returns the cell content.
 */
export default function DataTable({
  columns,
  rows = [],
  renderCell,
  rowKey = (r) => r._id,
  loading = false,
  loadingLabel = 'Loading…',
  empty,
  onRowClick,
  minWidth = 920,
}) {
  const align = (a) => (a === 'right' ? 'text-right' : a === 'center' ? 'text-center' : 'text-left');

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse" style={{ minWidth }}>
        <thead>
          <tr className="border-b border-gray-100">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-gray-400 ${align(col.align)} ${col.className || ''}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="px-5 py-12 text-center text-[13px] text-gray-400">
                <i className="fa-solid fa-spinner fa-spin mr-2" />
                {loadingLabel}
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-5 py-4">
                {empty || <EmptyState />}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr
                key={rowKey(row)}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                onKeyDown={
                  onRowClick
                    ? (e) => {
                        if (e.key === 'Enter') onRowClick(row);
                      }
                    : undefined
                }
                tabIndex={onRowClick ? 0 : undefined}
                role={onRowClick ? 'button' : undefined}
                className={`border-b border-gray-50 ${onRowClick ? 'cursor-pointer hover:bg-[#F5F8FF] focus:bg-[#F5F8FF] focus:outline-none' : ''}`}
              >
                {columns.map((col) => (
                  <td key={col.key} className={`px-5 py-3.5 text-[13px] text-[#1A1A1A] ${align(col.align)} ${col.className || ''}`}>
                    {renderCell(row, col.key)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
