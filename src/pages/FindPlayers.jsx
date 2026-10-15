import { useState } from 'react';
import { IoChatbubbleEllipsesOutline } from 'react-icons/io5';
import { db, useTable } from '../data/db';
import { useSocial, sendRequest, acceptRequest } from '../data/social';
import { Page, Card, Btn, Avatar, SportChips, Empty, inputCls, sportOf, SportIcon } from '../components/ui';

export default function FindPlayers() {
  const players = useTable('players');
  const { statusOf, requestOf } = useSocial();
  const [sport, setSport] = useState('all');
  const [q, setQ] = useState('');

  const list = players.filter(
    (p) => (sport === 'all' || p.sport === sport) && p.name.toLowerCase().includes(q.toLowerCase()),
  );

  const friendBtn = (p) => {
    switch (statusOf(p.id)) {
      case 'friends': return <Btn to={`/chat/${p.id}`} variant="soft"><IoChatbubbleEllipsesOutline size={16} /> Message</Btn>;
      case 'sent': return <Btn variant="soft" disabled>Request sent</Btn>;
      case 'incoming': return <Btn onClick={() => acceptRequest(requestOf(p.id).id)}>Accept request</Btn>;
      default: return <Btn variant="soft" onClick={() => sendRequest(p.id)}>Add friend</Btn>;
    }
  };

  return (
    <Page
      title="Find players"
      subtitle="Invite people to play with you"
      actions={<div className="flex gap-2"><Btn to="/friends" variant="soft">Friends</Btn><Btn to="/players/new">Add player</Btn></div>}
    >
      <input className={`${inputCls} mb-3`} placeholder="Search by name" value={q} onChange={(e) => setQ(e.target.value)} />
      <SportChips value={sport} onChange={setSport} />
      {list.length === 0 ? (
        <Empty title="No players match" hint="Try a different sport or name." />
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {list.map((p) => (
            <Card key={p.id} className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <Avatar name={p.name} src={p.avatar} />
                <div className="min-w-0">
                  <h3 className="truncate font-bold">{p.name}</h3>
                  <p className="truncate text-sm text-[#565e74]"><SportIcon sport={p.sport} /> {sportOf(p.sport).label} · {p.level} · {p.area}</p>
                </div>
              </div>
              <div className="flex shrink-0 gap-2">
                {friendBtn(p)}
                <Btn variant={p.invited ? 'soft' : 'primary'} onClick={() => db.players.update(p.id, { invited: !p.invited })}>
                  {p.invited ? 'Invited' : 'Invite'}
                </Btn>
              </div>
            </Card>
          ))}
        </div>
      )}
    </Page>
  );
}
