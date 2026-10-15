// Player-to-player chat on top of the local database.
// PROTOTYPE: messages live in this browser only. Friends reply automatically (demo bot)
// until there is a real backend that can deliver messages between accounts.
import { useEffect, useState } from 'react';
import { db, getSession, useTable, useUser } from './db';
import { useSocial } from './social';
import { SPORTS } from './seed';
import { checkChatAchievement } from './achievements';
import { useRoomUnread } from './rooms';

const TYPING = 'move-typing';
const typing = new Set();
let openId = null; // thread currently on screen, so replies there count as read
export const setOpenThread = (id) => { openId = id; };

const pick = (list) => list[Math.floor(Math.random() * list.length)];

function replyFor(text, player) {
  const first = player.name.split(' ')[0];
  const sport = SPORTS.find((s) => s.key === player.sport)?.label ?? 'a game';
  if (/\b(hi|hello|hey|yo|sup)\b/i.test(text)) return pick([`Hey! Down for some ${sport} this week?`, `Hi! Good to hear from you. It's ${first} here.`]);
  if (/\b(book|court|venue|where)\b/i.test(text)) return pick(['Let\'s do Minglanilla, the courts there are great.', 'Anywhere in Cebu City works for me. Send me the booking link!']);
  if (/\b(time|when|today|tomorrow|tonight|weekend)\b/i.test(text)) return pick(['I\'m free after 5pm. Does that work?', 'Weekend mornings are best for me.']);
  if (text.includes('?')) return pick(['Sounds good to me!', 'Yep, count me in.', 'Let me check my schedule and get back to you.']);
  return pick(['Nice! See you on the court.', 'Haha, for sure.', 'Got it. Let\'s set something up.', `Down for ${sport} anytime!`]);
}

export function markRead(playerId) {
  const me = getSession();
  db.messages.where((m) => m.userId === me && m.playerId === playerId && m.from === 'them' && !m.read).forEach((m) => db.messages.update(m.id, { read: true }));
}

export function sendMessage(playerId, text) {
  const userId = getSession();
  const body = text.trim();
  if (!userId || !body) return;
  db.messages.insert({ userId, playerId, from: 'me', text: body, read: true });
  checkChatAchievement();

  const player = db.players.get(playerId);
  if (!player) return;
  typing.add(playerId);
  window.dispatchEvent(new Event(TYPING));
  setTimeout(() => {
    typing.delete(playerId);
    window.dispatchEvent(new Event(TYPING));
    if (getSession() !== userId) return; // logged out in the meantime
    db.messages.insert({ userId, playerId, from: 'them', text: replyFor(body, player), read: openId === playerId });
  }, 1200 + Math.random() * 1500);
}

export function useTyping(playerId) {
  const [on, setOn] = useState(() => typing.has(playerId));
  useEffect(() => {
    const sync = () => setOn(typing.has(playerId));
    sync();
    window.addEventListener(TYPING, sync);
    return () => window.removeEventListener(TYPING, sync);
  }, [playerId]);
  return on;
}

export function useMessages(playerId) {
  const user = useUser();
  return useTable('messages')
    .filter((m) => m.userId === user?.id && m.playerId === playerId)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

// Friends plus anyone you already talked to, newest conversation first.
export function useThreads() {
  const user = useUser();
  const msgs = useTable('messages').filter((m) => m.userId === user?.id);
  const players = useTable('players');
  const { friendIds } = useSocial();
  const ids = new Set([...friendIds, ...msgs.map((m) => m.playerId)]);
  return [...ids]
    .map((id) => {
      const list = msgs.filter((m) => m.playerId === id).sort((a, b) => a.createdAt.localeCompare(b.createdAt));
      return { player: players.find((p) => p.id === id), last: list[list.length - 1], unread: list.filter((m) => m.from === 'them' && !m.read).length };
    })
    .filter((t) => t.player)
    .sort((a, b) => (b.last?.createdAt ?? '').localeCompare(a.last?.createdAt ?? '') || a.player.name.localeCompare(b.player.name));
}

export const useDirectUnread = () => useThreads().reduce((n, t) => n + t.unread, 0);
export const useUnread = () => useDirectUnread() + useRoomUnread();
