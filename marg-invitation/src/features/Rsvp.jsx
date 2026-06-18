import { useLayoutEffect, useRef } from "react";
import { gsap } from "../lib/gsap";
import { useResponsive } from "../hooks/useResponsive";

const PAPER = "https://www.transparenttextures.com/patterns/natural-paper.png";

/**
 * Rsvp — temple-door set-piece: two maroon doors cover the form, then part
 * (slide off-screen) as the section scrolls to center. Scrub-linked → reverses.
 * Form is visual-only (no backend submit).
 */
export default function Rsvp() {
  const sectionRef = useRef(null);
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const { prefersReducedMotion } = useResponsive();

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(leftRef.current, { xPercent: -100 });
        gsap.set(rightRef.current, { xPercent: 100 });
        return;
      }
      gsap
        .timeline({
          scrollTrigger: {
            trigger: section,
            start: "top center",
            end: "center center",
            scrub: 1,
          },
        })
        .to(leftRef.current, { xPercent: -100, ease: "none" }, 0)
        .to(rightRef.current, { xPercent: 100, ease: "none" }, 0);
    }, section);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="rsvp"
      className="min-h-screen flex items-center justify-center bg-primary text-on-primary relative overflow-hidden"
    >
      {/* Doors */}
      <div
        ref={leftRef}
        className="absolute left-0 top-0 w-1/2 h-full bg-primary z-20 flex items-center justify-end border-r border-secondary/30 will-change-transform"
      >
        <div className="w-full h-full opacity-20" style={{ backgroundImage: `url(${PAPER})` }} />
        <div className="absolute right-4 w-12 h-64 border-l-2 border-secondary/20" />
      </div>
      <div
        ref={rightRef}
        className="absolute right-0 top-0 w-1/2 h-full bg-primary z-20 flex items-center justify-start border-l border-secondary/30 will-change-transform"
      >
        <div className="w-full h-full opacity-20" style={{ backgroundImage: `url(${PAPER})` }} />
        <div className="absolute left-4 w-12 h-64 border-r-2 border-secondary/20" />
      </div>

      {/* Form */}
      <div className="relative z-10 text-center max-w-2xl px-container-padding py-24">
        <h2 className="font-headline-lg text-headline-lg text-secondary-fixed mb-8">
          Join the Celebration
        </h2>
        <p className="font-body-lg text-body-lg mb-12">
          We request the honor of your presence as we begin our new life together.
          Kindly respond by June 15, 2026.
        </p>
        <form className="space-y-8 text-left" onSubmit={(e) => e.preventDefault()}>
          <div className="border-b border-secondary/30 pb-2">
            <label className="font-label-caps text-secondary block mb-1">YOUR NAME</label>
            <input
              type="text"
              placeholder="Full Name"
              className="w-full bg-transparent border-none p-0 focus:ring-0 text-2xl font-headline-md placeholder:text-on-primary/20"
            />
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div className="border-b border-secondary/30 pb-2">
              <label className="font-label-caps text-secondary block mb-1">GUESTS</label>
              <input
                type="number"
                min="1"
                defaultValue="1"
                className="w-full bg-transparent border-none p-0 focus:ring-0 text-2xl font-headline-md"
              />
            </div>
            <div className="border-b border-secondary/30 pb-2">
              <label className="font-label-caps text-secondary block mb-1">EVENTS</label>
              <select className="w-full bg-transparent border-none p-0 focus:ring-0 text-xl font-headline-md appearance-none">
                <option className="bg-primary">All Ceremonies</option>
                <option className="bg-primary">Muhurtham Only</option>
                <option className="bg-primary">Reception Only</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-secondary text-on-secondary py-6 font-label-caps text-label-caps tracking-[0.3em] hover:bg-secondary-fixed hover:text-on-secondary-fixed transition-all"
          >
            SEND BLESSINGS &amp; RSVP
          </button>
        </form>
      </div>
    </section>
  );
}
