import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { getQuickActions } from '../../utils/getQuickActions.js';

export default function QuickActionsPanel() {
  const { admin } = useAuth();
  const actions = getQuickActions(admin?.role);

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
      <div className="px-5 py-4 border-b border-gray-100">
        <h2 className="text-[14px] font-bold text-[#1A1A1A] tracking-tight">Quick Actions</h2>
        <p className="text-[12px] text-gray-400 mt-0.5">Common tasks for your role</p>
      </div>
      <div className="p-4 space-y-2">
        {actions.map((action) => (
          <Link
            key={action.id}
            to={action.path}
            className="group flex items-center gap-3 rounded-lg border border-gray-200 px-3 py-2.5 transition-all hover:border-[#C7D9FF] hover:bg-[#F5F8FF]"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EEF4FF] text-[#0057FF]">
              <i className={`${action.icon} text-[14px]`} />
            </span>
            <span className="flex-1 text-[13px] font-semibold text-[#1A1A1A]">{action.label}</span>
            <i className="fa-solid fa-chevron-right text-[11px] text-gray-300 transition-colors group-hover:text-[#0057FF]" />
          </Link>
        ))}
      </div>
    </div>
  );
}
