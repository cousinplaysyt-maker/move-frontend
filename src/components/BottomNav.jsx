import { NavLink } from 'react-router-dom';
import { navItems } from './navItems';

export default function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-[#e5eeff] bg-[#f8f9ff]/95 backdrop-blur-xl md:hidden">
      <div className="flex h-16 items-center justify-around">
        {navItems.map(({ label, path, Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            className={({ isActive }) =>
              `flex min-w-[56px] flex-col items-center gap-0.5 text-[10px] font-bold ${isActive ? 'text-[#006948]' : 'text-[#3d4a42]'}`
            }
          >
            <Icon size={24} />
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
