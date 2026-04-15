import { useEffect, useState, useRef } from 'react';
import { Clock } from 'lucide-react';

/**
 * Props:
 *  durationMinutes  – number  (total quiz duration)
 *  startedAt        – string  (ISO timestamp when attempt started, from backend)
 *  onTimeUp         – () => void
 */
const Timer = ({ durationMinutes, startedAt, onTimeUp }) => {
  const totalSeconds = durationMinutes * 60;

  // ── Calculate remaining time from wall clock ───────────────────────────
  // This means refreshing the page does NOT reset the timer.
  const calcTimeLeft = () => {
    if (!startedAt) return totalSeconds;

    const elapsedSeconds = Math.floor(
      (Date.now() - new Date(startedAt).getTime()) / 1000
    );
    return Math.max(totalSeconds - elapsedSeconds, 0);
  };

  const [timeLeft, setTimeLeft] = useState(calcTimeLeft);
  const [warning, setWarning] = useState('');
  const onTimeUpRef = useRef(onTimeUp);

  // Keep ref fresh so interval closure never goes stale
  useEffect(() => { onTimeUpRef.current = onTimeUp; }, [onTimeUp]);

  // ── Tick every second ──────────────────────────────────────────────────
  useEffect(() => {
    // Already expired on mount (e.g. refreshed after time ran out)
    if (calcTimeLeft() <= 0) {
      onTimeUpRef.current?.();
      return;
    }

    const interval = setInterval(() => {
      const remaining = calcTimeLeft();
      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        onTimeUpRef.current?.();
      }
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startedAt, totalSeconds]);   // re-init only if these change

  // ── Warning banners ────────────────────────────────────────────────────
  useEffect(() => {
    if (timeLeft === 300) setWarning('⚡ Only 5 minutes left!');
    if (timeLeft === 60) setWarning('🔴 Last 1 minute!');
  }, [timeLeft]);

  // ── Display ────────────────────────────────────────────────────────────
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const colorClass =
    timeLeft <= 60 ? 'text-red-600 animate-pulse' :
      timeLeft <= 300 ? 'text-orange-500' :
        'text-green-600';

  const bgClass =
    timeLeft <= 60 ? 'bg-red-50 border-red-500' :
      timeLeft <= 300 ? 'bg-orange-50 border-orange-400' :
        'bg-white border-black';

  return (
    <div className="flex flex-col items-end gap-1">
      {/* Clock display */}
      <div className={`flex items-center gap-2 px-3 py-1 border-4 ${bgClass}`}>
        <Clock size={20} className={colorClass} />
        <span className={`text-xl font-black tabular-nums ${colorClass}`}>
          {String(minutes).padStart(2, '0')}:
          {String(seconds).padStart(2, '0')}
        </span>
      </div>

      {/* Inline warning — no alert() */}
      {warning && (
        <p className="text-xs font-black text-red-600 uppercase tracking-widest animate-pulse">
          {warning}
        </p>
      )}
    </div>
  );
};

export default Timer;