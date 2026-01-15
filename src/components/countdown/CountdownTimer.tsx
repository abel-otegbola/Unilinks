import { useEffect, useState } from "react";

interface CountdownTimerProps {
  expiresAt: Date;
  onExpired?: () => void;
  className?: string;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
}

export default function CountdownTimer({ expiresAt, onExpired, className = "" }: CountdownTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    expired: false,
  });

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date().getTime();
      const expiry = new Date(expiresAt).getTime();
      const difference = expiry - now;

      if (difference <= 0) {
        setTimeRemaining({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          expired: true,
        });
        if (onExpired) {
          onExpired();
        }
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeRemaining({
        days,
        hours,
        minutes,
        seconds,
        expired: false,
      });
    };

    // Calculate immediately
    calculateTimeRemaining();

    // Update every second
    const interval = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [expiresAt, onExpired]);

  if (timeRemaining.expired) {
    return (
      <span className={`text-sm font-medium text-red-600 ${className}`}>
        Expired
      </span>
    );
  }

  return (
    <div className={`flex items-center gap-2 text-xs text-gray-500 ${className}`}>
      {timeRemaining.days > 0 && (
        <div className="flex flex-col items-center bg-gray-100 rounded px-2 py-1">
          <span className="text-sm font-bold text-gray-900">{timeRemaining.days}</span>
          <span className="text-[10px] text-gray-500">{timeRemaining.days === 1 ? 'day' : 'days'}</span>
        </div>
      )}
      <div className="flex flex-col items-center bg-gray-100 rounded px-2 py-1">
        <span className="text-sm font-bold text-gray-900">{String(timeRemaining.hours).padStart(2, '0')}</span>
        <span className="text-[10px] text-gray-500">hrs</span>
      </div>
      <span className="text-gray-400">:</span>
      <div className="flex flex-col items-center bg-gray-100 rounded px-2 py-1">
        <span className="text-sm font-bold text-gray-900">{String(timeRemaining.minutes).padStart(2, '0')}</span>
        <span className="text-[10px] text-gray-500">min</span>
      </div>
      <span className="text-gray-400">:</span>
      <div className="flex flex-col items-center bg-gray-100 rounded px-2 py-1">
        <span className="text-sm font-bold text-gray-900">{String(timeRemaining.seconds).padStart(2, '0')}</span>
        <span className="text-[10px] text-gray-500">sec</span>
      </div>
    </div>
  );
}
