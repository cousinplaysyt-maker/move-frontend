import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { IoLocate } from 'react-icons/io5';
import { useTable, useSettings } from '../data/db';
import { Page, SportChips, VenueCard, Empty, inputCls, peso, fmtDist } from '../components/ui';

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
  const venues = useTable('venues');
  const { unit } = useSettings();
  const [params, setParams] = useSearchParams();
  const [sport, setSport] = useState('all');
  const [selectedId, setSelectedId] = useState(null);
  const [geoError, setGeoError] = useState('');
  const q = params.get('q') ?? '';

  const mapEl = useRef(null);
  const map = useRef(null);
  const markers = useRef(null);
  const me = useRef(null);

  const list = venues.filter(
    (v) =>
      (sport === 'all' || v.sports.includes(sport)) &&
      `${v.name} ${v.area}`.toLowerCase().includes(q.toLowerCase()),
  );
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

  // frame all pins when the filter changes
  useEffect(() => {
    if (!map.current || list.length === 0) return;
    map.current.fitBounds(L.latLngBounds(list.map((v) => [v.lat, v.lng])), { padding: [60, 60], maxZoom: 14 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listKey]);

  const choose = (id) => {
    setSelectedId(id);
    const v = venues.find((x) => x.id === id);
    if (v && map.current) map.current.flyTo([v.lat, v.lng], 14);
  };

  const locate = () => {
    setGeoError('');
    if (!navigator.geolocation) return setGeoError('Your browser does not support location.');
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const pos = [coords.latitude, coords.longitude];
        me.current?.remove();
        me.current = L.circleMarker(pos, { radius: 8, color: '#fff', weight: 3, fillColor: '#006948', fillOpacity: 1 }).addTo(map.current);
        map.current.flyTo(pos, 14);
      },
      () => setGeoError('Location is blocked. Allow it in your browser settings and try again.'),
    );
  };

  return (
    <Page title="Map view" subtitle="Tap a pin to see the court" back={false}>
      <input
        className={`${inputCls} mb-3`}
        placeholder="Search courts or areas"
        value={q}
        onChange={(e) => setParams(e.target.value ? { q: e.target.value } : {})}
      />
      <SportChips value={sport} onChange={setSport} />

      <div className="relative mb-4 overflow-hidden rounded-3xl shadow-sm">
        <div ref={mapEl} className="h-[55vh] min-h-[340px] w-full" />
        <button onClick={locate} aria-label="Show my location" className="absolute right-3 top-3 z-[1000] flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#006948] shadow-lg active:scale-95">
          <IoLocate size={22} />
        </button>
      </div>
      {geoError && <p role="alert" className="mb-3 text-sm font-semibold text-[#ba1a1a]">{geoError}</p>}

      {!selected ? (
        <Empty title="No courts match" hint="Clear the search or pick another sport." />
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
