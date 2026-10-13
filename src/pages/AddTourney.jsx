import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, useTable } from '../data/db';
import { SPORTS } from '../data/seed';
import { Page, Card, Btn, Field, Empty, inputCls } from '../components/ui';

const today = () => new Date().toISOString().slice(0, 10);

export default function AddTourney() {
  const navigate = useNavigate();
  const venues = useTable('venues');
  const [form, setForm] = useState({ name: '', sport: 'pickleball', venueId: '', date: today(), fee: 500, slots: 16 });
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  if (!venues.length) return <Page title="Add tournament"><Empty title="Add a court first" action={<Btn to="/courts/new">Add court</Btn>} /></Page>;

  const submit = (e) => {
    e.preventDefault();
    db.tournaments.insert({
      ...form,
      name: form.name.trim(),
      venueId: form.venueId || venues[0].id,
      fee: Number(form.fee),
      slots: Number(form.slots),
      registered: [],
    });
    navigate('/tourneys');
  };

  return (
    <Page title="Add tournament" subtitle="Set up a tournament for players to register">
      <Card>
        <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <Field label="Tournament name"><input required className={inputCls} value={form.name} onChange={set('name')} /></Field>
          </div>
          <Field label="Sport">
            <select className={inputCls} value={form.sport} onChange={set('sport')}>
              {SPORTS.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
            </select>
          </Field>
          <Field label="Venue">
            <select className={inputCls} value={form.venueId || venues[0].id} onChange={set('venueId')}>
              {venues.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
            </select>
          </Field>
          <Field label="Date"><input type="date" min={today()} required className={inputCls} value={form.date} onChange={set('date')} /></Field>
          <Field label="Entry fee (₱)"><input type="number" min="0" required className={inputCls} value={form.fee} onChange={set('fee')} /></Field>
          <Field label="Slots"><input type="number" min="2" required className={inputCls} value={form.slots} onChange={set('slots')} /></Field>
          <div className="md:col-span-2"><Btn type="submit">Add tournament</Btn></div>
        </form>
      </Card>
    </Page>
  );
}
