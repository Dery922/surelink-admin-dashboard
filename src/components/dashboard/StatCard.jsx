export default function StatCard({ label, value, icon, iconBg, iconColor, trend, trendLabel, trendUp }) {
  return (
    <div className="group bg-white rounded-xl border border-gray-100 shadow-sm p-5 transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-lg ${iconBg} flex items-center justify-center`}>
          <i className={`${icon} ${iconColor} text-[15px]`} />
        </div>
        {trend && (
          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
            <i className={`fa-solid ${trendUp ? 'fa-arrow-up' : 'fa-arrow-down'} text-[9px]`} />
            {trend}
          </span>
        )}
      </div>
      <div className="mt-4 text-[28px] font-bold leading-none tracking-tight text-[#1A1A1A] tabular-nums">{value}</div>
      <div className="mt-1.5 text-[12.5px] font-medium text-gray-500">{label}</div>
      {trendLabel && <div className="mt-0.5 text-[11px] text-gray-400">{trendLabel}</div>}
    </div>
  );
}
