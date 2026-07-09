import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { getQuickActions } from '../../utils/getQuickActions.js';

export default function QuickActionsPanel() {
  const { admin } = useAuth();
  const actions = getQuickActions(admin?.role);

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
      <div className="px-4 pt-4 pb-3 border-b border-gray-50">
        <h2 className="text-sm font-semibold text-[#1A1A1A] tracking-tight">Quick Actions</h2>
        <p className="text-[11px] text-gray-400 mt-0.5">Common tasks for your role</p>
      </div>
      <div className="p-3 grid grid-cols-2 gap-2">
        {actions.map((action) => (
          <Link
            key={action.id}
            to={action.path}
            className="flex flex-col items-center justify-center gap-2 p-3 rounded-lg border border-gray-100 hover:border-[#C7D9FF] hover:bg-[#F5F8FF] transition-all group text-center"
          >
            <div className="w-8 h-8 rounded-lg bg-[#EEF4FF] group-hover:bg-[#0057FF] flex items-center justify-center transition-colors">
              <i className={`${action.icon} text-[#0057FF] group-hover:text-white text-xs transition-colors`} />
            </div>
            <span className="text-[11px] font-semibold text-[#1A1A1A] leading-tight">{action.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
