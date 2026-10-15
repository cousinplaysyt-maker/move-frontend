import { useState } from 'react';
import { IoChatbubbles, IoCheckmarkCircle } from 'react-icons/io5';
import { db, useTable, useProfile, getSettings } from '../data/db';
import GameReminder from '../components/GameReminder';
import { setGameReminder } from '../data/reminders';
import { usePlays, logPlay, todayISO, addDays } from '../data/plays';
import { Page, Card, Btn, SportChips, Empty, FriendsJoining, fmtDate, fmtTime, sportOf, SportIcon } from '../components/ui';

export default function OpenPlay() {
  const matches = useTable('matches');
  const venues = useTable('venues');
  const me = useProfile().name;
  const plays = usePlays();
  const [sport, setSport] = useState('all');

  const list = matches
    .filter((m) => sport === 'all' || m.sport === sport)
    .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));

  const toggle = (m) => {
    const joining = !m.joined.includes(me);
    const joined = joining ? [...m.joined, me] : m.joined.filter((n) => n !== me);
    db.matches.update(m.id, { joined });
    if (!joining) setGameReminder(m, 0);
    else if (getSettings().notifyGames !== false) setGameReminder(m, 60); // default: 1 hour before
  };

  return (
    <Page
      title="Open play"
      subtitle="Join a game or host your own"
      back={false}
      actions={<Btn to="/host">Host play</Btn>}
    >
      <SportChips value={sport} onChange={setSport} />
      {list.length === 0 ? (
        <Empty title="No games yet" hint="Be the first to host one." action={<Btn to="/host">Host play</Btn>} />
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {list.map((m) => {
            const venue = venues.find((v) => v.id === m.venueId);
            const isIn = m.joined.includes(me);
            const left = m.spots - m.joined.length;
            return (
              <Card key={m.id}>
                <p className="text-xs font-bold text-[#006948]"><SportIcon sport={m.sport} /> {sportOf(m.sport).label} · {m.level}</p>
                <h3 className="mt-1 text-lg font-bold">{m.title}</h3>
                <p className="text-sm text-[#565e74]">
                  {fmtDate(m.date)}, {fmtTime(m.time)} · {venue?.name ?? 'Venue TBA'}
                </p>
                <p className="mt-1 text-sm">Hosted by {m.host} · {left > 0 ? `${left} spots left` : 'Full'}</p>
                <FriendsJoining names={m.joined} />
                <div className="mt-3 flex flex-wrap gap-2">
                  {isIn ? (
                    <Btn variant="soft" onClick={() => toggle(m)}>Leave game</Btn>
                  ) : (
                    <Btn disabled={left <= 0} onClick={() => toggle(m)}>Join game</Btn>
                  )}
                  {isIn && <Btn to={`/chat/room/${m.id}`} variant="soft"><IoChatbubbles size={16} /> Game chat</Btn>}
                  {isIn && plays.some((p) => p.matchId === m.id) && <span className="inline-flex items-center gap-1.5 px-2 text-sm font-bold text-[#006948]"><IoCheckmarkCircle size={18} /> Checked in</span>}
                  {isIn && !plays.some((p) => p.matchId === m.id) && m.date <= todayISO() && m.date >= addDays(todayISO(), -14) && (
                    <Btn onClick={() => logPlay({ sport: m.sport, date: m.date, matchId: m.id })}>Check in</Btn>
                  )}
                </div>
                {isIn && <GameReminder match={m} />}
              </Card>
            );
          })}
        </div>
      )}
    </Page>
  );
}
