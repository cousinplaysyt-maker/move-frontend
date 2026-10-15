import { useEffect, useState } from 'react';
import { IoCamera, IoClose } from 'react-icons/io5';
import { useUser } from '../data/db';
import { useReviews, saveReview, deleteReview, shrinkImage, surfaceOf, SURFACES, MAX_PHOTOS } from '../data/reviews';
import { Card, Btn, Avatar, Field, inputCls } from './ui';
import { Stars, StarInput } from './Stars';

function Lightbox({ src, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center bg-black/80 p-4" onClick={onClose} role="dialog" aria-label="Photo">
      <button className="absolute right-4 top-4 rounded-full bg-white/20 p-2 text-white" aria-label="Close photo"><IoClose size={24} /></button>
      <img src={src} alt="Court photo" className="max-h-[85vh] max-w-full rounded-xl object-contain" />
    </div>
  );
}

export default function Reviews({ venue }) {
  const me = useUser();
  const list = useReviews(venue.id);
  const mine = list.find((r) => r.userId === me?.id);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ rating: 0, text: '', surface: '', photos: [] });
  const [error, setError] = useState('');
  const [zoom, setZoom] = useState(null);

  const count = list.length;
  const avg = count ? list.reduce((n, r) => n + r.rating, 0) / count : 0;
  const surface = surfaceOf(venue, list);
  const allPhotos = list.flatMap((r) => r.photos ?? []);
  const showForm = editing || (!mine && !!me);

  const startEdit = () => { setForm({ rating: mine.rating, text: mine.text, surface: mine.surface ?? '', photos: mine.photos ?? [] }); setEditing(true); setError(''); };
  const addPhotos = async (e) => {
    const files = [...(e.target.files ?? [])].slice(0, MAX_PHOTOS - form.photos.length);
    e.target.value = '';
    try {
      const shrunk = await Promise.all(files.map((f) => shrinkImage(f)));
      setForm((f) => ({ ...f, photos: [...f.photos, ...shrunk].slice(0, MAX_PHOTOS) }));
    } catch (err) { setError(err.message); }
  };
  const submit = (e) => {
    e.preventDefault();
    if (!form.rating) return setError('Tap a star to rate this court.');
    const res = saveReview(venue.id, form);
    if (!res.ok) return setError(res.error);
    setEditing(false); setError(''); setForm({ rating: 0, text: '', surface: '', photos: [] });
  };

  return (
    <section className="mt-6">
      <h2 className="mb-2 font-bold">Reviews and photos</h2>
      <Card>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          {count > 0 ? (
            <div className="flex items-center gap-3">
              <span className="text-4xl font-extrabold text-[#0b1c30]">{avg.toFixed(1)}</span>
              <div><Stars value={avg} size={18} /><p className="text-xs font-semibold text-[#565e74]">{count} review{count > 1 ? 's' : ''}</p></div>
            </div>
          ) : <p className="text-sm font-semibold text-[#565e74]">No reviews yet. Be the first to review this court.</p>}
          <p className="text-sm"><span className="font-bold">Surface:</span> {surface ?? 'Not listed yet'}{surface && !venue.surface && <span className="text-[#565e74]"> (reported by players)</span>}</p>
        </div>

        {allPhotos.length > 0 && (
          <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
            {allPhotos.slice(0, 8).map((src, i) => (
              <button key={i} onClick={() => setZoom(src)} className="shrink-0 overflow-hidden rounded-xl" aria-label="Open photo">
                <img src={src} alt="Court" className="h-24 w-32 object-cover transition hover:scale-105" />
              </button>
            ))}
          </div>
        )}
      </Card>

      {showForm && (
        <Card className="mt-3">
          <form onSubmit={submit} className="grid gap-3">
            <p className="font-bold">{mine ? 'Edit your review' : 'Write a review'}</p>
            <StarInput value={form.rating} onChange={(rating) => setForm({ ...form, rating })} />
            <Field label="Court surface (optional)">
              <select className={inputCls} value={form.surface} onChange={(e) => setForm({ ...form, surface: e.target.value })}>
                <option value="">Not sure</option>
                {SURFACES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="Your review">
              <textarea className={inputCls} rows={3} maxLength={600} value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} placeholder="Lighting, crowd, net quality, parking…" />
            </Field>
            <div className="flex flex-wrap items-center gap-2">
              {form.photos.map((src, i) => (
                <span key={i} className="relative">
                  <img src={src} alt="Upload preview" className="h-16 w-20 rounded-lg object-cover" />
                  <button type="button" aria-label="Remove photo" onClick={() => setForm({ ...form, photos: form.photos.filter((_, j) => j !== i) })} className="absolute -right-1.5 -top-1.5 rounded-full bg-[#0b1c30] p-0.5 text-white"><IoClose size={14} /></button>
                </span>
              ))}
              {form.photos.length < MAX_PHOTOS && (
                <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-[#e5eeff] px-4 py-2 text-sm font-bold hover:bg-[#d3e4fe]">
                  <IoCamera size={18} /> Add photos
                  <input type="file" accept="image/*" multiple className="hidden" onChange={addPhotos} />
                </label>
              )}
            </div>
            {error && <p className="text-sm font-semibold text-[#ba1a1a]" role="alert">{error}</p>}
            <div className="flex gap-2">
              <Btn type="submit">{mine ? 'Save changes' : 'Post review'}</Btn>
              {editing && <Btn type="button" variant="soft" onClick={() => { setEditing(false); setError(''); }}>Cancel</Btn>}
            </div>
          </form>
        </Card>
      )}

      <div className="mt-3 grid gap-3">
        {list.map((r) => (
          <Card key={r.id}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <Avatar name={r.author} size={36} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold">{r.author}{r.userId === me?.id && <span className="ml-1.5 rounded-full bg-[#85f8c4] px-2 py-0.5 text-[10px] font-bold text-[#002114]">You</span>}</p>
                  <div className="flex items-center gap-2"><Stars value={r.rating} size={14} /><span className="text-xs text-[#6d7a72]">{new Date(r.createdAt).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}</span></div>
                </div>
              </div>
              {r.userId === me?.id && !editing && (
                <div className="flex shrink-0 gap-1">
                  <Btn variant="soft" onClick={startEdit}>Edit</Btn>
                  <Btn variant="danger" onClick={() => window.confirm('Delete your review?') && deleteReview(r.id)}>Delete</Btn>
                </div>
              )}
            </div>
            {r.surface && <p className="mt-2 inline-block rounded-full bg-[#dce9ff] px-3 py-1 text-xs font-semibold">{r.surface}</p>}
            {r.text && <p className="mt-2 whitespace-pre-wrap break-words text-sm text-[#3d4a42]">{r.text}</p>}
            {r.photos?.length > 0 && (
              <div className="mt-3 flex gap-2 overflow-x-auto">
                {r.photos.map((src, i) => (
                  <button key={i} onClick={() => setZoom(src)} className="shrink-0 overflow-hidden rounded-xl" aria-label="Open photo"><img src={src} alt="Court" className="h-20 w-28 object-cover" /></button>
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>
      {zoom && <Lightbox src={zoom} onClose={() => setZoom(null)} />}
    </section>
  );
}
