import { useState } from 'react';
import { useTable, useProfile, saveProfile, resetDb } from '../data/db';
import { SPORTS } from '../data/seed';
import { useNavigate } from 'react-router-dom';
import { logout } from '../data/auth';
import { Page, Card, Btn, Avatar, Field, Empty, inputCls, fmtDate, fmtTime, sportOf } from '../components/ui';

export default function Profile() {
  const profile = useProfile();
  const matches = useTable('matches');
  const venues = useTable('venues');
  const [form, setForm] = useState(profile);
  const [saved, setSaved] = useState(false);
  const navigate = useNavigate();

  // shrink the photo to 256x256 so it fits in browser storage
  const pickPhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const img = new Image();
    img.onload = () => {
      const size = 256, c = document.createElement('canvas');
      c.width = c.height = size;
      const side = Math.min(img.width, img.height);
      c.getContext('2d').drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, size, size);
      saveProfile({ avatar: c.toDataURL('image/jpeg', 0.85) });
      URL.revokeObjectURL(img.src);
    };
    img.src = URL.createObjectURL(file);
    e.target.value = '';
  };
  const set = (k) => (e) => { setForm({ ...form, [k]: e.target.value }); setSaved(false); };

  const myGames = matches.filter((m) => m.joined.includes(profile.name));
  const venueName = (id) => venues.find((v) => v.id === id)?.name ?? 'Venue';

  return (
    <Page
      title="Profile"
      back={false}
      actions={<div className="flex gap-2"><Btn to="/friends" variant="soft">Friends</Btn><Btn to="/settings" variant="soft">Settings</Btn></div>}
    >
      <p className="mb-3 text-sm font-semibold text-[#565e74]">{profile.isPrivate ? '🔒 Private profile' : '🌍 Public profile'} · change in Settings</p>
      <Card className="mb-4 flex items-center gap-4">
        <Avatar name={profile.name} src={profile.avatar} size={80} />
        <div className="min-w-0">
          <p className="truncate font-bold">{profile.name}</p>
          <p className="truncate text-sm text-[#565e74]">{profile.email}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <label className="inline-flex cursor-pointer items-center rounded-full bg-[#e5eeff] px-4 py-2 text-sm font-bold hover:bg-[#d3e4fe]">
              {profile.avatar ? 'Change photo' : 'Add photo'}
              <input type="file" accept="image/*" className="hidden" onChange={pickPhoto} />
            </label>
            {profile.avatar && <Btn variant="soft" onClick={() => saveProfile({ avatar: null })}>Remove</Btn>}
          </div>
        </div>
      </Card>
      <Card>
        <form
          className="grid gap-4 md:grid-cols-2"
          onSubmit={(e) => { e.preventDefault(); saveProfile({ name: form.name.trim() || 'Player One', area: form.area, sport: form.sport, level: form.level }); setSaved(true); }}
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

      <div className="mt-8 flex flex-wrap gap-2">
        <Btn variant="danger" onClick={() => { logout(); navigate('/login'); }}>Log out</Btn>
        <Btn variant="soft" onClick={() => { if (window.confirm('Reset all demo data? Your joined games and added data will be cleared.')) { resetDb(); setForm(profile); } }}>
          Reset demo data
        </Btn>
      </div>
    </Page>
  );
}
