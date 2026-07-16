export default function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-5">
      <div>
        <h1 className="text-base font-bold text-[#1A1A1A] tracking-tight">{title}</h1>
        {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}
