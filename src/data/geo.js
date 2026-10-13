// Distance from "me" to each venue, and the radius filter.
import { useTable, useSettings, saveSettings } from './db';

export const CITY_CENTERS = {
  'Cebu City': { lat: 10.3157, lng: 123.8854 },
  Mandaue: { lat: 10.3236, lng: 123.9223 },
  'Lapu-Lapu': { lat: 10.3103, lng: 123.9494 },
  Talisay: { lat: 10.2628, lng: 123.8494 },
  Minglanilla: { lat: 10.2447, lng: 123.7961 },
};

export function haversineKm(a, b) {
  const rad = (d) => (d * Math.PI) / 180;
  const h =
    Math.sin(rad(b.lat - a.lat) / 2) ** 2 +
    Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(rad(b.lng - a.lng) / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(h));
}

// Ask the browser for the real position and remember it.
export function locateMe(onError) {
  if (!navigator.geolocation) return onError?.('Your browser does not support location.');
  navigator.geolocation.getCurrentPosition(
    ({ coords }) => saveSettings({ myLoc: { lat: coords.latitude, lng: coords.longitude } }),
    () => onError?.('Location is blocked. Allow it in your browser settings and try again.'),
    { enableHighAccuracy: true, timeout: 10000 },
  );
}

// Venues with distanceKm measured from me, nearest first.
export function useNearby({ sport = 'all', withinRadius = true } = {}) {
  const venues = useTable('venues');
  const { city, myLoc, radiusKm } = useSettings();
  const origin = myLoc ?? CITY_CENTERS[city] ?? CITY_CENTERS['Cebu City'];
  const all = venues
    .map((v) => ({ ...v, distanceKm: haversineKm(origin, v) }))
    .filter((v) => sport === 'all' || v.sports.includes(sport))
    .sort((a, b) => a.distanceKm - b.distanceKm);
  const list = withinRadius ? all.filter((v) => v.distanceKm <= radiusKm) : all;
  return { list, total: all.length, origin, radiusKm, usingGps: !!myLoc, city };
}
