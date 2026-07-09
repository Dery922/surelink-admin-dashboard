import { useAuth } from '../../hooks/useAuth.js';
import { NAV_ITEMS } from '../../constants/navigation.js';
import SidebarNavItem from './SidebarNavItem.jsx';

export default function Sidebar() {
  const { admin, logout } = useAuth();

  const visibleItems = NAV_ITEMS.filter(
    (item) => !item.roles.length || item.roles.includes(admin?.role)
  );

  return (
    <aside className="fixed inset-y-0 left-0 w-60 bg-white border-r border-gray-100 flex flex-col z-20">
      {/* Logo */}
      <div className="h-14 flex items-center gap-2.5 px-4 border-b border-gray-100 flex-shrink-0">
        <div className="w-7 h-7 rounded-lg bg-[#0057FF] flex items-center justify-center flex-shrink-0 shadow-sm">
          <i className="fa-solid fa-shield-halved text-white text-xs" />
        </div>
        <div>
          <p className="font-bold text-[#1A1A1A] text-sm leading-tight tracking-tight">SureLink</p>
          <p className="text-[10px] text-gray-400 leading-tight font-medium">Admin Portal</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2.5 py-3 space-y-0.5">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-2 mb-2">Navigation</p>
        {visibleItems.map((item) => (
          <SidebarNavItem key={item.path} {...item} />
        ))}
      </nav>

      {/* Admin profile + logout */}
      <div className="px-2.5 py-3 border-t border-gray-100">
        <div className="flex items-center gap-2.5 px-2 py-2 mb-1">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#0057FF] to-blue-400 flex items-center justify-center flex-shrink-0 shadow-sm">
            <i className="fa-solid fa-user text-white text-[10px]" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-[#1A1A1A] truncate">{admin?.name?.full || 'Admin'}</p>
            <p className="text-[10px] text-gray-400 truncate">{admin?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg text-xs font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <i className="fa-solid fa-right-from-bracket w-4 text-center text-[11px]" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
