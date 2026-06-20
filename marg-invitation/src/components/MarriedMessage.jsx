import { useLayoutEffect, useRef } from "react";
import { gsap } from "../lib/gsap";
import HeartCenterpiece from "./HeartCenterpiece";
import { COUPLE } from "../lib/content";

/**
 * MarriedMessage — shown in the Save-the-Date panel AFTER the wedding
 * (13 July 2026 onward): a warm "Happily Married" blessing with the couple
 * names + date, revealed with a gentle staggered animation. Transform/opacity
 * only; gsap.context cleanup.
 */
export default function MarriedMessage() {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        root.querySelectorAll("[data-rise]"),
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.18, ease: "power3.out" }
      );
      gsap.fromTo(
        root.querySelector("[data-heart]"),
        { opacity: 0, scale: 0 },
        { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.8)", delay: 0.3 }
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="flex flex-col items-center gap-6 text-center">
      <span data-rise className="font-label-caps text-label-caps tracking-[0.4em] text-secondary-fixed-dim">
        WITH GRATITUDE & JOY
      </span>

      <div data-heart>
        <HeartCenterpiece />
      </div>

      <h2 data-rise className="font-display-lg text-4xl italic leading-tight text-secondary-fixed md:text-5xl">
        Happily Married
      </h2>

      <p data-rise className="font-display-lg text-2xl italic text-on-primary md:text-3xl">
        {COUPLE.bride} &amp; {COUPLE.groom}
      </p>

      <p data-rise className="max-w-sm font-body-lg text-sm leading-relaxed text-surface-container-lowest/90 md:text-base">
        With your blessings and love, our forever began on
      </p>

      <span data-rise className="font-label-caps text-label-caps tracking-[0.3em] text-secondary-fixed">
        12 • 07 • 2026
      </span>
    </div>
  );
}
