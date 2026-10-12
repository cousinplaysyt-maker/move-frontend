import { useState } from 'react';
import { useTable } from '../data/db';
import { Page, SportChips, VenueCard, Empty } from '../components/ui';

export default function NearMe() {
  const venues = useTable('venues');
  const [sport, setSport] = useState('all');
  const list = venues
    .filter((v) => sport === 'all' || v.sports.includes(sport))
    .sort((a, b) => a.distanceKm - b.distanceKm);

  return (
    <Page title="Near me" subtitle="Closest courts first" back={false}>
      <SportChips value={sport} onChange={setSport} />
      {list.length === 0 ? (
        <Empty title="Nothing nearby for this sport" hint="Try another sport." />
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {list.map((v) => <VenueCard key={v.id} venue={v} />)}
        </div>
      )}
    </Page>
  );
}
