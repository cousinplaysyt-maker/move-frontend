// Login / logout on top of the local database.
// PROTOTYPE ONLY: passwords are hashed in the browser. A real backend must do this on the server.
import { db, getSession, setSession } from './db';
import { defaultProfile } from './seed';
const hash = async (password, salt) => {
  const bytes = new TextEncoder().encode(`${salt}:${password}`);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
};

export async function signup({ name, email, password }) {
  const mail = email.trim().toLowerCase();
  if (!mail || !password) throw new Error('Enter your email and a password.');
  if (password.length < 6) throw new Error('Password needs at least 6 characters.');
  if (db.users.where((u) => u.email === mail).length) throw new Error('That email already has an account.');
  const salt = crypto.randomUUID();
  const user = db.users.insert({
    ...defaultProfile,
    name: name.trim() || 'Player One',
    email: mail,
    salt,
    pwHash: await hash(password, salt),
    avatar: null,
  });
  // sample incoming friend requests so you can try accepting one
  ['p4', 'p5'].forEach((playerId) =>
    db.requests.insert({ userId: user.id, playerId, direction: 'incoming', status: 'pending' }),
  );
  setSession(user.id);
}

export async function login({ email, password }) {
  const user = db.users.where((u) => u.email === email.trim().toLowerCase())[0];
  if (!user || (await hash(password, user.salt)) !== user.pwHash) throw new Error('Wrong email or password.');
  setSession(user.id);
}

export const logout = () => setSession(null);
export const isLoggedIn = () => !!getSession();
