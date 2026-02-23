import { useEffect, useState } from "react";

type ToastProps = {
  message?: string;
  type?: "error" | "success";
  duration?: number;
  timestamp?: number; // Add timestamp to force re-trigger with same message
};

export default function Toast({ message, type = "success", duration = 5000, timestamp }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!message) {
      const resetTimer = setTimeout(() => setIsVisible(false), 0);
      return () => clearTimeout(resetTimer);
    }

    // Small delay to trigger animation
    const showTimer = setTimeout(() => setIsVisible(true), 50);

    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [message, duration, timestamp]);

  if (!message) {
    return null;
  }

  return (
    <div
      className={`
        bg-[#FFF5F4] p-4 font-bold fixed bottom-4 right-4 -translate-x-1/2 rounded-lg shadow-lg z-[9999]
        transition-all duration-300 ease-out overflow-hidden
        ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'}
      `}
    >
      <p className={type === "error" ? "text-red" : "text-green"}>
        {message}
      </p>
    </div>
  );
}
