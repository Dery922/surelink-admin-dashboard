import { NavLink } from 'react-router-dom';

export default function SidebarNavItem({ path, icon, label }) {
  return (
    <NavLink
      to={path}
      className={({ isActive }) =>
        `group flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] transition-colors ${
          isActive
            ? 'bg-[#EEF4FF] text-[#0057FF] font-semibold'
            : 'text-gray-600 font-medium hover:bg-gray-50 hover:text-[#1A1A1A]'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <span className={`w-4 text-center text-[13px] ${isActive ? 'text-[#0057FF]' : 'text-gray-400 group-hover:text-[#0057FF]'}`}>
            <i className={icon} />
          </span>
          {label}
          {isActive && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#0057FF]" />}
        </>
      )}
    </NavLink>
  );
}
