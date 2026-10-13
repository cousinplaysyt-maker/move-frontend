import { useState } from 'react';
import { IoLocate } from 'react-icons/io5';
import { saveSettings, useSettings } from '../data/db';
import { locateMe } from '../data/geo';
import { Btn, fmtDist } from './ui';

export default function RadiusBar({ usingGps, city }) {
  const { radiusKm, unit } = useSettings();
  const [err, setErr] = useState('');
  return (
    <div className="mb-4 rounded-2xl bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-bold">
          Within {fmtDist(radiusKm, unit)} of {usingGps ? 'my location' : `${city} centre`}
        </p>
        <Btn variant="soft" className="!px-4 !py-2" onClick={() => { setErr(''); locateMe(setErr); }}>
          <IoLocate size={16} /> Use my location
        </Btn>
      </div>
      <input
        type="range" min="1" max="50" step="1" value={radiusKm} aria-label="Search radius in kilometers"
        onChange={(e) => saveSettings({ radiusKm: Number(e.target.value) })}
        className="mt-3 w-full accent-[#006948]"
      />
      <div className="flex justify-between text-xs text-[#565e74]"><span>1 km</span><span>50 km</span></div>
      {err && <p role="alert" className="mt-2 text-sm font-semibold text-[#ba1a1a]">{err}</p>}
    </div>
  );
}
