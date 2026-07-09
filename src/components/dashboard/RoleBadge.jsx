import { ROLE_LABELS } from '../../constants/navigation.js';

const ROLE_STYLES = {
  SUPER_ADMIN: 'bg-[#EEF4FF] text-[#0057FF] border border-[#C7D9FF]',
  PROVIDER_MANAGEMENT_ADMIN: 'bg-green-50 text-green-700 border border-green-200',
  OPERATIONS_ADMIN: 'bg-orange-50 text-[#FF6B00] border border-orange-200',
};

const ROLE_STYLES_LIGHT = {
  SUPER_ADMIN: 'bg-white/20 text-white border border-white/30',
  PROVIDER_MANAGEMENT_ADMIN: 'bg-white/20 text-white border border-white/30',
  OPERATIONS_ADMIN: 'bg-white/20 text-white border border-white/30',
};

export default function RoleBadge({ role, variant = 'default' }) {
  const styles = variant === 'light' ? ROLE_STYLES_LIGHT : ROLE_STYLES;
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${styles[role] || 'bg-gray-100 text-gray-600 border border-gray-200'}`}>
      <i className="fa-solid fa-shield-halved text-[9px]" />
      {ROLE_LABELS[role] || role}
    </span>
  );
}
