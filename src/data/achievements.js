// Achievement system. Unlocks are saved on the logged-in user (db.users) so they survive refreshes.
// Characters are ORIGINAL chibi pickleball players (see components/Chibi.jsx), not real people.
import { db, getSession, getUser, saveProfile } from './db';

export const CHARACTERS = {
  penny: { name: 'Penny Dink', skin: '#f6d2b0', hair: '#3b2a20', hairStyle: 'ponytail', shirt: '#00855d', accent: '#ffb95f', item: 'paddle', itemColor: '#ff6b6b', band: true, tag: 'Pickleball Pro' },
  kai: { name: 'Kai Kitchen', skin: '#d9a273', hair: '#161616', hairStyle: 'short', shirt: '#2563eb', accent: '#ffffff', item: 'paddle', itemColor: '#facc15', band: true, tag: 'Pickleball Pro' },
  hoops: { name: 'Hoop Hero', skin: '#8d5a3b', hair: '#0f0f0f', hairStyle: 'short', shirt: '#dc2626', accent: '#ffffff', item: 'ball', itemColor: '#f97316', band: true, number: '7', tag: 'Basketball Star' },
  dani: { name: 'Dunk Dani', skin: '#e8b98f', hair: '#3b1d0f', hairStyle: 'ponytail', shirt: '#f97316', accent: '#1f2937', item: 'ball', itemColor: '#f97316', band: true, number: '1', tag: 'Basketball Star' },
  tito: { name: 'Topspin Tito', skin: '#e0ac82', hair: '#1f1410', hairStyle: 'short', shirt: '#0ea5e9', accent: '#ffffff', item: 'racket', itemColor: '#22c55e', band: true, tag: 'Tennis Champ' },
  ace: { name: 'Coach Ace', skin: '#e8b98f', hair: '#9ca3af', hairStyle: 'cap', shirt: '#111827', accent: '#85f8c4', item: 'paddle', itemColor: '#f97316', tag: 'Head Coach' },
};

export const ACHIEVEMENTS = [
  { id: 'court_1', icon: '📍', title: 'Court Scout', text: 'Added your first court to the map', who: 'penny', say: "Hello! I'm Penny! You just put a new court on the map!" },
  { id: 'court_3', icon: '🗺️', title: 'Map Maker', text: 'Added 3 courts', who: 'hoops', say: "Hoop Hero here! 3 courts, that's a triple-double!" },
  { id: 'court_5', icon: '🏟️', title: 'Court Builder', text: 'Added 5 courts', who: 'tito', say: "Topspin Tito! 5 courts, game, set, match!" },
  { id: 'court_10', icon: '👑', title: 'Court King', text: 'Added 10 courts', who: 'dani', say: "Dunk Dani! 10 courts. You run this city!" },
  { id: 'tourney_1', icon: '🏆', title: 'Tournament Host', text: 'Added your first tournament', who: 'ace', say: "Coach Ace reporting! Your first tournament is live!" },
  { id: 'player_1', icon: '🤝', title: 'Recruiter', text: 'Added your first player', who: 'kai', say: "Kai here! A new player joins the squad!" },
];

export const achievementOf = (id) => ACHIEVEMENTS.find((a) => a.id === id);
export const getUnlocked = () => getUser()?.achievements ?? [];

function unlock(id) {
  const have = getUnlocked();
  if (have.includes(id) || !getSession()) return;
  saveProfile({ achievements: [...have, id] });
  window.dispatchEvent(new CustomEvent('move-achievement', { detail: id }));
}

// Call after a court is saved (the court must already have addedBy set).
export function checkCourtAchievements() {
  const me = getSession();
  const n = db.venues.where((v) => v.addedBy === me).length;
  [[1, 'court_1'], [3, 'court_3'], [5, 'court_5'], [10, 'court_10']].forEach(([need, id]) => n >= need && unlock(id));
}
export const checkTourneyAchievement = () => unlock('tourney_1');
export const checkPlayerAchievement = () => unlock('player_1');
