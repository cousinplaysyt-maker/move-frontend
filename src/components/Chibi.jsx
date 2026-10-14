// Original chibi pickleball character drawn in SVG. `wave` animates the free arm.
import { CHARACTERS } from '../data/achievements';

function Hair({ style, color, accent }) {
  if (style === 'ponytail') return (<>
    <path d="M26 52a34 34 0 0 1 68 0c-10-12-24-16-34-16s-24 4-34 16z" fill={color} />
    <path d="M92 48c18 4 18 30 6 40 2-14-2-28-12-34z" fill={color} className="chibi-tail" />
  </>);
  if (style === 'bun') return (<>
    <circle cx="60" cy="14" r="12" fill={color} />
    <path d="M26 54a34 34 0 0 1 68 0c-10-14-24-18-34-18s-24 4-34 18z" fill={color} />
  </>);
  if (style === 'cap') return (<>
    <path d="M26 50a34 34 0 0 1 68 0z" fill={accent} />
    <path d="M60 50h46c0 6-8 9-18 9H60z" fill={accent} />
    <path d="M26 50a34 34 0 0 1 68 0" fill="none" stroke={color} strokeWidth="2" opacity=".25" />
  </>);
  return <path d="M26 56a34 34 0 0 1 68 0c-4-14-16-22-34-22S30 42 26 56z" fill={color} />;
}

export default function Chibi({ who = 'penny', size = 140, wave = true }) {
  const c = CHARACTERS[who] ?? CHARACTERS.penny;
  c.paddle = c.itemColor;
  return (
    <svg viewBox="0 0 120 170" width={size} height={size * 1.42} aria-label={c.name} role="img">
      <ellipse cx="60" cy="165" rx="30" ry="4" fill="#000" opacity=".12" />
      {/* legs + shoes */}
      <rect x="45" y="128" width="12" height="28" rx="6" fill={c.skin} />
      <rect x="63" y="128" width="12" height="28" rx="6" fill={c.skin} />
      <ellipse cx="50" cy="158" rx="11" ry="6" fill="#fff" stroke="#cbd5e1" />
      <ellipse cx="70" cy="158" rx="11" ry="6" fill="#fff" stroke="#cbd5e1" />
      {/* body */}
      <rect x="38" y="96" width="44" height="40" rx="16" fill={c.shirt} />
      <rect x="38" y="122" width="44" height="14" rx="7" fill={c.accent} opacity=".9" />
      {c.number && <text x="60" y="118" textAnchor="middle" fontSize="20" fontWeight="800" fill={c.accent} fontFamily="sans-serif">{c.number}</text>}
      {/* item arm (left) */}
      <g>
        <rect x="22" y="104" width="12" height="26" rx="6" fill={c.skin} transform="rotate(14 28 104)" />
        <g transform="rotate(14 28 104)">
          {c.item === 'ball' ? (<>
            <circle cx="17" cy="124" r="15" fill={c.itemColor} stroke="#7c2d12" strokeWidth="1.5" />
            <path d="M2 124h30M17 109v30M7 113q10 11 0 22M27 113q-10 11 0 22" fill="none" stroke="#7c2d12" strokeWidth="1.3" />
          </>) : c.item === 'racket' ? (<>
            <rect x="14" y="124" width="5" height="18" rx="2" fill="#374151" />
            <ellipse cx="16.5" cy="112" rx="13" ry="17" fill="none" stroke={c.itemColor} strokeWidth="3.5" />
            <path d="M8 104h17M6 112h21M8 120h17M12 97v30M17 95v34M22 97v30" stroke="#fff" strokeWidth=".8" opacity=".8" />
          </>) : (<>
            <rect x="14" y="120" width="5" height="16" rx="2" fill="#374151" />
            <ellipse cx="16.5" cy="116" rx="13" ry="16" fill={c.itemColor} stroke="#0003" strokeWidth="1.5" />
            <circle cx="16.5" cy="116" r="2" fill="#fff6" /><circle cx="12" cy="110" r="2" fill="#fff6" /><circle cx="21" cy="121" r="2" fill="#fff6" />
          </>)}
        </g>
      </g>
      {/* waving arm (right) */}
      <g className={wave ? 'chibi-wave' : ''} style={{ transformOrigin: '82px 104px', transformBox: 'view-box' }}>
        <rect x="80" y="76" width="12" height="32" rx="6" fill={c.skin} transform="rotate(-8 86 104)" />
        <circle cx="87" cy="74" r="8" fill={c.skin} />
      </g>
      {/* head */}
      <circle cx="60" cy="62" r="36" fill={c.skin} />
      <Hair style={c.hairStyle} color={c.hair} accent={c.accent} />
      {c.band && <rect x="25" y="44" width="70" height="9" rx="4.5" fill={c.accent} stroke={c.shirt} strokeWidth="1.5" />}
      {/* face */}
      <g className="chibi-blink" style={{ transformOrigin: '60px 68px' }}>
        <ellipse cx="46" cy="68" rx="6" ry="8" fill="#1f2937" />
        <ellipse cx="74" cy="68" rx="6" ry="8" fill="#1f2937" />
        <circle cx="48" cy="65" r="2.4" fill="#fff" /><circle cx="76" cy="65" r="2.4" fill="#fff" />
      </g>
      <ellipse cx="38" cy="80" rx="6" ry="3.5" fill="#ff7a8a" opacity=".45" />
      <ellipse cx="82" cy="80" rx="6" ry="3.5" fill="#ff7a8a" opacity=".45" />
      <path d="M52 82q8 9 16 0z" fill="#7f1d1d" /><path d="M56 85q4 3 8 0" fill="#ff8fa0" />
    </svg>
  );
}
