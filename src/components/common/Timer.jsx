import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

const Timer = ({ durationMinutes, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(durationMinutes * 60);
  const [warning, setWarning] = useState('');

  // ✅ Single interval (fixed)
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // ✅ Time logic
  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
    }

    // 🔥 warnings
    if (timeLeft === 300) {
      setWarning('Only 5 minutes left!');
    }

    if (timeLeft === 60) {
      setWarning('Last 1 minute!');
    }
  }, [timeLeft, onTimeUp]);

  // 🔥 Tab switch detection (killer feature)
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        alert("Warning: Do not switch tabs during exam!");
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const getColorClass = () => {
    if (timeLeft <= 60) return 'text-red-600';
    if (timeLeft <= 300) return 'text-orange-600';
    return 'text-green-600';
  };

  return (
    <div>
      {/* Timer */}
      <div className={`flex items-center gap-2 text-xl font-semibold ${getColorClass()}`}>
        <Clock size={24} />
        <span>
          {String(minutes).padStart(2, '0')}:
          {String(seconds).padStart(2, '0')}
        </span>
      </div>

      {/* Warning */}
      {warning && (
        <p className="text-sm text-red-500 mt-1">
          {warning}
        </p>
      )}
    </div>
  );
};

export default Timer;