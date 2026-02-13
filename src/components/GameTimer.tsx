import { useState, useEffect, useRef } from 'react';
import { Timer } from 'lucide-react';

interface GameTimerProps {
  isRunning: boolean;
  startTime: number | null;
  finalTime: number | null;
}

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function GameTimer({ isRunning, startTime, finalTime }: GameTimerProps) {
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isRunning && startTime) {
      intervalRef.current = setInterval(() => {
        setElapsed(Date.now() - startTime);
      }, 1000);
    } else if (!isRunning && finalTime !== null) {
      setElapsed(finalTime);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, startTime, finalTime]);

  if (!startTime && finalTime === null) return null;

  return (
    <div className="fixed top-16 right-4 z-50 bg-card border border-border rounded-lg px-3 py-2 shadow-lg flex items-center gap-2">
      <Timer className="h-4 w-4 text-primary" />
      <span className="font-mono text-sm font-semibold text-foreground">
        {formatTime(elapsed)}
      </span>
    </div>
  );
}

export { formatTime };
