// One group chat per open-play game. Only players who joined the game can see it.
// PROTOTYPE: messages stay on this device and other players answer with demo replies.
import { db, getSession, getProfile, useProfile, useTable, useUser } from './db';

let openRoom = null;
export const setOpenRoom = (id) => { openRoom = id; };
const pick = (list) => list[Math.floor(Math.random() * list.length)];
const LINES = ["I'll be there!", 'Anyone bringing extra balls?', 'Can someone carpool from Talisay?', 'Count me in, see you all.', 'What should I bring?', 'Excited for this one.'];

export function sendRoomMessage(matchId, text) {
  const userId = getSession();
  const body = text.trim();
  if (!userId || !body) return;
  const me = getProfile().name;
  db.roomMessages.insert({ matchId, userId, from: 'me', author: me, text: body, read: true });

  const others = (db.matches.get(matchId)?.joined ?? []).filter((n) => n !== me);
  if (!others.length || Math.random() < 0.25) return;
  setTimeout(() => {
    if (getSession() !== userId) return;
    if (!db.matches.get(matchId)?.joined.includes(me)) return; // left the game meanwhile
    db.roomMessages.insert({ matchId, userId, from: 'them', author: pick(others), text: pick(LINES), read: openRoom === matchId });
  }, 1500 + Math.random() * 2000);
}

export function markRoomRead(matchId) {
  const me = getSession();
  db.roomMessages.where((m) => m.userId === me && m.matchId === matchId && m.from === 'them' && !m.read).forEach((m) => db.roomMessages.update(m.id, { read: true }));
}

export function useRoomMessages(matchId) {
  const user = useUser();
  return useTable('roomMessages').filter((m) => m.userId === user?.id && m.matchId === matchId).sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export function useRooms() {
  const me = useProfile().name;
  const user = useUser();
  const msgs = useTable('roomMessages').filter((m) => m.userId === user?.id);
  return useTable('matches')
    .filter((m) => m.joined.includes(me))
    .map((match) => {
      const list = msgs.filter((m) => m.matchId === match.id).sort((a, b) => a.createdAt.localeCompare(b.createdAt));
      return { match, last: list[list.length - 1], unread: list.filter((m) => m.from === 'them' && !m.read).length };
    })
    .sort((a, b) => (b.last?.createdAt ?? '').localeCompare(a.last?.createdAt ?? '') || `${a.match.date}${a.match.time}`.localeCompare(`${b.match.date}${b.match.time}`));
}
export const useRoomUnread = () => useRooms().reduce((n, r) => n + r.unread, 0);
