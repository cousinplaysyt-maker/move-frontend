import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../data/db';
import { SPORTS } from '../data/seed';
import { checkPlayerAchievement } from '../data/achievements';
import { Page, Card, Btn, Field, inputCls } from '../components/ui';

export default function AddPlayer() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', sport: 'pickleball', level: 'Beginner', area: '' });
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    db.players.insert({ ...form, name: form.name.trim(), area: form.area.trim(), invited: false });
    checkPlayerAchievement();
    navigate('/players');
  };

  return (
    <Page title="Add player" subtitle="Add someone you play with">
      <Card>
        <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
          <Field label="Name"><input required className={inputCls} value={form.name} onChange={set('name')} /></Field>
          <Field label="Area"><input className={inputCls} value={form.area} onChange={set('area')} /></Field>
          <Field label="Main sport">
            <select className={inputCls} value={form.sport} onChange={set('sport')}>
              {SPORTS.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
            </select>
          </Field>
          <Field label="Skill level">
            <select className={inputCls} value={form.level} onChange={set('level')}>
              {['Any', 'Beginner', 'Intermediate', 'Advanced'].map((l) => <option key={l}>{l}</option>)}
            </select>
          </Field>
          <div className="md:col-span-2"><Btn type="submit">Add player</Btn></div>
        </form>
      </Card>
    </Page>
  );
}
