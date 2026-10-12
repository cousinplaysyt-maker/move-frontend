import { useState } from 'react';
import { useTable } from '../data/db';
import { Page, SportChips, VenueCard, Empty } from '../components/ui';

export default function MapView() {
  const venues = useTable('venues');
  const [sport, setSport] = useState('all');
  const [selectedId, setSelectedId] = useState(null);

  const list = venues.filter((v) => sport === 'all' || v.sports.includes(sport));
  const selected = list.find((v) => v.id === selectedId) ?? list[0];

  const mapSrc = selected
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${selected.lng - 0.02}%2C${selected.lat - 0.012}%2C${selected.lng + 0.02}%2C${selected.lat + 0.012}&layer=mapnik&marker=${selected.lat}%2C${selected.lng}`
    : null;

  return (
    <Page title="Map view" subtitle="Tap a venue to see it on the map" back={false}>
      <SportChips value={sport} onChange={setSport} />
      {!selected ? (
        <Empty title="No venues for this sport yet" hint="Try another sport." />
      ) : (
        <div className="grid gap-4 md:grid-cols-5">
          <iframe title="Venue map" src={mapSrc} className="h-72 w-full rounded-2xl border-0 shadow-sm md:col-span-3 md:h-[480px]" />
          <div className="flex flex-col gap-3 md:col-span-2">
            {list.map((v) => (
              <VenueCard key={v.id} venue={v} selected={v.id === selected.id} onSelect={() => setSelectedId(v.id)} />
            ))}
          </div>
        </div>
      )}
    </Page>
  );
}
