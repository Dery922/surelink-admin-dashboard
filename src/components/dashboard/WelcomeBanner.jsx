import { useAuth } from '../../hooks/useAuth.js';
import RoleBadge from './RoleBadge.jsx';

export default function WelcomeBanner() {
  const { admin } = useAuth();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const firstName = admin?.name?.display || admin?.name?.full?.split(' ')[0] || 'Admin';

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-[#0057FF] to-blue-500 rounded-xl p-5 flex items-center justify-between gap-4 shadow-sm">
      {/* Decorative circles */}
      <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
      <div className="absolute -bottom-8 right-16 w-24 h-24 rounded-full bg-white/5 pointer-events-none" />

      <div className="relative z-10">
        <p className="text-blue-100 text-xs font-medium mb-0.5">{greeting}</p>
        <h2 className="text-lg font-bold text-white mb-2 tracking-tight">{firstName} 👋</h2>
        <RoleBadge role={admin?.role} variant="light" />
      </div>

      <div className="relative z-10 w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0 border border-white/20">
        <i className="fa-solid fa-user-tie text-white text-xl" />
      </div>
    </div>
  );
}
