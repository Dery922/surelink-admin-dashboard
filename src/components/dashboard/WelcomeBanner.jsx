import { useAuth } from '../../hooks/useAuth.js';

export default function WelcomeBanner() {
  const { admin } = useAuth();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const firstName = admin?.name?.display || admin?.name?.full?.split(' ')[0] || 'Admin';

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#F5F8FF] to-white rounded-2xl border border-[#E8F0FF] px-7 py-6 shadow-sm">
      {/* Decorative circles */}
      <div className="absolute -top-10 -right-8 w-40 h-40 rounded-full bg-[#0057FF]/5 pointer-events-none" />
      <div className="absolute top-8 right-16 w-24 h-24 rounded-full bg-[#0057FF]/5 pointer-events-none" />

      <div className="relative">
        <h2 className="text-[22px] font-bold text-[#1A1A1A] tracking-tight">{greeting}, {firstName} <span className="align-middle">👋</span></h2>
        <p className="mt-1 text-[13.5px] text-gray-500">Here's what's happening across your marketplace today.</p>
      </div>
    </div>
  );
}
