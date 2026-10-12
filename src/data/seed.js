// Starter data for the local database. Edit freely, then bump DB_VERSION in db.js to re-seed.
export const SPORTS = [
  { key: 'pickleball', label: 'Pickleball', emoji: '🏓' },
  { key: 'basketball', label: 'Basketball', emoji: '🏀' },
  { key: 'badminton', label: 'Badminton', emoji: '🏸' },
  { key: 'tennis', label: 'Tennis', emoji: '🎾' },
  { key: 'padel', label: 'Padel', emoji: '🥎' },
];

const day = (offset) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
};

export const seed = {
  venues: [
    { id: 'minglanilla', name: 'Minglanilla Pickleball Club', area: 'Ward 2, Poblacion, Minglanilla', sports: ['pickleball', 'badminton'], price: 300, distanceKm: 8.2, courts: 7, amenities: ['Lighting', 'Indoor AC', 'Pro shop', 'Paddle rental'], lat: 10.2447, lng: 123.7961 },
    { id: 'lahug', name: 'Metro Sports Center Lahug', area: 'Salinas Drive, Lahug, Cebu City', sports: ['badminton', 'tennis'], price: 350, distanceKm: 3.4, courts: 6, amenities: ['Lighting', 'Parking', 'Showers'], lat: 10.3278, lng: 123.9066 },
    { id: 'mandaue', name: 'North Reclamation Badminton & Hoops', area: 'Subangdaku, Mandaue', sports: ['badminton', 'basketball'], price: 280, distanceKm: 5.1, courts: 4, amenities: ['Lighting', 'Parking'], lat: 10.3436, lng: 123.9318 },
    { id: 'mactan', name: 'Mactan Seaside Padel & Tennis', area: 'Punta Engaño, Lapu-Lapu', sports: ['padel', 'tennis'], price: 450, distanceKm: 11.8, courts: 3, amenities: ['Glass courts', 'Lighting', 'Cafe'], lat: 10.319, lng: 124.005 },
  ],
  matches: [
    { id: 'm1', title: 'Friday night rally', sport: 'pickleball', venueId: 'minglanilla', date: day(1), time: '18:00', level: 'Intermediate', spots: 8, joined: ['Migs', 'Ana', 'Jo'], host: 'Migs' },
    { id: 'm2', title: 'Beginner pickleball mixer', sport: 'pickleball', venueId: 'minglanilla', date: day(2), time: '16:00', level: 'Beginner', spots: 10, joined: ['Ana'], host: 'Ana' },
    { id: 'm3', title: 'Doubles badminton', sport: 'badminton', venueId: 'lahug', date: day(2), time: '19:00', level: 'Intermediate', spots: 4, joined: ['Rey', 'Kim', 'Dan'], host: 'Rey' },
    { id: 'm4', title: 'Half-court 3v3', sport: 'basketball', venueId: 'mandaue', date: day(3), time: '17:30', level: 'Any', spots: 6, joined: ['Paolo', 'Jun'], host: 'Paolo' },
    { id: 'm5', title: 'Sunrise padel', sport: 'padel', venueId: 'mactan', date: day(4), time: '07:00', level: 'Advanced', spots: 4, joined: ['Lia'], host: 'Lia' },
  ],
  players: [
    { id: 'p1', name: 'Migs Alcantara', sport: 'pickleball', level: 'Intermediate', area: 'Minglanilla', invited: false },
    { id: 'p2', name: 'Ana Villaluz', sport: 'pickleball', level: 'Beginner', area: 'Talisay', invited: false },
    { id: 'p3', name: 'Rey Dumdum', sport: 'badminton', level: 'Advanced', area: 'Lahug', invited: false },
    { id: 'p4', name: 'Kim Lopez', sport: 'badminton', level: 'Intermediate', area: 'Mandaue', invited: false },
    { id: 'p5', name: 'Paolo Reyes', sport: 'basketball', level: 'Any', area: 'Cebu City', invited: false },
    { id: 'p6', name: 'Lia Tan', sport: 'padel', level: 'Advanced', area: 'Lapu-Lapu', invited: false },
  ],
  tournaments: [
    { id: 't1', name: 'Cebu Weekend Showdown', sport: 'pickleball', venueId: 'minglanilla', date: day(9), fee: 500, slots: 32, registered: ['Migs', 'Ana'] },
    { id: 't2', name: 'Metro Smash Open', sport: 'badminton', venueId: 'lahug', date: day(16), fee: 350, slots: 24, registered: ['Rey', 'Kim'] },
    { id: 't3', name: 'Mactan Padel Cup', sport: 'padel', venueId: 'mactan', date: day(23), fee: 800, slots: 16, registered: ['Lia'] },
  ],
  bookings: [],
};

export const defaultProfile = { name: 'Player One', sport: 'pickleball', level: 'Beginner', area: 'Talisay' };
