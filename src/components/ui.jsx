// Small shared pieces used by the new pages.
import { Link, useNavigate } from 'react-router-dom';
import { IoChevronBack } from 'react-icons/io5';
import { SPORTS } from '../data/seed';

export const peso = (n) => `₱${Number(n).toLocaleString('en-PH')}`;
export const fmtDate = (iso) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString('en-PH', { weekday: 'short', month: 'short', day: 'numeric' });
export const fmtTime = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number);
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
};
export const sportOf = (key) => SPORTS.find((s) => s.key === key) ?? { key, label: key, emoji: '🏅' };

export const inputCls =
  'w-full rounded-xl border border-[#bccac0] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#006948] focus:ring-2 focus:ring-[#85f8c4]';

export function Page({ title, subtitle, back = true, actions, children }) {
  const navigate = useNavigate();
  return (
    <div className="mx-auto w-full max-w-5xl px-4 pb-28 pt-6">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div className="flex items-start gap-2">
          {back && (
            <button onClick={() => navigate(-1)} aria-label="Go back" className="mt-0.5 rounded-full p-1.5 hover:bg-[#e5eeff]">
              <IoChevronBack size={20} />
            </button>
          )}
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-[#0b1c30]">{title}</h1>
            {subtitle && <p className="mt-0.5 text-sm text-[#565e74]">{subtitle}</p>}
          </div>
        </div>
        {actions}
      </div>
      {children}
    </div>
  );
}

export function Card({ className = '', children }) {
  return <div className={`rounded-2xl bg-white p-4 shadow-sm ${className}`}>{children}</div>;
}

const variants = {
  primary: 'bg-[#006948] text-white hover:bg-[#00855d] shadow-[0_4px_14px_rgba(0,105,72,0.3)]',
  soft: 'bg-[#e5eeff] text-[#0b1c30] hover:bg-[#d3e4fe]',
  danger: 'bg-[#ffdad6] text-[#93000a] hover:bg-[#ffc9c3]',
};

export function Btn({ to, variant = 'primary', className = '', ...props }) {
  const cls = `inline-flex items-center justify-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-bold transition active:scale-95 disabled:opacity-50 ${variants[variant]} ${className}`;
  return to ? <Link to={to} className={cls} {...props} /> : <button className={cls} {...props} />;
}

export function SportChips({ value, onChange }) {
  const items = [{ key: 'all', label: 'All', emoji: '✨' }, ...SPORTS];
  return (
    <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
      {items.map((s) => (
        <button
          key={s.key}
          onClick={() => onChange(s.key)}
          className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
            value === s.key ? 'bg-[#006948] text-white' : 'bg-white text-[#0b1c30] shadow-sm hover:bg-[#e5eeff]'
          }`}
        >
          {s.emoji} {s.label}
        </button>
      ))}
    </div>
  );
}

export function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-bold text-[#3d4a42]">{label}</span>
      {children}
    </label>
  );
}

export function Empty({ title, hint, action }) {
  return (
    <Card className="py-10 text-center">
      <p className="font-bold">{title}</p>
      {hint && <p className="mt-1 text-sm text-[#565e74]">{hint}</p>}
      {action && <div className="mt-4">{action}</div>}
    </Card>
  );
}

export function VenueCard({ venue, selected, onSelect }) {
  return (
    <Card className={`transition ${selected ? 'ring-2 ring-[#006948]' : ''}`}>
      <div className="flex items-start justify-between gap-3" onClick={onSelect} role={onSelect ? 'button' : undefined}>
        <div className="min-w-0">
          <h3 className="truncate font-bold">{venue.name}</h3>
          <p className="truncate text-sm text-[#565e74]">{venue.area}</p>
          <p className="mt-1 text-sm">
            {venue.sports.map((s) => sportOf(s).emoji).join(' ')} · {venue.courts} courts · {venue.distanceKm} km
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-lg font-extrabold text-[#006948]">{peso(venue.price)}</p>
          <p className="text-xs text-[#565e74]">per court / hr</p>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <Btn to={`/venue/${venue.id}`} variant="soft">Details</Btn>
        <Btn to={`/book/${venue.id}`}>Book court</Btn>
      </div>
    </Card>
  );
}
