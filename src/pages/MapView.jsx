import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useNearby } from '../data/geo';
import RadiusBar from '../components/RadiusBar';
import { Page, Btn, SportChips, VenueCard, Empty, inputCls, peso } from '../components/ui';

const esc = (s) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

const pin = (venue, active) =>
  L.divIcon({
    className: '',
    iconSize: [0, 0],
    html: `<div style="transform:translate(-50%,-100%);white-space:nowrap;font:700 12px system-ui;padding:6px 10px;border-radius:999px;box-shadow:0 2px 8px rgba(0,0,0,.25);cursor:pointer;
      background:${active ? '#006948' : '#fff'};color:${active ? '#fff' : '#0b1c30'}">
      ${esc(venue.name.split(' ').slice(0, 2).join(' '))} · ${peso(venue.price)}</div>`,
  });

export default function MapView() {
  const [params, setParams] = useSearchParams();
  const [sport, setSport] = useState('all');
  const [selectedId, setSelectedId] = useState(null);
  const q = params.get('q') ?? '';

  const mapEl = useRef(null);
  const map = useRef(null);
  const markers = useRef(null);
  const me = useRef(null);

  const { list: inRadius, total, origin, radiusKm, usingGps, city } = useNearby({ sport });
  const list = inRadius.filter((v) => `${v.name} ${v.area}`.toLowerCase().includes(q.toLowerCase()));
  const selected = list.find((v) => v.id === selectedId) ?? list[0];
  const listKey = list.map((v) => v.id).join();

  // create the map once
  useEffect(() => {
    map.current = L.map(mapEl.current, { zoomControl: true }).setView([10.3157, 123.8854], 11);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map.current);
    markers.current = L.layerGroup().addTo(map.current);
    setTimeout(() => map.current?.invalidateSize(), 0);
    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // redraw pins when the list or selection changes
  useEffect(() => {
    if (!map.current) return;
    markers.current.clearLayers();
    list.forEach((v) => {
      L.marker([v.lat, v.lng], { icon: pin(v, v.id === selected?.id), zIndexOffset: v.id === selected?.id ? 1000 : 0 })
        .on('click', () => setSelectedId(v.id))
        .addTo(markers.current);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listKey, selected?.id]);

  // draw "me" and the radius circle, then frame the circle
  useEffect(() => {
    if (!map.current) return;
    me.current?.remove();
    const pos = [origin.lat, origin.lng];
    me.current = L.layerGroup([
      L.circle(pos, { radius: radiusKm * 1000, color: '#006948', weight: 2, fillColor: '#85f8c4', fillOpacity: 0.12, interactive: false }),
      L.circleMarker(pos, { radius: 8, color: '#fff', weight: 3, fillColor: '#006948', fillOpacity: 1, interactive: false }),
    ]).addTo(map.current);
    map.current.fitBounds(L.latLng(pos).toBounds(radiusKm * 2000), { padding: [20, 20] });
  }, [origin.lat, origin.lng, radiusKm]);

  const choose = (id) => {
    setSelectedId(id);
    const v = list.find((x) => x.id === id);
    if (v && map.current) map.current.flyTo([v.lat, v.lng], 14);
  };

  return (
    <Page title="Map view" subtitle="Pins show courts inside your radius" back={false} actions={<Btn to="/courts/new">Add court</Btn>}>
      <input
        className={`${inputCls} mb-3`}
        placeholder="Search courts or areas"
        value={q}
        onChange={(e) => setParams(e.target.value ? { q: e.target.value } : {})}
      />
      <RadiusBar usingGps={usingGps} city={city} />
      <SportChips value={sport} onChange={setSport} />

      <div className="relative mb-4 overflow-hidden rounded-3xl shadow-sm">
        <div ref={mapEl} className="h-[55vh] min-h-[340px] w-full" />
      </div>

      {!selected ? (
        <Empty title="No courts inside this radius" hint={total ? 'Slide the radius bigger, clear the search or pick another sport.' : 'No courts for this sport yet.'} />
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {list.map((v) => (
            <VenueCard key={v.id} venue={v} selected={v.id === selected.id} onSelect={() => choose(v.id)} />
          ))}
        </div>
      )}
    </Page>
  );
}
