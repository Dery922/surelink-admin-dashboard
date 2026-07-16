import { usePageTitle } from '../../context/PageTitleContext.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { ROLE_LABELS } from '../../constants/navigation.js';

export default function Topbar() {
  const { pageTitle } = usePageTitle();
  const { admin } = useAuth();

  return (
    <header className="fixed top-0 left-60 right-0 h-14 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center px-5 z-10">
      <h1 className="text-sm font-semibold text-[#1A1A1A] flex-1 tracking-tight">{pageTitle}</h1>
      <div className="flex items-center gap-2.5">
        <span className="hidden sm:inline-flex items-center gap-1.5 bg-[#EEF4FF] text-[#0057FF] text-[11px] font-semibold px-2.5 py-1 rounded-full border border-[#C7D9FF]">
          <i className="fa-solid fa-shield-halved text-[9px]" />
          {ROLE_LABELS[admin?.role] || admin?.role}
        </span>
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#0057FF] to-blue-400 flex items-center justify-center shadow-sm">
          <i className="fa-solid fa-user text-white text-[10px]" />
        </div>
      </div>
    </header>
  );
}
