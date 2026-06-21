import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "../lib/gsap";
import ScratchCard from "../components/ScratchCard";
import HeartCenterpiece from "../components/HeartCenterpiece";
import Countdown from "../components/Countdown";
import MarriedMessage from "../components/MarriedMessage";
import ProtectedImage from "../components/ProtectedImage";
import { WED_IMG } from "../lib/weddingImages";


// Wedding day = 12 July 2026. Phases:
//   "before"  : up to & including 10 July  → scratch card
//   "wedding" : 11–12 July                 → date shown directly (no scratch)
//   "married" : 13 July onward             → "Happily Married" blessing
const getPhase = () => {
  const now = Date.now();
  const weddingStart = new Date("2026-07-11T00:00:00").getTime();
  const afterWedding = new Date("2026-07-13T00:00:00").getTime();
  if (now >= afterWedding) return "married";
  if (now >= weddingStart) return "wedding";
  return "before";
};

/**
 * SaveTheDate — date-aware:
 *   - before (≤ Jul 10): scratch the capsule to reveal the date → countdown
 *   - wedding (Jul 11–12): date shown directly (no scratch) + "Today is the Day"
 *   - married (Jul 13+): "Happily Married" blessing with names + date
 */
export default function SaveTheDate() {
  const heartRef = useRef(null);
  const namesRef = useRef(null);
  const dateRef = useRef(null);
  const directRef = useRef(null);
  // phaseOverride: dev test toggle (null = use real date). Remove the segment +
  // this state once tested.
  const [phaseOverride, setPhaseOverride] = useState(null);
  const realPhase = getPhase();
  const phase = phaseOverride ?? realPhase;
  const [revealed, setRevealed] = useState(false);

  const onScratchDone = () => setRevealed(true);

  // Animate the scratch-reveal payload (before phase).
  useLayoutEffect(() => {
    if (phase !== "before" || !revealed) return;
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .fromTo(dateRef.current, { scale: 1 }, { scale: 1.06, duration: 0.35, ease: "sine.inOut", yoyo: true, repeat: 1 }, 0)
        .fromTo(heartRef.current, { opacity: 0, scale: 0 }, { opacity: 1, scale: 1.2, duration: 0.45, ease: "back.out(2)" }, 0.25)
        .to(heartRef.current, { scale: 1, duration: 0.35, ease: "power2.out" }, 0.7)
        .fromTo(namesRef.current, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7 }, 0.6);
    });
    return () => ctx.revert();
  }, [phase, revealed]);

  // Animate the direct date reveal (wedding phase, no scratch).
  useLayoutEffect(() => {
    if (phase !== "wedding") return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        directRef.current.querySelectorAll("[data-rise]"),
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.18, ease: "power3.out" }
      );
    });
    return () => ctx.revert();
  }, [phase]);

  return (
    <section className="relative flex h-screen items-center justify-center overflow-hidden md:justify-start md:pl-[2%] lg:pl-[4%]">
      {/* DEV TEST SEGMENT — preview each date phase. Remove after testing. */}
      <div className="absolute left-4 top-4 z-50 flex overflow-hidden rounded-full border border-secondary-fixed/40 text-[0.65rem]">
        {[
          { p: null, t: "Live" },
          { p: "before", t: "≤Jul10" },
          { p: "wedding", t: "Jul11-12" },
          { p: "married", t: "Jul13+" },
        ].map((o) => (
          <button
            key={o.t}
            type="button"
            onClick={() => {
              setPhaseOverride(o.p);
              setRevealed(false);
            }}
            className={`px-3 py-1.5 font-label-caps tracking-widest transition-colors ${
              phaseOverride === o.p ? "bg-secondary-fixed text-primary" : "bg-primary/70 text-secondary-fixed"
            }`}
          >
            {o.t}
          </button>
        ))}
      </div>

      <div className="absolute inset-0 z-0">
        <ProtectedImage
          src={WED_IMG.img1}
          alt="Surya & Sowmitha"
          className="h-full w-full object-cover"
          style={{ objectPosition: "70% center" }}
        />
        <div className="absolute inset-0 bg-primary/45" />
        {/* page-wide cinematic shadow — darker on the LEFT (behind the date /
            card) fading to clear on the right, so the typography floats on a
            soft shadow while the couple stays lit. Desktop only — on mobile the
            composition is centred, so a centred vignette is used instead. */}
        <div
          className="absolute inset-0 hidden md:block"
          style={{
            background:
              "linear-gradient(to right, rgba(20,4,4,0.78) 0%, rgba(20,4,4,0.45) 32%, transparent 58%)",
          }}
        />
        <div
          className="absolute inset-0 md:hidden"
          style={{
            background:
              "radial-gradient(ellipse 75% 55% at 50% 42%, rgba(20,4,4,0.55), transparent 75%)",
          }}
        />
      </div>

      {/* Floating cinematic composition — NO card, NO border, NO box. The date
          and countdown sit as elegant typography directly on the photograph;
          readability comes from soft text shadows + a gentle golden light that
          lives only behind the focal date (added below), not a panel. */}
      <div className="relative z-10 flex w-[min(90vw,440px)] flex-col items-center gap-5 px-4 py-16 text-center sm:px-6 md:-translate-y-14">
        {/* ── MARRIED (Jul 13+) ── */}
        {phase === "married" && <MarriedMessage />}

        {/* ── WEDDING DAY (Jul 11–12) — date shown directly, no scratch ── */}
        {phase === "wedding" && (
          <div ref={directRef} className="flex flex-col items-center gap-7">
            <span data-rise className="font-label-caps text-label-caps tracking-[0.5em] text-secondary-fixed-dim [text-shadow:0_2px_12px_rgba(0,0,0,0.6)]">
              THE DAY HAS ARRIVED
            </span>
            <div data-rise className="relative">
              {/* gentle golden light behind the focal date — readability without
                  a box */}
              <span
                className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-32 w-[110%] -translate-x-1/2 -translate-y-1/2"
                style={{
                  background:
                    "radial-gradient(ellipse, rgba(233,193,118,0.22), transparent 70%)",
                }}
                aria-hidden="true"
              />
              <h2 className="whitespace-nowrap font-display-lg text-4xl leading-none text-secondary-fixed sm:text-5xl md:text-7xl [text-shadow:0_4px_30px_rgba(0,0,0,0.7),0_2px_10px_rgba(0,0,0,0.6)]">
                12 • 07 • 26
              </h2>
            </div>
            <div data-rise>
              <HeartCenterpiece />
            </div>
            <span data-rise className="font-display-lg text-2xl italic text-secondary-fixed md:text-3xl [text-shadow:0_2px_16px_rgba(0,0,0,0.6)]">
              Today is the Day ✨
            </span>
          </div>
        )}

        {/* ── BEFORE (≤ Jul 10) — scratch to reveal ── */}
        {phase === "before" && (
          <>
            <span className="font-label-caps text-label-caps tracking-[0.5em] text-secondary-fixed-dim [text-shadow:0_2px_12px_rgba(0,0,0,0.6)]">
              SAVE THE DATE
            </span>

            <div className="relative">
              {/* soft STATIC gold halo behind the capsule (no breathing/blink),
                  tight so it never bleeds up behind the heading. */}
              <div
                className={`pointer-events-none absolute left-1/2 top-1/2 h-36 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full transition-opacity duration-500 ${
                  revealed ? "opacity-0" : "opacity-100"
                }`}
                style={{
                  background:
                    "radial-gradient(ellipse, rgba(233,193,118,0.22), transparent 70%)",
                }}
              />
              <ScratchCard
                threshold={0.6}
                brush={30}
                radius={9999}
                onComplete={onScratchDone}
                className="relative inline-block"
              >
                <h2 ref={dateRef} className="relative z-10 whitespace-nowrap px-8 py-4 font-display-lg text-4xl leading-none text-secondary-fixed sm:px-12 sm:text-5xl md:text-6xl [text-shadow:0_4px_30px_rgba(0,0,0,0.7),0_2px_10px_rgba(0,0,0,0.6)]">
                  12 • 07 • 26
                </h2>
                {/* smooth light sweep gliding across the capsule (elegant, no
                    blink) — clipped to the pill so it stays inside. */}
                {!revealed && (
                  <span
                    className="scratch-shine pointer-events-none absolute inset-0 z-30 block overflow-hidden rounded-full"
                    aria-hidden="true"
                  />
                )}
              </ScratchCard>
            </div>

            {revealed && (
              <div className="flex flex-col items-center gap-6">
                <div ref={heartRef} className="opacity-0">
                  <HeartCenterpiece />
                </div>
                <div ref={namesRef} className="opacity-0">
                  <Countdown />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
