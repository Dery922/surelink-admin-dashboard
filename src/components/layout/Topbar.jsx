import { usePageTitle } from '../../context/PageTitleContext.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { ROLE_LABELS } from '../../constants/navigation.js';

export default function Topbar() {
  const { pageTitle } = usePageTitle();
  const { admin } = useAuth();

  return (
    <header className="fixed top-0 left-60 right-0 h-14 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center px-6 z-10">
      <h1 className="text-[15px] font-bold text-[#1A1A1A] flex-1 tracking-tight">{pageTitle}</h1>
      <div className="flex items-center gap-3">
        <span className="hidden sm:inline-flex items-center gap-2 bg-[#F5F8FF] text-[#0057FF] text-[12px] font-semibold px-3 py-1.5 rounded-full border border-[#E8F0FF]">
          <i className="fa-solid fa-shield-halved text-[11px]" />
          {ROLE_LABELS[admin?.role] || admin?.role}
        </span>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0057FF] via-indigo-500 to-violet-500 ring-2 ring-white shadow-sm" />
      </div>
    </header>
  );
}
