import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { db, useTable, useProfile } from '../data/db';
import { Page, Card, Btn, Field, inputCls, peso, fmtDate, fmtTime } from '../components/ui';

const HOURS = Array.from({ length: 16 }, (_, i) => `${String(i + 6).padStart(2, '0')}:00`); // 6 AM to 9 PM
const today = () => new Date().toISOString().slice(0, 10);
const startHour = (t) => parseInt(t, 10);

export default function BookCourt() {
  const { venueId } = useParams();
  const navigate = useNavigate();
  const venues = useTable('venues');
  const bookings = useTable('bookings');
  const me = useProfile().name;

  const [pickedVenue, setPickedVenue] = useState(venueId ?? '');
  const [court, setCourt] = useState(1);
  const [date, setDate] = useState(today());
  const [time, setTime] = useState('17:00');
  const [hours, setHours] = useState(1);
  const [error, setError] = useState('');

  const venue = venues.find((v) => v.id === (pickedVenue || venueId)) ?? venues[0];
  if (!venue) return <Page title="Book a court"><p>Loading…</p></Page>;

  const total = venue.price * hours;

  const clash = (b) =>
    b.venueId === venue.id && b.court === court && b.date === date && b.status === 'confirmed' &&
    startHour(time) < startHour(b.time) + b.hours && startHour(b.time) < startHour(time) + hours;

  const confirm = () => {
    if (bookings.some(clash)) {
      setError(`Court ${court} is already booked at that time. Pick another court or time.`);
      return;
    }
    db.bookings.insert({ venueId: venue.id, court, date, time, hours, total, status: 'confirmed', player: me });
    navigate('/profile');
  };

  return (
    <Page title="Book a court" subtitle={venue.name}>
      <Card>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Venue">
            <select className={inputCls} value={venue.id} onChange={(e) => { setPickedVenue(e.target.value); setCourt(1); setError(''); }}>
              {venues.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
            </select>
          </Field>
          <Field label="Court">
            <select className={inputCls} value={court} onChange={(e) => { setCourt(Number(e.target.value)); setError(''); }}>
              {Array.from({ length: venue.courts }, (_, i) => <option key={i + 1} value={i + 1}>Court {i + 1}</option>)}
            </select>
          </Field>
          <Field label="Date"><input type="date" min={today()} className={inputCls} value={date} onChange={(e) => { setDate(e.target.value); setError(''); }} /></Field>
          <Field label="Start time">
            <select className={inputCls} value={time} onChange={(e) => { setTime(e.target.value); setError(''); }}>
              {HOURS.map((h) => <option key={h} value={h}>{fmtTime(h)}</option>)}
            </select>
          </Field>
          <Field label="Hours">
            <select className={inputCls} value={hours} onChange={(e) => { setHours(Number(e.target.value)); setError(''); }}>
              {[1, 2, 3, 4].map((h) => <option key={h} value={h}>{h} hour{h > 1 ? 's' : ''}</option>)}
            </select>
          </Field>
        </div>

        <div className="mt-5 flex items-center justify-between rounded-xl bg-[#eff4ff] p-3">
          <div className="text-sm">
            <p className="font-bold">{fmtDate(date)}, {fmtTime(time)} · {hours}h</p>
            <p className="text-[#565e74]">Court {court} at {peso(venue.price)} per hour</p>
          </div>
          <p className="text-xl font-extrabold text-[#006948]">{peso(total)}</p>
        </div>

        {error && <p role="alert" className="mt-3 text-sm font-semibold text-[#ba1a1a]">{error}</p>}
        <div className="mt-4"><Btn onClick={confirm}>Confirm booking</Btn></div>
      </Card>
    </Page>
  );
}
