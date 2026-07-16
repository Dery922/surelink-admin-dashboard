import ActivityFeedItem from './ActivityFeedItem.jsx';

export default function ActivityFeed({ items = [], loading = false }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-gray-50">
        <div>
          <h2 className="text-sm font-semibold text-[#1A1A1A] tracking-tight">Recent Activity</h2>
          <p className="text-[11px] text-gray-400 mt-0.5">Latest updates for your role</p>
        </div>
        {!loading && (
          <span className="text-[11px] font-medium text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">
            {items.length} events
          </span>
        )}
      </div>
      <div className="px-4 pb-2">
        {loading ? (
          <div className="space-y-1 py-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-start gap-3 py-2.5">
                <div className="w-7 h-7 rounded-lg bg-gray-100 animate-pulse flex-shrink-0 mt-0.5" />
                <div className="flex-1 space-y-1.5 pt-0.5">
                  <div className="h-2.5 bg-gray-100 animate-pulse rounded w-4/5" />
                  <div className="h-2 bg-gray-100 animate-pulse rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <p className="text-xs text-gray-400 py-6 text-center">No recent activity</p>
        ) : (
          items.map((item) => <ActivityFeedItem key={item.id} {...item} />)
        )}
      </div>
    </div>
  );
}
