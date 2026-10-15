import { IoStar, IoStarHalf, IoStarOutline } from 'react-icons/io5';
import { useRating } from '../data/reviews';

export function Stars({ value, size = 16 }) {
  return (
    <span className="inline-flex text-[#e59a00]" role="img" aria-label={`${value.toFixed(1)} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (value >= i - 0.25 ? <IoStar key={i} size={size} /> : value >= i - 0.75 ? <IoStarHalf key={i} size={size} /> : <IoStarOutline key={i} size={size} />))}
    </span>
  );
}

export function StarInput({ value, onChange, size = 30 }) {
  return (
    <div className="flex gap-1" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((i) => (
        <button key={i} type="button" role="radio" aria-checked={value === i} aria-label={`${i} star${i > 1 ? 's' : ''}`} onClick={() => onChange(i)} className="text-[#e59a00] transition active:scale-90">
          {value >= i ? <IoStar size={size} /> : <IoStarOutline size={size} />}
        </button>
      ))}
    </div>
  );
}

export function RatingBadge({ venueId }) {
  const { avg, count } = useRating(venueId);
  if (!count) return <span className="text-xs font-semibold text-[#6d7a72]">No reviews yet</span>;
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0b1c30]">
      <Stars value={avg} size={13} /> {avg.toFixed(1)} <span className="font-semibold text-[#6d7a72]">({count})</span>
    </span>
  );
}
