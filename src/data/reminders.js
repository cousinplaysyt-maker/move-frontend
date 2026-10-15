// Reminders for joined games and court bookings. They fire while the app is open
// (see components/ReminderCenter.jsx); real push needs a backend.
import { db, getSession, useTable, useUser } from './db';

export const LEADS = [
  { min: 30, label: '30 minutes before' },
  { min: 60, label: '1 hour before' },
  { min: 180, label: '3 hours before' },
  { min: 1440, label: '1 day before' },
];
export const startsAt = (date, time) => new Date(`${date}T${time}:00`).toISOString();

export function setGameReminder(match, leadMin) {
  const userId = getSession();
  if (!userId) return;
  const existing = db.reminders.where((r) => r.userId === userId && r.kind === 'game' && r.matchId === match.id)[0];
  if (!leadMin) { if (existing) db.reminders.remove(existing.id); return; }
  const row = { userId, kind: 'game', matchId: match.id, title: match.title, at: startsAt(match.date, match.time), leadMin, fired: false };
  if (existing) db.reminders.update(existing.id, row);
  else db.reminders.insert(row);
}

export function addBookingReminder({ title, date, time, leadMin }) {
  const userId = getSession();
  if (!userId) return;
  db.reminders.insert({ userId, kind: 'booking', title, at: startsAt(date, time), leadMin, fired: false });
}
export const removeReminder = (id) => db.reminders.remove(id);

export function useReminders() {
  const user = useUser();
  return useTable('reminders').filter((r) => r.userId === user?.id).sort((a, b) => a.at.localeCompare(b.at));
}
