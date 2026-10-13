// Friend requests: send -> pending -> the other person accepts. Nobody is added directly.
import { db, useTable, useUser, getSession } from './db';

export function sendRequest(playerId) {
  const userId = getSession();
  if (!userId) return;
  const exists = db.requests.where((r) => r.userId === userId && r.playerId === playerId).length;
  if (!exists) db.requests.insert({ userId, playerId, direction: 'outgoing', status: 'pending' });
}
export const acceptRequest = (id) => db.requests.update(id, { status: 'accepted' });
export const removeRequest = (id) => db.requests.remove(id); // decline, cancel or unfriend

export function useSocial() {
  const user = useUser();
  const rows = useTable('requests').filter((r) => r.userId === user?.id);
  const find = (playerId) => rows.find((r) => r.playerId === playerId);
  return {
    friends: rows.filter((r) => r.status === 'accepted'),
    incoming: rows.filter((r) => r.direction === 'incoming' && r.status === 'pending'),
    outgoing: rows.filter((r) => r.direction === 'outgoing' && r.status === 'pending'),
    friendIds: new Set(rows.filter((r) => r.status === 'accepted').map((r) => r.playerId)),
    // 'none' | 'sent' | 'incoming' | 'friends'
    statusOf: (playerId) => {
      const r = find(playerId);
      if (!r) return 'none';
      if (r.status === 'accepted') return 'friends';
      return r.direction === 'incoming' ? 'incoming' : 'sent';
    },
    requestOf: find,
  };
}
