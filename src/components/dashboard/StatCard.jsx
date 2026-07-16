export default function StatCard({ label, value, icon, iconBg, iconColor, trend, trendLabel, trendUp }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-start gap-3 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      <div className={`w-9 h-9 rounded-lg ${iconBg} flex items-center justify-center flex-shrink-0`}>
        <i className={`${icon} ${iconColor} text-sm`} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-medium text-gray-400 mb-0.5 uppercase tracking-wide">{label}</p>
        <p className="text-xl font-bold text-[#1A1A1A] leading-tight">{value}</p>
        {(trend || trendLabel) && (
          <p className="text-[11px] text-gray-400 mt-1 flex items-center gap-1">
            {trend && (
              <span className={`font-medium ${trendUp ? 'text-emerald-500' : 'text-red-400'}`}>
                <i className={`fa-solid ${trendUp ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down'} mr-0.5`} />
                {trend}
              </span>
            )}
            <span>{trendLabel}</span>
          </p>
        )}
      </div>
    </div>
  );
}
