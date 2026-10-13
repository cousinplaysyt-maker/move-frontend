import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoSearch, IoCalendarOutline, IoAddCircleOutline, IoPeopleOutline, IoTrophyOutline, IoArrowForward } from 'react-icons/io5';
import { useTable } from '../data/db';
import { SportChips, VenueCard, Btn, inputCls } from '../components/ui';

// Uses the first photo found in src/assets for the hero (jpg, png or webp).
const heroImages = Object.values(import.meta.glob('../assets/*.{jpg,jpeg,png,webp}', { eager: true, import: 'default' }));
const hero = heroImages[0];

const actions = [
  { to: '/book', label: 'Book Court', Icon: IoCalendarOutline, tint: 'bg-[#85f8c4]' },
  { to: '/host', label: 'Host Play', Icon: IoAddCircleOutline, tint: 'bg-[#dae2fd]' },
  { to: '/players', label: 'Find Players', Icon: IoPeopleOutline, tint: 'bg-[#d3e4fe]' },
  { to: '/tourneys', label: 'Tourneys', Icon: IoTrophyOutline, tint: 'bg-[#ffddb8]' },
];

export default function Discover() {
  const navigate = useNavigate();
  const venues = useTable('venues');
  const [sport, setSport] = useState('all');
  const [q, setQ] = useState('');

  const popular = venues.filter((v) => sport === 'all' || v.sports.includes(sport));

  return (
    <div className="mx-auto w-full max-w-5xl px-4 pb-28 pt-6">
      <form onSubmit={(e) => { e.preventDefault(); navigate(`/map?q=${encodeURIComponent(q)}`); }} className="relative mb-4">
        <IoSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#006948]" size={20} />
        <input className={`${inputCls} rounded-full py-3.5 pl-11`} placeholder="Search courts, clubs, or matches…" value={q} onChange={(e) => setQ(e.target.value)} />
      </form>

      <SportChips value={sport} onChange={setSport} />

      <section className="mb-6 grid overflow-hidden rounded-3xl bg-white shadow-sm md:grid-cols-2">
        <div className="flex flex-col justify-center gap-4 p-6 md:p-10">
          <p className="text-sm font-bold text-[#006948]">Cebu weekend showdown · 40+ matches</p>
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">Open Play Weekend in Cebu</h1>
          <p className="text-[#3d4a42]">Pickleball, padel and basketball runs forming fast across Metro Cebu. Join solo or with a partner.</p>
          <div><Btn to="/open-play" className="px-6 py-3">Browse Matches <IoArrowForward /></Btn></div>
        </div>
        <div className="min-h-[220px] bg-gradient-to-br from-[#006948] to-[#85f8c4]">
          {hero && <img src={hero} alt="Players on a pickleball court" className="h-full w-full object-cover" />}
        </div>
      </section>

      <section className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4">
        {actions.map(({ to, label, Icon, tint }) => (
          <Link key={to} to={to} className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm transition hover:shadow-md active:scale-95">
            <span className={`flex h-11 w-11 items-center justify-center rounded-full ${tint}`}><Icon size={22} /></span>
            <span className="font-bold">{label}</span>
          </Link>
        ))}
      </section>

      <h2 className="mb-3 text-lg font-bold">Courts you can book</h2>
      <div className="grid gap-3 md:grid-cols-2">
        {popular.map((v) => <VenueCard key={v.id} venue={v} />)}
      </div>
    </div>
  );
}
