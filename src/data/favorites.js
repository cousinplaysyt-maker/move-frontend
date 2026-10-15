import { db, getSession, useTable, useUser } from './db';
import { checkFavoriteAchievement } from './achievements';

export function useFavorites() {
  const user = useUser();
  const rows = useTable('favorites').filter((f) => f.userId === user?.id);
  const ids = new Set(rows.map((r) => r.venueId));
  return { ids, has: (id) => ids.has(id) };
}

export function toggleFavorite(venueId) {
  const userId = getSession();
  if (!userId) return;
  const existing = db.favorites.where((f) => f.userId === userId && f.venueId === venueId)[0];
  if (existing) db.favorites.remove(existing.id);
  else { db.favorites.insert({ userId, venueId }); checkFavoriteAchievement(); }
}
