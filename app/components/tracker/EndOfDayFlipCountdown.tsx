"use client";

import { useCallback, useState } from "react";
import FlipClockCountdown from "@leenguyen/react-flip-clock-countdown";
import "@leenguyen/react-flip-clock-countdown/dist/index.css";

function nextLocalMidnightMs(): number {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

/**
 * Flip-style countdown to the next local midnight (end of calendar day).
 */
export function EndOfDayFlipCountdown() {
  const [deadline, setDeadline] = useState(() => nextLocalMidnightMs());

  const handleComplete = useCallback(() => {
    setDeadline(nextLocalMidnightMs());
  }, []);

  return (
    <div className="flip-countdown-tracker w-full overflow-x-auto py-1">
      <FlipClockCountdown
        key={deadline}
        className="min-w-[min(100%,20rem)] justify-center"
        to={deadline}
        renderMap={[false, true, true, true]}
        labels={["", "Hours", "Minutes", "Seconds"]}
        showLabels
        showSeparators
        renderOnServer
        stopOnHiddenVisibility
        hideOnComplete={false}
        duration={0.65}
        onComplete={handleComplete}
        digitBlockStyle={{
          fontSize: "clamp(1.5rem, 4vw, 2rem)",
          width: "clamp(2rem, 8vw, 2.75rem)",
          height: "clamp(3rem, 12vw, 4.25rem)",
        }}
        labelStyle={{
          fontSize: "0.65rem",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
        separatorStyle={{ size: 4 }}
      />
    </div>
  );
}
