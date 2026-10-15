import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, getSession } from '../data/db';
import { checkCourtAchievements } from '../data/achievements';
import { SPORTS } from '../data/seed';
import { SURFACES } from '../data/reviews';
import { Page, Card, Btn, Field, inputCls, SportIcon } from '../components/ui';

export default function AddCourt() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', area: '', price: 300, courts: 2, amenities: '', bookingUrl: '', surface: '', lat: 10.3157, lng: 123.8854 });
  const [sports, setSports] = useState(['pickleball']);
  const [geoError, setGeoError] = useState('');
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const toggle = (key) => setSports((s) => (s.includes(key) ? s.filter((x) => x !== key) : [...s, key]));

  const useMyLocation = () => {
    setGeoError('');
    if (!navigator.geolocation) return setGeoError('Your browser does not support location.');
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => setForm((f) => ({ ...f, lat: coords.latitude, lng: coords.longitude })),
      () => setGeoError('Location is blocked. Allow it in your browser settings.'),
    );
  };

  const submit = (e) => {
    e.preventDefault();
    db.venues.insert({
      name: form.name.trim(),
      area: form.area.trim(),
      sports,
      price: Number(form.price),
      courts: Number(form.courts),
      distanceKm: 5,
      amenities: form.amenities.split(',').map((a) => a.trim()).filter(Boolean),
      bookingUrl: form.bookingUrl.trim(),
      surface: form.surface || null,
      lat: Number(form.lat),
      lng: Number(form.lng),
      addedBy: getSession(),
    });
    checkCourtAchievements();
    navigate('/map');
  };

  return (
    <Page title="Add court" subtitle="List a court so players can find it">
      <Card>
        <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
          <Field label="Court / club name"><input required className={inputCls} value={form.name} onChange={set('name')} /></Field>
          <Field label="Area"><input required className={inputCls} value={form.area} onChange={set('area')} placeholder="Ward 2, Minglanilla" /></Field>
          <div className="md:col-span-2">
            <span className="mb-1 block text-xs font-bold text-[#3d4a42]">Sports</span>
            <div className="flex flex-wrap gap-2">
              {SPORTS.map((s) => (
                <button
                  type="button"
                  key={s.key}
                  onClick={() => toggle(s.key)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold ${sports.includes(s.key) ? 'bg-[#006948] text-white' : 'bg-[#e5eeff]'}`}
                >
                  <SportIcon sport={s.key} /> {s.label}
                </button>
              ))}
            </div>
          </div>
          <Field label="Price per court / hr (₱)"><input type="number" min="0" required className={inputCls} value={form.price} onChange={set('price')} /></Field>
          <Field label="Number of courts"><input type="number" min="1" required className={inputCls} value={form.courts} onChange={set('courts')} /></Field>
          <Field label="Court surface (optional)">
            <select className={inputCls} value={form.surface} onChange={set('surface')}>
              <option value="">Not sure</option>
              {SURFACES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </Field>
          <div className="md:col-span-2">
            <Field label="Booking link"><input type="url" required className={inputCls} value={form.bookingUrl} onChange={set('bookingUrl')} placeholder="https://..." /></Field>
          </div>
          <div className="md:col-span-2">
            <Field label="Amenities (comma separated)"><input className={inputCls} value={form.amenities} onChange={set('amenities')} placeholder="Lighting, Parking" /></Field>
          </div>
          <Field label="Latitude"><input type="number" step="any" required className={inputCls} value={form.lat} onChange={set('lat')} /></Field>
          <Field label="Longitude"><input type="number" step="any" required className={inputCls} value={form.lng} onChange={set('lng')} /></Field>
          <div className="flex flex-wrap items-center gap-3 md:col-span-2">
            <Btn type="button" variant="soft" onClick={useMyLocation}>Use my location for the pin</Btn>
            {geoError && <span role="alert" className="text-sm font-semibold text-[#ba1a1a]">{geoError}</span>}
          </div>
          <div className="md:col-span-2"><Btn type="submit" disabled={!sports.length}>Add court</Btn></div>
        </form>
      </Card>
    </Page>
  );
}
