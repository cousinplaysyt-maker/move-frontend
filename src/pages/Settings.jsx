import { useSettings, saveSettings, resetDb } from '../data/db';
import { Page, Card, Btn, Field, inputCls } from '../components/ui';

const CITIES = ['Cebu City', 'Mandaue', 'Lapu-Lapu', 'Talisay', 'Minglanilla'];

function Toggle({ label, hint, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 py-3">
      <span>
        <span className="block font-semibold">{label}</span>
        {hint && <span className="text-sm text-[#565e74]">{hint}</span>}
      </span>
      <input type="checkbox" role="switch" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-5 w-10 cursor-pointer accent-[#006948]" />
    </label>
  );
}

export default function Settings() {
  const s = useSettings();

  return (
    <Page title="Settings" subtitle="Changes save automatically">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <h2 className="mb-3 font-bold">Location and units</h2>
          <div className="grid gap-4">
            <Field label="City">
              <select className={inputCls} value={s.city} onChange={(e) => saveSettings({ city: e.target.value })}>
                {CITIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Distance">
              <select className={inputCls} value={s.unit} onChange={(e) => saveSettings({ unit: e.target.value })}>
                <option value="km">Kilometers</option>
                <option value="mi">Miles</option>
              </select>
            </Field>
          </div>
        </Card>

        <Card>
          <h2 className="mb-1 font-bold">Notifications</h2>
          <div className="divide-y divide-[#e5eeff]">
            <Toggle label="Booking reminders" hint="Before your court time" checked={s.notifyBookings} onChange={(v) => saveSettings({ notifyBookings: v })} />
            <Toggle label="Open play updates" hint="When a game you joined changes" checked={s.notifyGames} onChange={(v) => saveSettings({ notifyGames: v })} />
            <Toggle label="Tournament news" checked={s.notifyTourneys} onChange={(v) => saveSettings({ notifyTourneys: v })} />
          </div>
        </Card>

        <Card className="md:col-span-2">
          <h2 className="mb-1 font-bold">Your data</h2>
          <p className="mb-3 text-sm text-[#565e74]">Everything is stored in this browser. Resetting brings back the sample venues, games and tournaments and clears your bookings.</p>
          <div className="flex flex-wrap gap-2">
            <Btn to="/profile" variant="soft">Edit profile</Btn>
            <Btn variant="danger" onClick={() => { if (window.confirm('Reset all data?')) resetDb(); }}>Reset all data</Btn>
          </div>
        </Card>
      </div>
    </Page>
  );
}
