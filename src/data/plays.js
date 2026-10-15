// Games you played, weekly streaks and the weekly leaderboard.
// Other players' weekly game counts are SIMULATED (deterministic per player and week) until
// real accounts exist, so there is something to compete against. The UI says so.
import { db, getSession, useProfile, useTable, useUser } from './db';
import { useSocial } from './social';
import { checkPlayAchievements } from './achievements';

const pad = (n) => String(n).padStart(2, '0');
const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const parse = (s) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
export const todayISO = () => iso(new Date());
export const addDays = (s, n) => { const d = parse(s); d.setDate(d.getDate() + n); return iso(d); };
export function weekStart(s = todayISO()) { const d = parse(s); d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); return iso(d); } // Monday
export const fmtWeek = (ws) => {
  const f = (s) => parse(s).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' });
  return `${f(ws)} – ${f(addDays(ws, 6))}`;
};

const MAX_PER_DAY = 3;

export function usePlays() {
  const user = useUser();
  return useTable('plays').filter((p) => p.userId === user?.id).sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt));
}

export function streakOf(plays) {
  const weeks = new Set(plays.map((p) => weekStart(p.date)));
  const thisWeek = weekStart();
  // the streak stays alive until the current week ends without a game
  let cur = weeks.has(thisWeek) ? thisWeek : addDays(thisWeek, -7);
  let current = 0;
  while (weeks.has(cur)) { current++; cur = addDays(cur, -7); }
  const sorted = [...weeks].sort();
  let best = 0, run = 0;
  sorted.forEach((w, i) => { run = i > 0 && addDays(sorted[i - 1], 7) === w ? run + 1 : 1; best = Math.max(best, run); });
  return { current, best, playedThisWeek: weeks.has(thisWeek) };
}

export function logPlay({ sport, date = todayISO(), matchId = null }) {
  const userId = getSession();
  if (!userId || date > todayISO()) return { ok: false, error: 'You can only log games that already happened.' };
  const mine = db.plays.where((p) => p.userId === userId);
  if (matchId && mine.some((p) => p.matchId === matchId)) return { ok: false, error: 'Already checked in.' };
  if (mine.filter((p) => p.date === date).length >= MAX_PER_DAY) return { ok: false, error: `Up to ${MAX_PER_DAY} games per day.` };
  db.plays.insert({ userId, sport, date, matchId });
  const all = db.plays.where((p) => p.userId === userId);
  checkPlayAchievements({ total: all.length, streak: streakOf(all).current });
  return { ok: true };
}
export const deletePlay = (id) => db.plays.remove(id);

const hash = (str) => { let h = 2166136261; for (const c of str) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return h >>> 0; };
const simulated = (playerId, ws) => hash(`${playerId}|${ws}`) % 6; // 0 to 5 games

export function useLeaderboard({ weekOffset = 0, scope = 'everyone' }) {
  const profile = useProfile();
  const user = useUser();
  const players = useTable('players');
  const { friendIds } = useSocial();
  const plays = usePlays();
  const ws = addDays(weekStart(), weekOffset * 7);
  const mine = plays.filter((p) => weekStart(p.date) === ws).length;

  const entries = [
    { id: 'me', name: profile.name, avatar: profile.avatar, games: mine, isMe: true },
    ...players.filter((p) => scope === 'everyone' || friendIds.has(p.id)).map((p) => ({ id: p.id, name: p.name, avatar: p.avatar, games: simulated(p.id, ws) })),
  ].sort((a, b) => b.games - a.games || Number(b.isMe) - Number(a.isMe) || a.name.localeCompare(b.name));

  let rank = 0, prev = null;
  const rows = entries.map((e, i) => { if (e.games !== prev) { rank = i + 1; prev = e.games; } return { ...e, rank }; });
  return { rows, ws, me: rows.find((r) => r.isMe), userId: user?.id };
}
