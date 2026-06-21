import { useEffect, useState } from "react";
import { Sparkles, Gem } from "../lib/icons";

const TARGET = new Date("2026-07-12T00:00:00").getTime();
const DAY_MS = 86400000;
const DAY_END = TARGET + DAY_MS;

const calc = () => {
  const now = Date.now();
  if (now >= DAY_END) return { phase: "after" };
  if (now >= TARGET) return { phase: "today" };
  const diff = TARGET - now;
  return {
    phase: "before",
    days: Math.floor(diff / DAY_MS),
    hours: Math.floor((diff % DAY_MS) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
};

/** One gold medallion: a ringed circle with the value + a faint progress arc
 *  (how full the unit is). The seconds ring visibly sweeps each minute. */
function Medallion({ value, max, label }) {
  const R = 34;
  const C = 2 * Math.PI * R;
  const frac = max ? value / max : 0;
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative h-20 w-20 md:h-24 md:w-24">
        <svg viewBox="0 0 80 80" className="absolute inset-0 h-full w-full -rotate-90">
          {/* base ring */}
          <circle cx="40" cy="40" r={R} fill="none" stroke="rgba(233,193,118,0.18)" strokeWidth="2" />
          {/* progress arc */}
          <circle
            cx="40"
            cy="40"
            r={R}
            fill="none"
            stroke="rgba(233,193,118,0.85)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={C * (1 - frac)}
            style={{ transition: "stroke-dashoffset 0.5s linear" }}
          />
          {/* inner hairline */}
          <circle cx="40" cy="40" r={R - 6} fill="none" stroke="rgba(233,193,118,0.12)" strokeWidth="1" />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center font-display-lg text-2xl tabular-nums text-secondary-fixed md:text-3xl">
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className="font-label-caps text-[0.6rem] tracking-[0.25em] text-surface-container-lowest/80">
        {label}
      </span>
    </div>
  );
}

/**
 * Countdown — premium gold-medallion timer to 12 July 2026.
 *   before → four ringed medallions (Days/Hrs/Min/Sec) with progress arcs
 *   today  → "Today is the Day ✨"   ·   after → "Happily Married 💍"
 */
export default function Countdown() {
  const [t, setT] = useState(calc);

  useEffect(() => {
    const id = setInterval(() => setT(calc()), 1000);
    return () => clearInterval(id);
  }, []);

  if (t.phase === "today" || t.phase === "after") {
    return (
      <div className="flex flex-col items-center gap-2 text-center">
        <span className="font-display-lg text-3xl italic text-secondary-fixed md:text-4xl">
          {t.phase === "today" ? "Today is the Day" : "Happily Married"}
        </span>
        {t.phase === "today" ? (
          <Sparkles className="h-6 w-6 text-secondary-fixed" />
        ) : (
          <Gem className="h-6 w-6 text-secondary-fixed" />
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-5">
      <span className="font-label-caps text-label-caps tracking-[0.3em] text-surface-container-lowest/80">
        COUNTING DOWN TO FOREVER
      </span>
      <div className="flex items-center justify-center gap-3 md:gap-5">
        <Medallion value={t.days} max={365} label="DAYS" />
        <Medallion value={t.hours} max={24} label="HRS" />
        <Medallion value={t.minutes} max={60} label="MIN" />
        <Medallion value={t.seconds} max={60} label="SEC" />
      </div>
    </div>
  );
}
