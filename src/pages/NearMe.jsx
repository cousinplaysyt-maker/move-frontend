import { useState } from 'react';
import { useNearby } from '../data/geo';
import { Page, SportChips, VenueCard, Empty } from '../components/ui';
import RadiusBar from '../components/RadiusBar';

export default function NearMe() {
  const [sport, setSport] = useState('all');
  const { list, total, usingGps, city } = useNearby({ sport });

  return (
    <Page title="Near me" subtitle="Courts inside your radius, closest first" back={false}>
      <RadiusBar usingGps={usingGps} city={city} />
      <SportChips value={sport} onChange={setSport} />
      {list.length === 0 ? (
        <Empty title="No courts inside this radius" hint={total ? 'Slide the radius bigger or try another sport.' : 'No courts for this sport yet.'} />
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {list.map((v) => <VenueCard key={v.id} venue={v} />)}
        </div>
      )}
    </Page>
  );
}
