import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "../lib/gsap";
import { useResponsive } from "../hooks/useResponsive";
import HeartCenterpiece from "../components/HeartCenterpiece";
import { IMG } from "../lib/content";


export default function GarlandExchange() {
  const sectionRef = useRef(null);
  const groomRef = useRef(null);
  const brideRef = useRef(null);
  const lineRef = useRef(null);
  const heartRef = useRef(null);
  const contentRef = useRef(null);
  const { isMobile, prefersReducedMotion } = useResponsive();

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set([groomRef.current, brideRef.current], { x: 0 });
        gsap.set(lineRef.current, { scaleX: 1 });
        gsap.set(heartRef.current, { scale: 1, opacity: 1 });
        return;
      }

      // Start: portraits HIDDEN and far apart on the sides; everything is
      // revealed gradually as the user scrolls (scrub).
      const spread = isMobile ? 80 : 220;
      gsap.set(groomRef.current, { x: -spread, opacity: 0, scale: 0.92 });
      gsap.set(brideRef.current, { x: spread, opacity: 0, scale: 0.92 });
      gsap.set(lineRef.current, { scaleX: 0, transformOrigin: "center center" });
      gsap.set(heartRef.current, { scale: 0, opacity: 0 });

      // how far the portraits draw in toward the centre at the end (gentle —
      // they end up closer, but with a comfortable gap, not touching).
      const close = isMobile ? 4 : 14;

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          // long distance → the whole thing plays slowly as you scroll
          end: "+=260%",
          scrub: 1,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      tl
        // 1. groom fades in from the left and glides toward the centre
        .to(groomRef.current, { x: 0, opacity: 1, scale: 1, duration: 1.6 }, 0)
        // 2. bride fades in from the right and glides toward the centre
        .to(brideRef.current, { x: 0, opacity: 1, scale: 1, duration: 1.6 }, 0.3)
        // 3. the gold line grows from the centre, joining them
        .to(lineRef.current, { scaleX: 1, duration: 1.2, ease: "power2.inOut" }, 2.1)
        // 4. the heart pops in on the line once it completes
        .to(heartRef.current, { opacity: 1, scale: 1.2, duration: 0.6, ease: "back.out(2)" }, 3.1)
        .to(heartRef.current, { scale: 1, duration: 0.4, ease: "power2.out" }, 3.7)
        // 5. both portraits draw a little closer so the line fully joins them
        .to(groomRef.current, { x: close, duration: 0.9, ease: "power1.inOut" }, 3.9)
        .to(brideRef.current, { x: -close, duration: 0.9, ease: "power1.inOut" }, 3.9)
        // hold the composed moment
        .to({}, { duration: 0.6 })
        // 6. graceful EXIT — the whole composition lifts + fades as you scroll
        //    past, so leaving the section feels intentional and premium.
        .to(contentRef.current, { y: -70, opacity: 0, duration: 1, ease: "power2.in" });

      ScrollTrigger.refresh();
    }, section);
    return () => ctx.revert();
  }, [isMobile, prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="garland"
      className="min-h-screen flex items-center justify-center bg-surface-container-low relative overflow-hidden"
    >
      <div className="absolute inset-0 kolam-bg opacity-30" />
      <div ref={contentRef} className="w-full max-w-6xl px-mobile-margin md:px-container-padding text-center">
        <h3 className="font-headline-lg text-3xl md:text-headline-lg text-primary mb-12 md:mb-20">
          From Friendship to Forever
        </h3>

        {/* Portrait row — portraits sit CLOSE with only a narrow centre gap, so
            the couple feels together and the line truly joins them. */}
        <div className="relative flex items-start justify-center gap-0">
          {/* Groom */}
          <div ref={groomRef} className="relative z-10 will-change-transform">
            <div className="w-[36vw] max-w-[220px] sm:max-w-[250px] md:w-72 md:max-w-none aspect-[3/4.4] overflow-hidden rounded-t-full border-2 border-secondary/50 p-1">
              <img src={IMG.groom} alt="Surya" className="w-full h-full object-cover" />
            </div>
            <p className="mt-3 md:mt-4 font-label-caps text-xs sm:text-sm md:text-base tracking-[0.2em] text-secondary">
              SURYA
            </p>
          </div>

          {/* Center — NARROW gap; the line spans it (extending slightly under
              each card so it joins them) + heart centred on the line. */}
          <div className="relative flex w-24 flex-none flex-col items-center justify-center self-start aspect-[3/4.4] max-h-[230px] sm:max-h-[280px] md:max-h-[400px] sm:w-32 md:w-44">
            <div
              ref={lineRef}
              className="absolute left-0 right-0 top-[82%] h-1 -translate-y-1/2 origin-center rounded-full bg-secondary-fixed shadow-[0_0_15px_rgba(233,193,118,0.5)]"
            />
            <div className="absolute left-1/2 top-[82%] z-10 -translate-x-1/2 -translate-y-1/2">
              <div ref={heartRef} className="will-change-transform">
                <HeartCenterpiece size={isMobile ? 44 : 64} />
              </div>
            </div>
          </div>

          {/* Bride */}
          <div ref={brideRef} className="relative z-10 will-change-transform">
            <div className="w-[36vw] max-w-[220px] sm:max-w-[250px] md:w-72 md:max-w-none aspect-[3/4.4] overflow-hidden rounded-t-full border-2 border-secondary/50 p-1">
              <img src={IMG.bride} alt="Sowmitha" className="w-full h-full object-cover" />
            </div>
            <p className="mt-3 md:mt-4 font-label-caps text-xs sm:text-sm md:text-base tracking-[0.2em] text-secondary">
              SOWMITHA
            </p>
          </div>
        </div>

        <p className="mx-auto mt-12 md:mt-16 max-w-lg font-body-lg text-base md:text-body-lg text-on-surface-variant">
          From best friends to soulmates, and now to bride and groom ✨ Every
          chapter of our story led us to this beautiful forever.
        </p>
      </div>
    </section>
  );
}
