import { IoHeart, IoHeartOutline } from 'react-icons/io5';
import { useFavorites, toggleFavorite } from '../data/favorites';

export default function FavButton({ venueId, withLabel = false }) {
  const on = useFavorites().has(venueId);
  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); toggleFavorite(venueId); }}
      aria-pressed={on}
      aria-label={on ? 'Remove from saved courts' : 'Save this court'}
      className={`inline-flex items-center gap-1.5 rounded-full transition active:scale-90 ${withLabel ? 'px-4 py-2 text-sm font-bold' : 'p-2'} ${on ? 'bg-[#ffdad6] text-[#ba1a1a]' : 'bg-[#e5eeff] text-[#3d4a42] hover:bg-[#d3e4fe]'}`}
    >
      {on ? <IoHeart size={18} /> : <IoHeartOutline size={18} />}
      {withLabel && (on ? 'Saved' : 'Save')}
    </button>
  );
}
