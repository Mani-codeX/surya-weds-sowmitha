import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "../lib/gsap";
import { useResponsive } from "../hooks/useResponsive";
import HeartCenterpiece from "../components/HeartCenterpiece";
import { IMG } from "../lib/content";

/**
 * GarlandExchange — the emotional centerpiece. Pinned + scrubbed, it plays a
 * choreographed sequence as the user scrolls:
 *
 *   1. Raghav portrait slides in from the left  (x -120→0, opacity, scale 0.9→1)
 *   2. Aparna portrait slides in from the right (x +120→0, opacity, scale 0.9→1)
 *   3. The gold "destiny" line grows from the center (scaleX 0→1)
 *   4. The heart pops in (scale 0 → 1.2 → 1, opacity) — its own glow pulse
 *   5. Both portraits drift subtly toward each other (Raghav +20, Aparna -20)
 *
 * Everything is scrub-linked → it plays forward on scroll-down and rewinds on
 * scroll-up. Transforms + opacity only (GPU). The line uses scaleX (not width)
 * so nothing triggers layout. A few rose petals drift while the section lives.
 */
export default function GarlandExchange() {
  const sectionRef = useRef(null);
  const groomRef = useRef(null);
  const brideRef = useRef(null);
  const lineRef = useRef(null);
  const heartRef = useRef(null);
  const petalsRef = useRef(null);
  const { isMobile, prefersReducedMotion } = useResponsive();

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Reduced motion: show the final composed state, no scrub/pin.
      if (prefersReducedMotion) {
        gsap.set([groomRef.current, brideRef.current], { x: 0, opacity: 1, scale: 1 });
        gsap.set(lineRef.current, { scaleX: 1 });
        gsap.set(heartRef.current, { scale: 1, opacity: 1 });
        return;
      }

      // Initial hidden states.
      gsap.set(groomRef.current, { x: -120, opacity: 0, scale: 0.9 });
      gsap.set(brideRef.current, { x: 120, opacity: 0, scale: 0.9 });
      gsap.set(lineRef.current, { scaleX: 0, transformOrigin: "center center" });
      gsap.set(heartRef.current, { scale: 0, opacity: 0 });

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          // enough scroll distance for the 5 beats to read clearly
          end: "+=140%",
          scrub: 1,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      tl
        // STEP 1 — Raghav slides in from the left
        .to(groomRef.current, { x: 0, opacity: 1, scale: 1, duration: 1.2 }, 0)
        // STEP 2 — Aparna slides in from the right (slightly after)
        .to(brideRef.current, { x: 0, opacity: 1, scale: 1, duration: 1.2 }, 0.6)
        // STEP 3 — the destiny line grows from the center
        .to(lineRef.current, { scaleX: 1, duration: 1, ease: "power2.inOut" }, 1.7)
        // STEP 4 — heart pops in (0 → 1.2 → 1)
        .to(heartRef.current, { opacity: 1, scale: 1.2, duration: 0.6, ease: "back.out(2)" }, 2.5)
        .to(heartRef.current, { scale: 1, duration: 0.4, ease: "power2.out" }, 3.1)
        // STEP 5 — both portraits drift subtly toward each other
        .to(groomRef.current, { x: 20, duration: 0.8, ease: "sine.inOut" }, 3.4)
        .to(brideRef.current, { x: -20, duration: 0.8, ease: "sine.inOut" }, 3.4)
        // brief hold so the composed moment lingers
        .to({}, { duration: 0.6 });

      // ── Rose petals: scoped to this section, slow drift, low density ──
      const petals = petalsRef.current.querySelectorAll(".ge-petal");
      petals.forEach((petal, i) => {
        const drift = () => {
          gsap.set(petal, {
            xPercent: gsap.utils.random(0, 90),
            yPercent: -10,
            opacity: 0,
            rotation: gsap.utils.random(0, 360),
            scale: gsap.utils.random(0.7, 1.1),
          });
          const dur = gsap.utils.random(11, 18);
          gsap
            .timeline({ onComplete: drift })
            .to(petal, { opacity: gsap.utils.random(0.35, 0.6), duration: 2.5 }, 0)
            .to(petal, { yPercent: 1000, xPercent: `+=${gsap.utils.random(-30, 30)}`, rotation: `+=${gsap.utils.random(120, 300)}`, duration: dur, ease: "none" }, 0)
            .to(petal, { opacity: 0, duration: 3 }, dur - 3);
        };
        gsap.delayedCall(i * gsap.utils.random(2, 4), drift);
      });

      ScrollTrigger.refresh();
    }, section);

    return () => ctx.revert();
  }, [isMobile, prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="garland"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-surface-container-low"
    >
      <div className="absolute inset-0 kolam-bg opacity-30" />

      {/* Rose petals layer (scoped to this section) */}
      <div ref={petalsRef} className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {Array.from({ length: isMobile ? 3 : 5 }).map((_, i) => (
          <span
            key={i}
            className="ge-petal absolute left-0 top-0 h-3.5 w-3 will-change-transform"
            style={{
              borderRadius: "100% 0 100% 0",
              background:
                "radial-gradient(120% 120% at 30% 20%, rgba(210,106,95,0.9), rgba(157,65,57,0.85) 55%, rgba(74,4,4,0.6))",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-5xl px-mobile-margin md:px-container-padding py-12 md:py-0 text-center">
        <h3 className="mb-8 md:mb-16 font-headline-lg text-3xl md:text-headline-lg text-primary">
          The Garland Exchange
        </h3>

        {/* Portrait row — tighter gap on desktop so the couple feels connected;
            on mobile the two arches sit close and large (~42vw each). */}
        <div className="relative flex items-center justify-center gap-4 sm:gap-6 md:gap-10">
          {/* Groom */}
          <div ref={groomRef} className="relative z-10 will-change-transform">
            <div className="mx-auto w-[38vw] max-w-[200px] sm:max-w-[230px] md:w-72 md:max-w-none aspect-[3/4.4] overflow-hidden rounded-t-full border-2 border-secondary/50 p-1 shadow-xl">
              <img src={IMG.groom} alt="Raghav" className="h-full w-full object-cover" />
            </div>
            <p className="mt-3 md:mt-5 font-label-caps text-sm sm:text-base md:text-lg tracking-[0.25em] text-secondary">
              RAGHAV
            </p>
          </div>

          {/* Center: destiny line + heart */}
          <div className="flex shrink-0 flex-col items-center justify-center gap-4 md:gap-6">
            <div
              ref={lineRef}
              className="h-1 w-10 sm:w-16 md:w-28 origin-center bg-secondary-fixed shadow-[0_0_15px_rgba(233,193,118,0.5)]"
            />
            <div ref={heartRef} className="will-change-transform">
              <HeartCenterpiece />
            </div>
          </div>

          {/* Bride */}
          <div ref={brideRef} className="relative z-10 will-change-transform">
            <div className="mx-auto w-[38vw] max-w-[200px] sm:max-w-[230px] md:w-72 md:max-w-none aspect-[3/4.4] overflow-hidden rounded-t-full border-2 border-secondary/50 p-1 shadow-xl">
              <img src={IMG.bride} alt="Aparna" className="h-full w-full object-cover" />
            </div>
            <p className="mt-3 md:mt-5 font-label-caps text-sm sm:text-base md:text-lg tracking-[0.25em] text-secondary">
              APARNA
            </p>
          </div>
        </div>

        <p className="mx-auto mt-8 md:mt-14 max-w-lg font-body-lg text-base md:text-body-lg text-on-surface-variant">
          Two souls slowly coming together—witness the Maalai Maatru, where two
          families become one through the exchange of sacred flowers.
        </p>
      </div>
    </section>
  );
}
