import { useState } from 'react';
import { IoNotificationsOutline, IoTrashOutline } from 'react-icons/io5';
import { useTable } from '../data/db';
import { useFavorites } from '../data/favorites';
import { useReminders, removeReminder } from '../data/reminders';
import { Page, Card, Btn, Empty, VenueCard } from '../components/ui';

const when = (iso) => new Date(iso).toLocaleString('en-PH', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });

export default function Saved() {
  const venues = useTable('venues');
  const { ids } = useFavorites();
  const reminders = useReminders();
  const [perm, setPerm] = useState(typeof Notification === 'undefined' ? 'unsupported' : Notification.permission);
  const saved = venues.filter((v) => ids.has(v.id));
  const upcoming = reminders.filter((r) => !r.fired);
  const past = reminders.filter((r) => r.fired);

  return (
    <Page title="Saved" subtitle="Your favorite courts and reminders">
      <h2 className="mb-2 font-bold">Saved courts ({saved.length})</h2>
      {saved.length === 0 ? (
        <Empty title="No saved courts yet" hint="Tap the heart on any court to keep it here." action={<Btn to="/map">Browse courts</Btn>} />
      ) : (
        <div className="grid gap-3 md:grid-cols-2">{saved.map((v) => <VenueCard key={v.id} venue={v} />)}</div>
      )}

      <div className="mb-2 mt-8 flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-bold">Reminders ({upcoming.length})</h2>
        {perm === 'default' && <Btn variant="soft" onClick={() => Notification.requestPermission().then(setPerm)}><IoNotificationsOutline size={16} /> Turn on browser alerts</Btn>}
        {perm === 'granted' && <span className="text-sm font-semibold text-[#006948]">Browser alerts on</span>}
        {perm === 'denied' && <span className="text-sm text-[#565e74]">Browser alerts are blocked in your browser settings</span>}
      </div>
      <p className="mb-3 text-sm text-[#565e74]">Reminders appear while move. is open in your browser. Joining an open-play game sets one automatically, and you can add one for a court you booked on the booking page.</p>
      {upcoming.length === 0 ? (
        <Empty title="No upcoming reminders" action={<Btn to="/open-play">Find open play</Btn>} />
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {upcoming.map((r) => (
            <Card key={r.id} className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate font-bold">{r.title}</p>
                <p className="text-sm text-[#565e74]">{when(r.at)} · {r.leadMin >= 1440 ? '1 day' : r.leadMin >= 60 ? `${r.leadMin / 60} hr` : `${r.leadMin} min`} before</p>
              </div>
              <button aria-label="Delete reminder" onClick={() => removeReminder(r.id)} className="rounded-full p-2 text-[#93000a] hover:bg-[#ffdad6]"><IoTrashOutline size={20} /></button>
            </Card>
          ))}
        </div>
      )}
      {past.length > 0 && <p className="mt-4 text-sm text-[#565e74]">{past.length} past reminder{past.length > 1 ? 's' : ''} · <button className="font-bold text-[#006948]" onClick={() => past.forEach((r) => removeReminder(r.id))}>Clear</button></p>}
    </Page>
  );
}
