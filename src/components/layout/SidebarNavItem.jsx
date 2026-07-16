import { NavLink } from 'react-router-dom';

export default function SidebarNavItem({ path, icon, label }) {
  return (
    <NavLink
      to={path}
      className={({ isActive }) =>
        `flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-all ${
          isActive
            ? 'bg-[#EEF4FF] text-[#0057FF] shadow-[inset_0_0_0_1px_#C7D9FF]'
            : 'text-gray-500 hover:bg-gray-50 hover:text-[#1A1A1A]'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <span className={`w-4 text-center text-[13px] ${isActive ? 'text-[#0057FF]' : 'text-gray-400'}`}>
            <i className={icon} />
          </span>
          {label}
        </>
      )}
    </NavLink>
  );
}
