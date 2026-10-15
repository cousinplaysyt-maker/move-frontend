// Court reviews: star rating, comment, surface type and up to 3 photos per review.
import { db, getSession, getProfile, useTable } from './db';
import { checkReviewAchievement } from './achievements';

export const SURFACES = ['Hard court (acrylic)', 'Indoor wood', 'Synthetic / PU mat', 'Concrete', 'Clay', 'Grass', 'Glass padel court'];
export const MAX_PHOTOS = 3;

// Shrinks a photo so a few of them fit in browser storage.
export function shrinkImage(file, max = 720, quality = 0.72) {
  return new Promise((resolve, reject) => {
    if (!file?.type?.startsWith('image/')) return reject(new Error('Not an image'));
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement('canvas');
      c.width = Math.round(img.width * scale);
      c.height = Math.round(img.height * scale);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(img.src);
      resolve(c.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => reject(new Error('Could not read that image'));
    img.src = URL.createObjectURL(file);
  });
}

export function saveReview(venueId, { rating, text, surface, photos }) {
  const userId = getSession();
  if (!userId) return { ok: false, error: 'Log in first.' };
  const data = { venueId, userId, author: getProfile().name, rating, text: text.trim(), surface: surface || null, photos };
  try {
    const mine = db.reviews.where((r) => r.venueId === venueId && r.userId === userId)[0];
    if (mine) db.reviews.update(mine.id, { ...data, editedAt: new Date().toISOString() });
    else db.reviews.insert(data);
  } catch {
    return { ok: false, error: 'Browser storage is full. Try fewer or smaller photos.' };
  }
  checkReviewAchievement();
  return { ok: true };
}
export const deleteReview = (id) => db.reviews.remove(id);

export function useReviews(venueId) {
  return useTable('reviews').filter((r) => r.venueId === venueId).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function useRating(venueId) {
  const list = useReviews(venueId);
  const count = list.length;
  return { count, avg: count ? list.reduce((n, r) => n + r.rating, 0) / count : 0 };
}

// The surface the owner entered, otherwise whatever most reviewers reported.
export function surfaceOf(venue, reviews = []) {
  if (venue.surface) return venue.surface;
  const tally = {};
  reviews.forEach((r) => { if (r.surface) tally[r.surface] = (tally[r.surface] ?? 0) + 1; });
  return Object.entries(tally).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
}
