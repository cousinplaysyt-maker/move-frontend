import { NavLink } from 'react-router-dom';
import { navItems } from './navItems';
import { useUnread } from '../data/chat';

export default function BottomNav() {
  const unread = useUnread();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-[#e5eeff] bg-[#f8f9ff]/95 backdrop-blur-xl md:hidden">
      <div className="flex h-16 items-center justify-around">
        {navItems.map(({ label, path, Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            className={({ isActive }) =>
              `flex relative min-w-[48px] flex-col items-center gap-0.5 text-[10px] font-bold ${isActive ? 'text-[#006948]' : 'text-[#3d4a42]'}`
            }
          >
            <span className="relative">
              <Icon size={24} />
              {path === '/chat' && unread > 0 && <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#ba1a1a] px-1 text-[10px] font-bold text-white">{unread}</span>}
            </span>
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
