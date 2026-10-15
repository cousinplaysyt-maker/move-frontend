// Clean line icons for each sport (replaces the emoji). Colour follows the surrounding text.
const paths = {
  pickleball: (<>
    <rect x="4" y="2" width="10" height="13" rx="3.5" transform="rotate(-45 9 8.5)" />
    <path d="M13.8 13.8l5 5" strokeWidth="2.4" />
    <circle cx="18.5" cy="5.5" r="2.5" />
  </>),
  basketball: (<>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3v18M5.5 5.5c3 3 3 10 0 13M18.5 5.5c-3 3-3 10 0 13" />
  </>),
  badminton: (<>
    <circle cx="6.5" cy="17.5" r="2.8" />
    <path d="M8.6 15.4L13 4M9.4 16.6L20.5 11M8.5 14.5L18 6.5M13 4q6 0 7.5 7" />
  </>),
  tennis: (<>
    <circle cx="12" cy="12" r="9" />
    <path d="M5.2 5.2c4 3.5 4 9.1 0 13.6M18.8 5.2c-4 3.5-4 9.1 0 13.6" />
  </>),
  padel: (<>
    <circle cx="10" cy="10" r="6.5" />
    <path d="M14.7 14.7l5.3 5.3" strokeWidth="2.4" />
    <g fill="currentColor" stroke="none"><circle cx="8" cy="8" r=".8" /><circle cx="12" cy="8" r=".8" /><circle cx="8" cy="12" r=".8" /><circle cx="12" cy="12" r=".8" /><circle cx="10" cy="10" r=".8" /></g>
  </>),
};

export default function SportIcon({ sport, size = 16, className = '' }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={`inline-block shrink-0 align-[-0.2em] ${className}`}>
      {paths[sport] ?? <circle cx="12" cy="12" r="9" />}
    </svg>
  );
}
