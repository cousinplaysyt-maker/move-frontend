export default function Logo({ className = '' }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg viewBox="0 0 40 40" className="h-9 w-9 shrink-0" aria-hidden="true">
        <rect width="40" height="40" rx="11" fill="#006948" />
        <path
          d="M10 28V16 M10 21a5 5 0 0 1 10 0v7 M20 21a5 5 0 0 1 10 0v7"
          stroke="#85f8c4"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="31" cy="11" r="2.5" fill="#ffb95f" />
      </svg>
      <span className="text-xl font-extrabold tracking-tight text-on-surface leading-none">
        move<span className="text-primary">.</span>
      </span>
    </div>
  )
}