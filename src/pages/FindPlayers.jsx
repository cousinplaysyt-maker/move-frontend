import { useState } from 'react';
import { db, useTable } from '../data/db';
import { Page, Card, Btn, SportChips, Empty, inputCls, sportOf } from '../components/ui';

export default function FindPlayers() {
  const players = useTable('players');
  const [sport, setSport] = useState('all');
  const [q, setQ] = useState('');

  const list = players.filter(
    (p) => (sport === 'all' || p.sport === sport) && p.name.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <Page title="Find players" subtitle="Invite people to play with you">
      <input className={`${inputCls} mb-3`} placeholder="Search by name" value={q} onChange={(e) => setQ(e.target.value)} />
      <SportChips value={sport} onChange={setSport} />
      {list.length === 0 ? (
        <Empty title="No players match" hint="Try a different sport or name." />
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {list.map((p) => (
            <Card key={p.id} className="flex items-center justify-between gap-3">
              <div>
                <h3 className="font-bold">{p.name}</h3>
                <p className="text-sm text-[#565e74]">{sportOf(p.sport).emoji} {sportOf(p.sport).label} · {p.level} · {p.area}</p>
              </div>
              <Btn variant={p.invited ? 'soft' : 'primary'} onClick={() => db.players.update(p.id, { invited: !p.invited })}>
                {p.invited ? 'Invited' : 'Invite'}
              </Btn>
            </Card>
          ))}
        </div>
      )}
    </Page>
  );
}
