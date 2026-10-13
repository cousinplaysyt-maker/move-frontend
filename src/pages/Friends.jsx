import { useTable } from '../data/db';
import { useSocial, acceptRequest, removeRequest } from '../data/social';
import { Page, Card, Btn, Avatar, Empty, fmtDate, fmtTime, sportOf, isIn } from '../components/ui';

export default function Friends() {
  const players = useTable('players');
  const matches = useTable('matches');
  const { friends, incoming, outgoing } = useSocial();
  const who = (r) => players.find((p) => p.id === r.playerId);
  const sub = (p) => `${sportOf(p.sport).emoji} ${sportOf(p.sport).label} · ${p.level} · ${p.area}`;

  const section = (title, rows) =>
    rows.length > 0 && <h2 className="mb-2 mt-6 font-bold first:mt-0">{title} ({rows.length})</h2>;

  return (
    <Page title="Friends" subtitle="Requests and the games your friends are joining" actions={<Btn to="/players">Find players</Btn>}>
      {section('Friend requests', incoming)}
      <div className="grid gap-3 md:grid-cols-2">
        {incoming.map((r) => { const p = who(r); return p && (
          <Card key={r.id} className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3"><Avatar name={p.name} src={p.avatar} /><div className="min-w-0"><h3 className="truncate font-bold">{p.name}</h3><p className="truncate text-sm text-[#565e74]">{sub(p)}</p></div></div>
            <div className="flex shrink-0 gap-2"><Btn onClick={() => acceptRequest(r.id)}>Accept</Btn><Btn variant="danger" onClick={() => removeRequest(r.id)}>Decline</Btn></div>
          </Card>
        ); })}
      </div>

      {section('Requests you sent', outgoing)}
      <div className="grid gap-3 md:grid-cols-2">
        {outgoing.map((r) => { const p = who(r); return p && (
          <Card key={r.id} className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3"><Avatar name={p.name} src={p.avatar} /><div className="min-w-0"><h3 className="truncate font-bold">{p.name}</h3><p className="text-sm font-semibold text-[#006948]">Request sent · waiting for them</p></div></div>
            <div className="flex shrink-0 gap-2">
              {/* demo only: there is no second account yet, so this plays the other person */}
              <Btn variant="soft" title="Demo: pretend they accepted" onClick={() => acceptRequest(r.id)}>Demo: they accept</Btn>
              <Btn variant="danger" onClick={() => removeRequest(r.id)}>Cancel</Btn>
            </div>
          </Card>
        ); })}
      </div>

      <h2 className="mb-2 mt-6 font-bold">My friends ({friends.length})</h2>
      {friends.length === 0 ? (
        <Empty title="No friends yet" hint="Send a request from Find players. They show up here once accepted." action={<Btn to="/players">Find players</Btn>} />
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {friends.map((r) => {
            const f = who(r);
            if (!f) return null;
            const games = matches.filter((m) => isIn(m.joined, f));
            return (
              <Card key={r.id}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3"><Avatar name={f.name} src={f.avatar} /><div className="min-w-0"><h3 className="truncate font-bold">{f.name}</h3><p className="truncate text-sm text-[#565e74]">{sub(f)}</p></div></div>
                  <Btn variant="danger" onClick={() => removeRequest(r.id)}>Remove</Btn>
                </div>
                {games.length > 0 && (
                  <ul className="mt-3 space-y-1 text-sm">
                    {games.map((m) => (
                      <li key={m.id} className="rounded-xl bg-[#85f8c4]/50 px-3 py-2 font-semibold text-[#002114]">
                        Joining: {m.title} · {fmtDate(m.date)}, {fmtTime(m.time)}
                      </li>
                    ))}
                  </ul>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </Page>
  );
}
