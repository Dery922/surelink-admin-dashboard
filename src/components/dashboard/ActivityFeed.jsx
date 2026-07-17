import ActivityFeedItem from './ActivityFeedItem.jsx';

export default function ActivityFeed({ items = [], loading = false }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div>
          <h2 className="text-[14px] font-bold text-[#1A1A1A] tracking-tight">Recent Activity</h2>
          <p className="text-[12px] text-gray-400 mt-0.5">Latest updates for your role</p>
        </div>
        {!loading && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-[11px] font-semibold text-gray-500">
            <i className="fa-solid fa-bolt text-[10px] text-[#0057FF]" />
            {items.length} events
          </span>
        )}
      </div>
      {loading ? (
        <div className="px-5 py-4 space-y-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-start gap-4 py-2.5">
              <div className="w-9 h-9 rounded-lg bg-gray-100 animate-pulse flex-shrink-0" />
              <div className="flex-1 space-y-1.5 pt-1">
                <div className="h-2.5 bg-gray-100 animate-pulse rounded w-4/5" />
                <div className="h-2 bg-gray-100 animate-pulse rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <p className="text-xs text-gray-400 py-8 text-center">No recent activity</p>
      ) : (
        <ol className="relative px-5 py-4">
          {/* connector line */}
          <span className="absolute left-[34px] top-6 bottom-6 w-px bg-gray-100" />
          {items.map((item) => <ActivityFeedItem key={item.id} {...item} />)}
        </ol>
      )}
    </div>
  );
}
