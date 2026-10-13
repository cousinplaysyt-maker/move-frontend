import { useParams } from 'react-router-dom';
import { useTable } from '../data/db';
import { useNearby } from '../data/geo';
import { Page, Card, Btn, Empty, peso, fmtDist, fmtDate, fmtTime, sportOf } from '../components/ui';

export default function VenueDetails() {
  const { id } = useParams();
  const venues = useTable('venues');
  const matches = useTable('matches');
  const { list: nearby } = useNearby({ withinRadius: false });
  const venue = nearby.find((v) => v.id === id) ?? venues.find((v) => v.id === id);

  if (!venue) {
    return (
      <Page title="Venue not found">
        <Empty title="We couldn't find that venue" action={<Btn to="/map">Browse venues</Btn>} />
      </Page>
    );
  }

  const upcoming = matches.filter((m) => m.venueId === venue.id);

  return (
    <Page title={venue.name} subtitle={venue.area}>
      <Card>
        <div className="flex items-start justify-between">
          <p>{venue.sports.map((s) => `${sportOf(s).emoji} ${sportOf(s).label}`).join(' · ')}</p>
          <p className="text-2xl font-extrabold text-[#006948]">{peso(venue.price)}<span className="text-xs font-semibold text-[#565e74]"> / court / hr</span></p>
        </div>
        <p className="mt-2 text-sm text-[#565e74]">{venue.courts} courts · {fmtDist(venue.distanceKm)} from you</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {venue.amenities.map((a) => <span key={a} className="rounded-full bg-[#dce9ff] px-3 py-1 text-xs font-semibold">{a}</span>)}
        </div>
        <div className="mt-4"><Btn to={`/book/${venue.id}`}>Book court</Btn></div>
      </Card>

      <h2 className="mb-2 mt-6 font-bold">Open play here</h2>
      {upcoming.length === 0 ? (
        <Empty title="No games scheduled" action={<Btn to="/host">Host play</Btn>} />
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {upcoming.map((m) => (
            <Card key={m.id}>
              <h3 className="font-bold">{m.title}</h3>
              <p className="text-sm text-[#565e74]">{fmtDate(m.date)}, {fmtTime(m.time)} · {m.level}</p>
            </Card>
          ))}
        </div>
      )}
    </Page>
  );
}
