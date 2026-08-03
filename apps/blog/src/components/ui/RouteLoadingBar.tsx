import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

const RouteLoadingBar = () => {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<number[]>([]);

  useEffect(() => {
    timerRef.current.forEach((timer) => window.clearTimeout(timer));
    timerRef.current = [];

    setIsVisible(true);
    setProgress(15);

    timerRef.current.push(window.setTimeout(() => setProgress(45), 120));
    timerRef.current.push(window.setTimeout(() => setProgress(70), 260));
    timerRef.current.push(window.setTimeout(() => setProgress(88), 420));
    timerRef.current.push(
      window.setTimeout(() => {
        setProgress(100);
        timerRef.current.push(
          window.setTimeout(() => {
            setIsVisible(false);
            setProgress(0);
          }, 220)
        );
      }, 620)
    );

    return () => {
      timerRef.current.forEach((timer) => window.clearTimeout(timer));
      timerRef.current = [];
    };
  }, [location.key]);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[120] h-0.5">
      <div
        className="h-full bg-accent shadow-[0_0_10px_hsl(var(--accent)/0.55)] transition-[width,opacity] duration-200 ease-out"
        style={{
          width: `${progress}%`,
          opacity: isVisible ? 1 : 0,
        }}
      />
    </div>
  );
};

export default RouteLoadingBar;
