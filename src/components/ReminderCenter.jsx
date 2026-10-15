// Checks reminders every 20 seconds while the app is open and shows an alert (plus a
// browser notification when the person allowed them).
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { IoNotifications, IoClose } from 'react-icons/io5';
import { db, getSession, getSettings } from '../data/db';

const STALE_MS = 60 * 60 * 1000; // ignore reminders for events that started over an hour ago

export default function ReminderCenter() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const tick = () => {
      const userId = getSession();
      if (!userId) return;
      const settings = getSettings();
      const now = Date.now();
      db.reminders.where((r) => r.userId === userId && !r.fired).forEach((r) => {
        const start = new Date(r.at).getTime();
        if (now < start - r.leadMin * 60000) return;
        db.reminders.update(r.id, { fired: true });
        const allowed = r.kind === 'game' ? settings.notifyGames : settings.notifyBookings;
        if (!allowed || now - start > STALE_MS) return;
        const mins = Math.max(0, Math.round((start - now) / 60000));
        const when = mins <= 0 ? 'is starting now' : mins < 90 ? `starts in ${mins} min` : `starts at ${new Date(r.at).toLocaleTimeString('en-PH', { hour: 'numeric', minute: '2-digit' })}`;
        const alert = { id: r.id, title: r.title, when, kind: r.kind };
        setAlerts((a) => [...a, alert]);
        setTimeout(() => setAlerts((a) => a.filter((x) => x.id !== r.id)), 20000);
        if ('Notification' in window && Notification.permission === 'granted') new Notification(r.title, { body: when });
      });
    };
    tick();
    const t = setInterval(tick, 20000);
    return () => clearInterval(t);
  }, []);

  if (!alerts.length) return null;
  return (
    <div className="fixed right-3 top-20 z-[90] flex w-[min(92vw,340px)] flex-col gap-2" role="status" aria-live="polite">
      {alerts.map((a) => (
        <div key={a.id} className="chibi-bubble flex items-start gap-3 rounded-2xl bg-white p-3 shadow-xl ring-1 ring-[#0b1c30]/10">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#85f8c4] text-[#002114]"><IoNotifications size={20} /></span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold uppercase tracking-wide text-[#006948]">{a.kind === 'game' ? 'Game reminder' : 'Booking reminder'}</p>
            <p className="truncate font-bold">{a.title}</p>
            <p className="text-sm text-[#565e74]">{a.when}</p>
            <Link to="/saved" className="text-sm font-bold text-[#006948]">View reminders</Link>
          </div>
          <button aria-label="Dismiss" onClick={() => setAlerts((x) => x.filter((y) => y.id !== a.id))} className="rounded-full p-1 hover:bg-[#e5eeff]"><IoClose size={18} /></button>
        </div>
      ))}
    </div>
  );
}
