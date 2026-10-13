// Tiny local database on top of localStorage. No server and no extra packages.
// Data lives in the browser and survives refreshes. Clear it with resetDb().
import { useEffect, useState } from 'react';
import { seed, defaultProfile } from './seed';

const PREFIX = 'move_db_';
const DB_VERSION = 3; // bump this to re-seed after you change seed.js
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
  users: table('users'),
  requests: table('requests'),
};

export function initDb() {
  if (localStorage.getItem(PREFIX + 'version') === String(DB_VERSION)) return;
  Object.entries(seed).forEach(([name, rows]) => localStorage.setItem(PREFIX + name, JSON.stringify(rows)));
  localStorage.setItem(PREFIX + 'version', String(DB_VERSION));
  window.dispatchEvent(new Event(CHANGE));
}

export function resetDb() {
  const keep = [PREFIX + 'users', PREFIX + 'session', PREFIX + 'requests'];
  Object.keys(localStorage)
    .filter((k) => k.startsWith(PREFIX) && !keep.includes(k))
    .forEach((k) => localStorage.removeItem(k));
  initDb();
}

// ---- session + current user (accounts live in the 'users' table) ----
export const getSession = () => read('session', null);
export function setSession(id) {
  if (id) localStorage.setItem(PREFIX + 'session', JSON.stringify(id));
  else localStorage.removeItem(PREFIX + 'session');
  window.dispatchEvent(new Event(CHANGE));
}
export const getUser = () => {
  const id = getSession();
  return id ? read('users').find((u) => u.id === id) ?? null : null;
};
export const getProfile = () => {
  const u = getUser();
  if (!u) return defaultProfile;
  const { pwHash, salt, ...profile } = u; // never expose the password hash
  return { ...defaultProfile, ...profile };
};
export const saveProfile = (patch) => {
  const id = getSession();
  if (id) db.users.update(id, patch);
};

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
export const useUser = () => useLive(getUser);

export const defaultSettings = {
  city: 'Cebu City',
  unit: 'km',
  radiusKm: 10, // how far "Near me" and the map look
  myLoc: null, // {lat, lng} from GPS; null = use the city centre
  notifyBookings: true,
  notifyGames: true,
  notifyTourneys: false,
};
export const getSettings = () => ({ ...defaultSettings, ...read('settings', {}) });
export const saveSettings = (patch) => write('settings', { ...getSettings(), ...patch });
export const useSettings = () => useLive(getSettings);
