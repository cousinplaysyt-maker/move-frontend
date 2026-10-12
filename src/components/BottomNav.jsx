import { NavLink } from 'react-router-dom'
import { navItems } from './navItems'

export default function BottomNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-50 pb-safe bg-surface/90 backdrop-blur-xl border-t border-outline-variant/40">
      <div className="flex justify-around items-center h-16 px-1 max-w-xl mx-auto">
        {navItems.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            end
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-0.5 min-w-[56px] h-14 rounded-full transition-all active:scale-95 ${
                isActive ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-on-surface'
              }`
            }
          >
            <Icon className="text-[24px]" />
            <span className="text-label-sm">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}