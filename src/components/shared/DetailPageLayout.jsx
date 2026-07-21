import { Link } from 'react-router-dom';

/**
 * DetailPageLayout — back link + title + 2-col (main/aside) grid for all detail pages.
 * Also exports Card (white panel with header) and Field (label/value row).
 */
export default function DetailPageLayout({
  backTo,
  backLabel = 'Back',
  title,
  subtitle,
  actions,
  aside,
  children,
}) {
  return (
    <div className="p-6 max-w-[1280px] mx-auto space-y-6">
      {backTo && (
        <Link to={backTo} className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#0057FF] hover:underline">
          <i className="fa-solid fa-arrow-left text-[11px]" />
          {backLabel}
        </Link>
      )}

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[20px] font-bold text-[#1A1A1A]">{title}</h1>
          {subtitle && <p className="mt-0.5 text-[13px] text-gray-500">{subtitle}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">{children}</div>
        {aside && <div className="space-y-6 lg:col-span-1">{aside}</div>}
      </div>
    </div>
  );
}

export function Card({ title, icon, children, className = '' }) {
  return (
    <section className={`bg-white rounded-xl border border-gray-100 shadow-sm ${className}`}>
      {title && (
        <header className="flex items-center gap-2 border-b border-gray-100 px-5 py-3.5">
          {icon && <i className={`fa-solid ${icon} text-[13px] text-[#0057FF]`} />}
          <h2 className="text-[13px] font-bold text-[#1A1A1A]">{title}</h2>
        </header>
      )}
      <div className="p-5">{children}</div>
    </section>
  );
}

export function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-0.5 py-1.5">
      <dt className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">{label}</dt>
      <dd className="text-[13px] text-[#1A1A1A]">{children ?? '—'}</dd>
    </div>
  );
}
