import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { IoLocationSharp, IoCaretDown, IoOptionsOutline, IoLogOutOutline } from 'react-icons/io5';
import { navItems } from './navItems';
import { saveSettings, useSettings, useProfile } from '../data/db';
import { logout } from '../data/auth';
import { Avatar } from './ui';

const CITIES = ['Cebu City', 'Mandaue', 'Lapu-Lapu', 'Talisay', 'Minglanilla'];

export default function Header() {
  const { city } = useSettings();
  const profile = useProfile();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-[#e5eeff] bg-[#f8f9ff]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4">
        <div className="flex items-center gap-3">
          <Link to="/" aria-label="move. home" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#006948] text-lg font-extrabold text-white">m</span>
            <span className="text-xl font-extrabold tracking-tight">move<span className="text-[#006948]">.</span></span>
          </Link>

          <div className="relative">
            <button onClick={() => setOpen((o) => !o)} className="flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-[#565e74] hover:bg-[#e5eeff]">
              <IoLocationSharp className="text-[#006948]" /> {city}, Philippines <IoCaretDown size={10} />
            </button>
            {open && (
              <ul className="absolute left-0 top-full z-50 mt-1 w-44 rounded-xl bg-white p-1 shadow-lg">
                {CITIES.map((c) => (
                  <li key={c}>
                    <button
                      onClick={() => { saveSettings({ city: c, myLoc: null }); setOpen(false); }}
                      className={`w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-[#eff4ff] ${c === city ? 'font-bold text-[#006948]' : ''}`}
                    >
                      {c}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map(({ label, path, Icon }) => (
            <NavLink
              key={path}
              to={path}
              end={path === '/'}
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                  isActive ? 'bg-[#85f8c4] text-[#002114]' : 'text-[#3d4a42] hover:bg-[#e5eeff]'
                }`
              }
            >
              <Icon size={18} /> {label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Link to="/settings" aria-label="Settings" className="flex h-10 w-10 items-center justify-center rounded-full text-[#3d4a42] hover:bg-[#e5eeff]">
            <IoOptionsOutline size={22} />
          </Link>
          <Link to="/profile" aria-label="Profile">
            <Avatar name={profile.name} src={profile.avatar} size={36} />
          </Link>
          <button onClick={() => { logout(); navigate('/login'); }} aria-label="Log out" title="Log out" className="flex h-10 w-10 items-center justify-center rounded-full text-[#3d4a42] hover:bg-[#e5eeff]">
            <IoLogOutOutline size={22} />
          </button>
        </div>
      </div>
    </header>
  );
}
