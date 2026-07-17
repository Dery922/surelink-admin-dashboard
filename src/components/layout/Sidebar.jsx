import { useAuth } from '../../hooks/useAuth.js';
import { NAV_ITEMS } from '../../constants/navigation.js';
import SidebarNavItem from './SidebarNavItem.jsx';

function initials(name) {
  if (!name) return 'A';
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase() || 'A';
}

export default function Sidebar() {
  const { admin, logout } = useAuth();

  const visibleItems = NAV_ITEMS.filter(
    (item) => !item.roles.length || item.roles.includes(admin?.role)
  );

  return (
    <aside className="fixed inset-y-0 left-0 w-60 bg-white border-r border-gray-200 flex flex-col z-20">
      {/* Logo */}
      <div className="h-14 flex items-center gap-3 px-5 border-b border-gray-100 flex-shrink-0">
        <div className="w-9 h-9 rounded-xl bg-[#0057FF] flex items-center justify-center flex-shrink-0 shadow-[0_2px_8px_-1px_rgba(0,87,255,0.45)]">
          <i className="fa-solid fa-shield-halved text-white text-[15px]" />
        </div>
        <div className="leading-tight">
          <p className="font-bold text-[#1A1A1A] text-[14px] tracking-tight">SureLink</p>
          <p className="text-[11px] text-gray-400 font-medium">Admin Portal</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-[0.14em] px-2 pb-2">Navigation</p>
        <div className="space-y-1">
          {visibleItems.map((item) => (
            <SidebarNavItem key={item.path} {...item} />
          ))}
        </div>
      </nav>

      {/* Admin profile + logout */}
      <div className="p-3 border-t border-gray-100">
        <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-gray-50 transition-colors">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#0057FF] to-indigo-500 flex items-center justify-center flex-shrink-0 text-[12px] font-semibold text-white">
            {initials(admin?.name?.full)}
          </div>
          <div className="min-w-0 flex-1 leading-tight">
            <p className="text-[12.5px] font-semibold text-[#1A1A1A] truncate">{admin?.name?.full || 'Admin'}</p>
            <p className="text-[11px] text-gray-400 truncate">{admin?.email}</p>
          </div>
          <button
            onClick={logout}
            className="text-gray-300 hover:text-red-500 transition-colors"
            title="Sign out"
          >
            <i className="fa-solid fa-arrow-right-from-bracket text-[13px]" />
          </button>
        </div>
      </div>
    </aside>
  );
}
