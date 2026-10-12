import { useState } from 'react';
import { db, useTable, useProfile } from '../data/db';
import { Page, Card, Btn, SportChips, Empty, peso, fmtDate, sportOf } from '../components/ui';

export default function Tourneys() {
  const tournaments = useTable('tournaments');
  const venues = useTable('venues');
  const me = useProfile().name;
  const [sport, setSport] = useState('all');

  const list = tournaments
    .filter((t) => sport === 'all' || t.sport === sport)
    .sort((a, b) => a.date.localeCompare(b.date));

  const toggle = (t) =>
    db.tournaments.update(t.id, {
      registered: t.registered.includes(me) ? t.registered.filter((n) => n !== me) : [...t.registered, me],
    });

  return (
    <Page title="Tourneys" subtitle="Upcoming tournaments around Cebu">
      <SportChips value={sport} onChange={setSport} />
      {list.length === 0 ? (
        <Empty title="No tournaments for this sport" hint="Check back soon." />
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {list.map((t) => {
            const isIn = t.registered.includes(me);
            const full = t.registered.length >= t.slots;
            return (
              <Card key={t.id}>
                <p className="text-xs font-bold text-[#006948]">{sportOf(t.sport).emoji} {sportOf(t.sport).label}</p>
                <h3 className="mt-1 text-lg font-bold">{t.name}</h3>
                <p className="text-sm text-[#565e74]">{fmtDate(t.date)} · {venues.find((v) => v.id === t.venueId)?.name}</p>
                <p className="mt-1 text-sm">{peso(t.fee)} entry · {t.registered.length}/{t.slots} registered</p>
                <div className="mt-3">
                  {isIn ? (
                    <Btn variant="soft" onClick={() => toggle(t)}>Withdraw</Btn>
                  ) : (
                    <Btn disabled={full} onClick={() => toggle(t)}>{full ? 'Full' : 'Register'}</Btn>
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
