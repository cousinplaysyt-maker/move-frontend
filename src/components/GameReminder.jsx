import { IoNotificationsOutline } from 'react-icons/io5';
import { LEADS, setGameReminder, useReminders } from '../data/reminders';

export default function GameReminder({ match }) {
  const current = useReminders().find((r) => r.kind === 'game' && r.matchId === match.id);
  return (
    <label className="mt-3 flex flex-wrap items-center gap-2 text-sm font-semibold text-[#3d4a42]">
      <IoNotificationsOutline size={18} className="text-[#006948]" /> Remind me
      <select
        className="rounded-full border border-[#bccac0] bg-white px-3 py-1.5 text-sm outline-none focus:border-[#006948]"
        value={current?.leadMin ?? 0}
        onChange={(e) => setGameReminder(match, Number(e.target.value))}
      >
        <option value={0}>Off</option>
        {LEADS.map((l) => <option key={l.min} value={l.min}>{l.label}</option>)}
      </select>
    </label>
  );
}
