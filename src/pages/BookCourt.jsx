import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTable } from '../data/db';
import { Page, Card, Btn, Field, Empty, inputCls, peso } from '../components/ui';

export default function BookCourt() {
  const { venueId } = useParams();
  const venues = useTable('venues');
  const [picked, setPicked] = useState(venueId ?? '');

  const venue = venues.find((v) => v.id === (picked || venueId)) ?? venues[0];
  if (!venue) return <Page title="Book a court"><Empty title="No venues yet" action={<Btn to="/courts/new">Add court</Btn>} /></Page>;

  return (
    <Page title="Book a court" subtitle="Booking is done on the venue's own page">
      <Card>
        <Field label="Venue">
          <select className={inputCls} value={venue.id} onChange={(e) => setPicked(e.target.value)}>
            {venues.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
          </select>
        </Field>

        <div className="mt-4 rounded-xl bg-[#eff4ff] p-3">
          <p className="font-bold">{venue.name}</p>
          <p className="text-sm text-[#565e74]">{venue.area} · {peso(venue.price)} per court / hr</p>
          {venue.bookingUrl && <p className="mt-2 break-all text-sm text-[#006948]">{venue.bookingUrl}</p>}
        </div>

        <div className="mt-4">
          {venue.bookingUrl ? (
            <a
              href={venue.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-[#006948] px-5 py-2.5 text-sm font-bold text-white shadow-[0_4px_14px_rgba(0,105,72,0.3)] transition hover:bg-[#00855d] active:scale-95"
            >
              Book now
            </a>
          ) : (
            <p className="text-sm font-semibold text-[#565e74]">This venue has no booking link yet.</p>
          )}
        </div>
      </Card>
    </Page>
  );
}
