import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, useTable, useProfile } from '../data/db';
import { SPORTS } from '../data/seed';
import { Page, Card, Btn, Field, inputCls } from '../components/ui';

const today = () => new Date().toISOString().slice(0, 10);

export default function HostPlay() {
  const navigate = useNavigate();
  const venues = useTable('venues');
  const me = useProfile().name;
  const [form, setForm] = useState({ title: '', sport: 'pickleball', venueId: '', date: today(), time: '17:00', level: 'Any', spots: 8 });
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    db.matches.insert({
      ...form,
      venueId: form.venueId || venues[0]?.id,
      spots: Number(form.spots),
      joined: [me],
      host: me,
    });
    navigate('/open-play');
  };

  return (
    <Page title="Host play" subtitle="Set up an open game for other players">
      <Card>
        <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <Field label="Game title">
              <input required className={inputCls} value={form.title} onChange={set('title')} placeholder="Saturday morning doubles" />
            </Field>
          </div>
          <Field label="Sport">
            <select className={inputCls} value={form.sport} onChange={set('sport')}>
              {SPORTS.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
            </select>
          </Field>
          <Field label="Venue">
            <select className={inputCls} value={form.venueId || venues[0]?.id || ''} onChange={set('venueId')}>
              {venues.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
            </select>
          </Field>
          <Field label="Date"><input type="date" min={today()} required className={inputCls} value={form.date} onChange={set('date')} /></Field>
          <Field label="Start time"><input type="time" required className={inputCls} value={form.time} onChange={set('time')} /></Field>
          <Field label="Skill level">
            <select className={inputCls} value={form.level} onChange={set('level')}>
              {['Any', 'Beginner', 'Intermediate', 'Advanced'].map((l) => <option key={l}>{l}</option>)}
            </select>
          </Field>
          <Field label="Players needed">
            <input type="number" min="2" max="30" className={inputCls} value={form.spots} onChange={set('spots')} />
          </Field>
          <div className="md:col-span-2"><Btn type="submit">Post game</Btn></div>
        </form>
      </Card>
    </Page>
  );
}
