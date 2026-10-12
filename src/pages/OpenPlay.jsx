import { useState } from 'react';
import { db, useTable, useProfile } from '../data/db';
import { Page, Card, Btn, SportChips, Empty, fmtDate, fmtTime, sportOf } from '../components/ui';

export default function OpenPlay() {
  const matches = useTable('matches');
  const venues = useTable('venues');
  const me = useProfile().name;
  const [sport, setSport] = useState('all');

  const list = matches
    .filter((m) => sport === 'all' || m.sport === sport)
    .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));

  const toggle = (m) => {
    const joined = m.joined.includes(me) ? m.joined.filter((n) => n !== me) : [...m.joined, me];
    db.matches.update(m.id, { joined });
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
                <p className="text-xs font-bold text-[#006948]">{sportOf(m.sport).emoji} {sportOf(m.sport).label} · {m.level}</p>
                <h3 className="mt-1 text-lg font-bold">{m.title}</h3>
                <p className="text-sm text-[#565e74]">
                  {fmtDate(m.date)}, {fmtTime(m.time)} · {venue?.name ?? 'Venue TBA'}
                </p>
                <p className="mt-1 text-sm">Hosted by {m.host} · {left > 0 ? `${left} spots left` : 'Full'}</p>
                <div className="mt-3">
                  {isIn ? (
                    <Btn variant="soft" onClick={() => toggle(m)}>Leave game</Btn>
                  ) : (
                    <Btn disabled={left <= 0} onClick={() => toggle(m)}>Join game</Btn>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </Page>
  );
}
