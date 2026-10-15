// Full-screen celebration: dim backdrop, spinning sunburst, confetti, big waving character.
import { useEffect, useMemo, useRef, useState } from 'react';
import { IoStar } from 'react-icons/io5';
import Chibi from './Chibi';
import { achievementOf, CHARACTERS } from '../data/achievements';

const SHOW_MS = 6500;
const COLORS = ['#ffb95f', '#85f8c4', '#ff6b6b', '#60a5fa', '#c084fc', '#fde047', '#ffffff'];

export default function AchievementToast() {
  const [queue, setQueue] = useState([]);
  const [current, setCurrent] = useState(null);
  const [leaving, setLeaving] = useState(false);
  const timers = useRef([]);

  useEffect(() => {
    const onUnlock = (e) => setQueue((q) => [...q, e.detail]);
    window.addEventListener('move-achievement', onUnlock);
    return () => window.removeEventListener('move-achievement', onUnlock);
  }, []);

  useEffect(() => {
    if (current || !queue.length) return;
    setCurrent(achievementOf(queue[0]));
    setQueue((q) => q.slice(1));
    setLeaving(false);
  }, [queue, current]);

  useEffect(() => {
    if (!current) return;
    timers.current = [setTimeout(() => setLeaving(true), SHOW_MS), setTimeout(() => setCurrent(null), SHOW_MS + 500)];
    return () => timers.current.forEach(clearTimeout);
  }, [current]);

  const confetti = useMemo(
    () => Array.from({ length: 70 }, (_, i) => ({
      i, left: Math.random() * 100, delay: Math.random() * 1.2, dur: 2.4 + Math.random() * 2,
      size: 6 + Math.random() * 8, color: COLORS[i % COLORS.length], drift: (Math.random() - 0.5) * 160, round: i % 3 === 0,
    })),
    [current], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const close = () => { timers.current.forEach(clearTimeout); setLeaving(true); setTimeout(() => setCurrent(null), 400); };
  if (!current) return null;
  const who = CHARACTERS[current.who];
  const AIcon = current.Icon;

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-black/60 backdrop-blur-sm ${leaving ? 'ach-fade-out' : 'ach-fade-in'}`} onClick={close} role="status" aria-live="polite">
      <div className="ach-rays" aria-hidden="true" />
      {confetti.map((p) => (
        <span key={p.i} aria-hidden="true" className="ach-confetti" style={{ left: `${p.left}%`, width: p.size, height: p.round ? p.size : p.size * 0.5, background: p.color, borderRadius: p.round ? '50%' : 2, animationDelay: `${p.delay}s`, animationDuration: `${p.dur}s`, '--drift': `${p.drift}px` }} />
      ))}
      <div className={`relative flex w-full max-w-xl flex-col items-center px-4 ${leaving ? 'chibi-out' : 'ach-pop'}`}>
        <div className="ach-banner mb-2 rounded-full bg-gradient-to-r from-[#ffb95f] via-[#fde047] to-[#ffb95f] px-6 py-2 text-sm font-extrabold uppercase tracking-[.2em] text-[#2a1700] shadow-[0_0_30px_#ffb95f]">
          <span className="inline-flex items-center gap-2"><IoStar /> Achievement unlocked <IoStar /></span>
        </div>
        <h2 className="ach-title flex items-center justify-center gap-3 text-center text-4xl font-extrabold text-white md:text-5xl"><AIcon className="shrink-0" /> {current.title}</h2>
        <div className="mt-2 flex items-end justify-center">
          <div className="ach-char drop-shadow-[0_10px_30px_rgba(255,185,95,.6)]">
            <Chibi who={current.who} size={230} />
          </div>
          <div className="chibi-bubble relative mb-32 -ml-2 max-w-[260px] rounded-3xl rounded-bl-md bg-white p-4 shadow-2xl">
            <p className="text-lg font-extrabold leading-snug text-[#0b1c30]">{current.say}</p>
            <p className="mt-2 text-xs font-bold text-[#006948]">{who.name} · {who.tag}</p>
          </div>
        </div>
        <p className="mt-1 rounded-full bg-white/15 px-4 py-1 text-sm font-semibold text-white">{current.text}</p>
        <p className="mt-3 text-xs text-white/60">Tap anywhere to continue</p>
      </div>
    </div>
  );
}
