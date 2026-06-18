import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "../lib/gsap";
import ScratchCard from "../components/ScratchCard";
import HeartCenterpiece from "../components/HeartCenterpiece";
import { IMG } from "../lib/content";

const GoldMotif = ({ className = "" }) => (
  <svg className={className} fill="none" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M50 0C50 27.6142 27.6142 50 0 50C27.6142 50 50 72.3858 50 100C50 72.3858 72.3858 50 100 50C72.3858 50 50 27.6142 50 0Z"
      fill="currentColor"
    />
  </svg>
);

/**
 * SaveTheDate — bordered glass panel:
 *   ✦ · SAVE THE DATE · [scratch capsule hiding the date] · ♥ · venue · ✦
 *
 * The date sits under the scratch capsule (centered). Scratch it; at ~68%
 * cleared it auto-completes and the heart + venue reveal below. Heart + venue
 * aren't rendered until reveal → no reserved gap.
 */
export default function SaveTheDate() {
  const heartRef = useRef(null);
  const venueRef = useRef(null);
  const [revealed, setRevealed] = useState(false);

  const onScratchDone = () => setRevealed(true);

  useLayoutEffect(() => {
    if (!revealed) return;
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .fromTo(heartRef.current, { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.7)" }, 0)
        .fromTo(venueRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 }, 0.2);
    });
    return () => ctx.revert();
  }, [revealed]);

  return (
    <section className="relative flex h-screen items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src={IMG.saveTheDate} alt="Ancient stone temple corridor" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-primary/60" />
      </div>

      {/* Bordered glass panel */}
      <div className="relative z-10 mx-auto flex w-[min(90vw,460px)] flex-col items-center gap-7 rounded-[2.5rem] border border-secondary/25 bg-primary/40 px-8 py-12 text-center">
        {/* ✦ top */}
        <GoldMotif className="h-7 w-7 text-secondary-fixed/70" />

        {/* SAVE THE DATE */}
        <span className="border-y border-secondary/40 py-3 font-label-caps text-label-caps tracking-[0.5em] text-secondary-fixed-dim">
          SAVE THE DATE
        </span>

        {/* Date under the scratch capsule */}
        <div className="relative">
          <div
            className={`std-breathe pointer-events-none absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full transition-opacity duration-500 ${
              revealed ? "opacity-0" : "opacity-100"
            }`}
            style={{
              background:
                "radial-gradient(circle, rgba(233,193,118,0.4), rgba(233,193,118,0.08) 50%, transparent 72%)",
            }}
          />
          <ScratchCard threshold={0.68} brush={26} radius={9999} onComplete={onScratchDone} className="inline-block">
            <h2 className="relative z-10 px-10 py-7 font-display-lg text-4xl leading-none text-secondary-fixed md:text-5xl [text-shadow:0_4px_24px_rgba(0,0,0,0.5)]">
              12 • 07 • 26
            </h2>
            {!revealed && (
              <>
                <span className="std-shimmer pointer-events-none absolute inset-0 z-30 block rounded-full" aria-hidden="true" />
                <span className="std-dust pointer-events-none absolute inset-0 z-30 block rounded-full" aria-hidden="true" />
              </>
            )}
          </ScratchCard>
        </div>

        {/* heart + venue — mount only after scratch completes */}
        {revealed && (
          <>
            <div ref={heartRef} className="opacity-0">
              <HeartCenterpiece />
            </div>
            <div ref={venueRef} className="flex flex-col items-center gap-2 opacity-0">
              <span className="font-headline-md text-xl text-secondary-fixed md:text-2xl">
                THE MAYOR RAMANATHAN CHETTIAR HALL
              </span>
              <span className="font-body-lg text-sm tracking-widest text-surface-container-lowest">
                CHENNAI, TAMIL NADU
              </span>
            </div>
          </>
        )}

        {/* ✦ bottom */}
        <GoldMotif className="h-7 w-7 text-secondary-fixed/70" />
      </div>
    </section>
  );
}
