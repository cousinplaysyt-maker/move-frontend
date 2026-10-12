// Tiny local database on top of localStorage. No server and no extra packages.
// Data lives in the browser and survives refreshes. Clear it with resetDb().
import { useEffect, useState } from 'react';
import { seed, defaultProfile } from './seed';

const PREFIX = 'move_db_';
const DB_VERSION = 1; // bump this to re-seed after you change seed.js
const CHANGE = 'move-db-change';

const read = (name, fallback = []) => {
  try {
    const raw = localStorage.getItem(PREFIX + name);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const write = (name, value) => {
  localStorage.setItem(PREFIX + name, JSON.stringify(value));
  window.dispatchEvent(new Event(CHANGE));
};

const uid = () =>
  globalThis.crypto?.randomUUID?.() ?? `${Date.now()}${Math.random().toString(16).slice(2)}`;

function table(name) {
  return {
    all: () => read(name),
    get: (id) => read(name).find((r) => r.id === id) ?? null,
    where: (fn) => read(name).filter(fn),
    insert: (row) => {
      const record = { id: uid(), createdAt: new Date().toISOString(), ...row };
      write(name, [...read(name), record]);
      return record;
    },
    update: (id, patch) => {
      write(name, read(name).map((r) => (r.id === id ? { ...r, ...patch } : r)));
    },
    remove: (id) => write(name, read(name).filter((r) => r.id !== id)),
  };
}

export const db = {
  venues: table('venues'),
  matches: table('matches'),
  players: table('players'),
  tournaments: table('tournaments'),
  bookings: table('bookings'),
};

export function initDb() {
  if (localStorage.getItem(PREFIX + 'version') === String(DB_VERSION)) return;
  Object.entries(seed).forEach(([name, rows]) => localStorage.setItem(PREFIX + name, JSON.stringify(rows)));
  localStorage.setItem(PREFIX + 'profile', JSON.stringify(defaultProfile));
  localStorage.setItem(PREFIX + 'version', String(DB_VERSION));
  window.dispatchEvent(new Event(CHANGE));
}

export function resetDb() {
  Object.keys(localStorage)
    .filter((k) => k.startsWith(PREFIX))
    .forEach((k) => localStorage.removeItem(k));
  initDb();
}

export const getProfile = () => read('profile', defaultProfile);
export const saveProfile = (patch) => write('profile', { ...getProfile(), ...patch });

function useLive(getter) {
  const [value, setValue] = useState(getter);
  useEffect(() => {
    const sync = () => setValue(getter());
    window.addEventListener(CHANGE, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(CHANGE, sync);
      window.removeEventListener('storage', sync);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return value;
}

export const useTable = (name) => useLive(() => read(name));
export const useProfile = () => useLive(getProfile);
