import { useState } from 'react';
import { db, useTable, useProfile, saveProfile, resetDb } from '../data/db';
import { SPORTS } from '../data/seed';
import { Page, Card, Btn, Field, Empty, inputCls, peso, fmtDate, fmtTime, sportOf } from '../components/ui';

export default function Profile() {
  const profile = useProfile();
  const bookings = useTable('bookings');
  const matches = useTable('matches');
  const venues = useTable('venues');
  const [form, setForm] = useState(profile);
  const [saved, setSaved] = useState(false);
  const set = (k) => (e) => { setForm({ ...form, [k]: e.target.value }); setSaved(false); };

  const mine = bookings.filter((b) => b.status === 'confirmed').sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));
  const myGames = matches.filter((m) => m.joined.includes(profile.name));
  const venueName = (id) => venues.find((v) => v.id === id)?.name ?? 'Venue';

  return (
    <Page title="Profile" back={false}>
      <Card>
        <form
          className="grid gap-4 md:grid-cols-2"
          onSubmit={(e) => { e.preventDefault(); saveProfile({ ...form, name: form.name.trim() || 'Player One' }); setSaved(true); }}
        >
          <Field label="Display name"><input className={inputCls} value={form.name} onChange={set('name')} /></Field>
          <Field label="Home area"><input className={inputCls} value={form.area} onChange={set('area')} /></Field>
          <Field label="Main sport">
            <select className={inputCls} value={form.sport} onChange={set('sport')}>
              {SPORTS.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
            </select>
          </Field>
          <Field label="Skill level">
            <select className={inputCls} value={form.level} onChange={set('level')}>
              {['Beginner', 'Intermediate', 'Advanced'].map((l) => <option key={l}>{l}</option>)}
            </select>
          </Field>
          <div className="flex items-center gap-3 md:col-span-2">
            <Btn type="submit">Save profile</Btn>
            {saved && <span className="text-sm font-semibold text-[#006948]">Saved</span>}
          </div>
        </form>
      </Card>

      <h2 className="mb-2 mt-6 font-bold">My bookings</h2>
      {mine.length === 0 ? (
        <Empty title="No bookings yet" hint="Book a court and it will show up here." action={<Btn to="/book">Book a court</Btn>} />
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {mine.map((b) => (
            <Card key={b.id}>
              <h3 className="font-bold">{venueName(b.venueId)}</h3>
              <p className="text-sm text-[#565e74]">Court {b.court} · {fmtDate(b.date)}, {fmtTime(b.time)} · {b.hours}h</p>
              <div className="mt-2 flex items-center justify-between">
                <span className="font-extrabold text-[#006948]">{peso(b.total)}</span>
                <Btn variant="danger" onClick={() => db.bookings.update(b.id, { status: 'cancelled' })}>Cancel</Btn>
              </div>
            </Card>
          ))}
        </div>
      )}

      <h2 className="mb-2 mt-6 font-bold">Games I joined</h2>
      {myGames.length === 0 ? (
        <Empty title="You haven't joined a game" action={<Btn to="/open-play">Find open play</Btn>} />
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {myGames.map((m) => (
            <Card key={m.id}>
              <h3 className="font-bold">{sportOf(m.sport).emoji} {m.title}</h3>
              <p className="text-sm text-[#565e74]">{fmtDate(m.date)}, {fmtTime(m.time)} · {venueName(m.venueId)}</p>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-8">
        <Btn variant="soft" onClick={() => { if (window.confirm('Reset all demo data? Your bookings and joined games will be cleared.')) { resetDb(); setForm(profile); } }}>
          Reset demo data
        </Btn>
      </div>
    </Page>
  );
}
