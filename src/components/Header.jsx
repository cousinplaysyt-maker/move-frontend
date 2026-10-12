import { NavLink } from 'react-router-dom'
import { MdTune, MdPerson, MdArrowDropDown, MdLocationOn } from 'react-icons/md'
import Logo from './Logo'
import { navItems } from './navItems'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-surface/85 backdrop-blur-xl border-b border-outline-variant/40 pt-safe">
      <div className="max-w-7xl mx-auto h-16 px-4 md:px-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <Logo />
          <button className="hidden sm:flex items-center gap-0.5 pl-3 ml-1 border-l border-outline-variant text-secondary hover:text-primary transition-colors">
            <MdLocationOn className="text-base" />
            <span className="text-label-sm uppercase tracking-wider whitespace-nowrap">Cebu City, Philippines</span>
            <MdArrowDropDown className="text-lg" />
          </button>
        </div>

        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              end
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-full text-label-lg transition-colors ${
                  isActive
                    ? 'bg-primary-fixed text-on-primary-fixed'
                    : 'text-on-surface-variant hover:bg-surface-container'
                }`
              }
            >
              <Icon className="text-lg" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <button aria-label="Filter courts" className="w-11 h-11 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container transition-colors">
            <MdTune className="text-[22px]" />
          </button>
          <button aria-label="Open profile" className="w-11 h-11 flex items-center justify-center rounded-full hover:opacity-90">
            <span className="w-8 h-8 rounded-full bg-on-surface text-surface flex items-center justify-center">
              <MdPerson className="text-[18px]" />
            </span>
          </button>
        </div>
      </div>
    </header>
  )
}