import { useState } from 'react';
import { IoFlame, IoTrashOutline } from 'react-icons/io5';
import { useProfile } from '../data/db';
import { SPORTS } from '../data/seed';
import { usePlays, streakOf, logPlay, deletePlay, todayISO, weekStart, useLeaderboard, fmtWeek } from '../data/plays';
import { Page, Card, Btn, Avatar, Field, Empty, inputCls, fmtDate, sportOf, SportIcon } from '../components/ui';

const MEDAL = { 1: 'bg-[#f5c542] text-[#4a3500]', 2: 'bg-[#cfd6dd] text-[#2b333b]', 3: 'bg-[#e0a070] text-[#4a2400]' };

function Seg({ value, onChange, items }) {
  return (
    <div className="inline-flex rounded-full bg-[#e5eeff] p-1">
      {items.map(([v, label]) => (
        <button key={v} onClick={() => onChange(v)} className={`rounded-full px-4 py-1.5 text-sm font-bold transition ${value === v ? 'bg-white text-[#006948] shadow-sm' : 'text-[#3d4a42]'}`}>{label}</button>
      ))}
    </div>
  );
}

export default function Leaderboard() {
  const profile = useProfile();
  const plays = usePlays();
  const { current, best, playedThisWeek } = streakOf(plays);
  const thisWeek = plays.filter((p) => weekStart(p.date) === weekStart()).length;

  const [weekOffset, setWeekOffset] = useState(0);
  const [scope, setScope] = useState('everyone');
  const { rows, ws, me } = useLeaderboard({ weekOffset, scope });
  const above = [...rows].reverse().find((r) => r.rank < me.rank);

  const [form, setForm] = useState({ sport: profile.sport ?? 'pickleball', date: todayISO() });
  const [msg, setMsg] = useState('');
  const submit = (e) => { e.preventDefault(); const res = logPlay(form); setMsg(res.ok ? 'Game logged.' : res.error); };

  return (
    <Page title="Leaderboard" subtitle="Weekly rankings by games played">
      <Card className="mb-4 flex flex-wrap items-center gap-5 bg-gradient-to-br from-[#fff4e0] to-white">
        <div className="flex items-center gap-3">
          <span className={`flex h-16 w-16 items-center justify-center rounded-2xl ${current ? 'bg-[#ffb95f] text-[#2a1700]' : 'bg-[#e5eeff] text-[#6d7a72]'}`}><IoFlame size={34} /></span>
          <div>
            <p className="text-3xl font-extrabold leading-none">{current} <span className="text-base font-bold">week{current === 1 ? '' : 's'}</span></p>
            <p className="text-sm font-semibold text-[#565e74]">Current streak</p>
          </div>
        </div>
        <div className="grid flex-1 grid-cols-3 gap-3 text-center sm:max-w-sm">
          <div><p className="text-xl font-extrabold">{thisWeek}</p><p className="text-xs font-semibold text-[#565e74]">This week</p></div>
          <div><p className="text-xl font-extrabold">{best}</p><p className="text-xs font-semibold text-[#565e74]">Best streak</p></div>
          <div><p className="text-xl font-extrabold">{plays.length}</p><p className="text-xs font-semibold text-[#565e74]">All time</p></div>
        </div>
        <p className="w-full text-sm text-[#3d4a42]">
          {playedThisWeek ? 'Nice, this week counts toward your streak.' : current > 0 ? 'Play a game before Sunday to keep your streak alive.' : 'Log a game to start a streak. Streaks count weeks in a row with at least one game.'}
        </p>
      </Card>

      <Card className="mb-6">
        <form onSubmit={submit} className="grid items-end gap-3 sm:grid-cols-[1fr_1fr_auto]">
          <Field label="Sport">
            <select className={inputCls} value={form.sport} onChange={(e) => setForm({ ...form, sport: e.target.value })}>
              {SPORTS.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
            </select>
          </Field>
          <Field label="Date played"><input type="date" max={todayISO()} required className={inputCls} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></Field>
          <Btn type="submit">Log a game</Btn>
        </form>
        <p className="mt-2 text-xs text-[#565e74]">{msg || 'Games you joined in Open play can also be checked in from that page.'}</p>
      </Card>

      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <Seg value={weekOffset} onChange={setWeekOffset} items={[[0, 'This week'], [-1, 'Last week']]} />
        <Seg value={scope} onChange={setScope} items={[['everyone', 'Everyone'], ['friends', 'Friends']]} />
      </div>
      <p className="mb-2 text-sm font-semibold text-[#565e74]">{fmtWeek(ws)}{me.games > 0 || weekOffset ? ` · You are #${me.rank}` : ''}{above && weekOffset === 0 ? ` · ${above.games - me.games + 1} more game${above.games - me.games + 1 > 1 ? 's' : ''} to pass ${above.name.split(' ')[0]}` : ''}</p>

      <Card className="divide-y divide-[#e5eeff] p-0">
        {rows.map((r) => (
          <div key={r.id} className={`flex items-center gap-3 px-4 py-3 ${r.isMe ? 'bg-[#85f8c4]/30' : ''}`}>
            <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-extrabold ${MEDAL[r.rank] ?? 'bg-[#eff4ff] text-[#3d4a42]'}`}>{r.rank}</span>
            <Avatar name={r.name} src={r.avatar} size={38} />
            <p className="min-w-0 flex-1 truncate font-bold">{r.name}{r.isMe && <span className="ml-1.5 rounded-full bg-[#006948] px-2 py-0.5 text-[10px] font-bold text-white">You</span>}</p>
            <p className="shrink-0 font-extrabold">{r.games} <span className="text-xs font-semibold text-[#565e74]">game{r.games === 1 ? '' : 's'}</span></p>
          </div>
        ))}
      </Card>
      <p className="mt-2 text-xs text-[#565e74]">Demo mode: the other players' game counts are simulated until real accounts exist. Yours are real.</p>

      <h2 className="mb-2 mt-8 font-bold">Your recent games</h2>
      {plays.length === 0 ? <Empty title="No games logged yet" /> : (
        <div className="grid gap-2 md:grid-cols-2">
          {plays.slice(0, 8).map((p) => (
            <Card key={p.id} className="flex items-center justify-between gap-3 py-3">
              <p className="flex items-center gap-2 font-semibold"><SportIcon sport={p.sport} size={18} /> {sportOf(p.sport).label} <span className="font-normal text-[#565e74]">· {fmtDate(p.date)}</span></p>
              <button aria-label="Delete game" onClick={() => deletePlay(p.id)} className="rounded-full p-2 text-[#93000a] hover:bg-[#ffdad6]"><IoTrashOutline size={18} /></button>
            </Card>
          ))}
        </div>
      )}
    </Page>
  );
}
