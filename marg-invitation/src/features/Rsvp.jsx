import { useLayoutEffect, useRef } from "react";
import { gsap } from "../lib/gsap";
import { useResponsive } from "../hooks/useResponsive";
import ProtectedImage from "../components/ProtectedImage";
import { WED_IMG } from "../lib/weddingImages";
import { COUPLE } from "../lib/content";

const PAPER = "https://www.transparenttextures.com/patterns/natural-paper.png";

/**
 * Rsvp — temple-door set-piece: two maroon doors cover the form, then part
 * (slide off-screen) as the section scrolls to center. Scrub-linked → reverses.
 * Form is visual-only (no backend submit).
 */
export default function Rsvp() {
  const sectionRef = useRef(null);
  const doorWrapRef = useRef(null);
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const closingRef = useRef(null);
  const { prefersReducedMotion } = useResponsive();

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const ctx = gsap.context(() => {
      const closing = closingRef.current.children;

      if (prefersReducedMotion) {
        gsap.set(leftRef.current, { xPercent: -100 });
        gsap.set(rightRef.current, { xPercent: 100 });
        gsap.set(closing, { opacity: 1, y: 0 });
        return;
      }

      // Doors part as the invitation viewport scrolls into view.
      gsap
        .timeline({
          scrollTrigger: {
            trigger: doorWrapRef.current,
            start: "top 75%",
            end: "center 60%",
            scrub: 1,
          },
        })
        .to(leftRef.current, { xPercent: -100, ease: "none" }, 0)
        .to(rightRef.current, { xPercent: 100, ease: "none" }, 0);

      // Closing monogram + lines rise in once they enter.
      gsap.fromTo(
        closing,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: { trigger: closingRef.current, start: "top 85%", once: true },
        }
      );
    }, section);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="rsvp"
      className="bg-primary text-on-primary relative"
    >
      {/* Invitation viewport — doors cover it, then part as you scroll in. */}
      <div ref={doorWrapRef} className="relative flex h-screen w-full items-center justify-center overflow-hidden">
        {/* Doors (scoped to the image area only) */}
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

        {/* Invitation — rotated 90° to read left→right, contained to the view. */}
        <div className="relative z-10 flex h-full w-full items-center justify-center overflow-hidden p-4">
          <ProtectedImage
            src={WED_IMG.invitation}
            alt="Surya & Sowmitha — Wedding Invitation"
            className="max-w-none -rotate-90 rounded-lg object-contain shadow-2xl"
            style={{ maxHeight: "94vw", maxWidth: "88vh", height: "auto", width: "auto" }}
            loading="eager"
          />
        </div>
      </div>

      {/* Monogram + warm invitation line — sits right below the invitation,
          rises in on scroll. Pulled up so there is no empty gap after the
          contained image. */}
      <div ref={closingRef} className="relative z-10 -mt-[34vh] px-mobile-margin pb-20 pt-0 text-center md:-mt-[18vh] md:px-container-padding md:pb-24">
        <h2 className="font-display-lg text-5xl text-secondary-fixed md:text-display-lg">
          {COUPLE.initials}
        </h2>
        <div className="mx-auto mt-4 h-px w-20 bg-secondary-fixed md:w-24" />
        <p className="mx-auto mt-7 max-w-md font-quote text-lg italic leading-relaxed text-secondary-fixed md:mt-10 md:max-w-2xl md:text-3xl">
          With hearts full of joy, we lovingly invite you to be part of our
          special day.
        </p>
        <p className="mx-auto mt-3 max-w-sm font-body-lg text-sm leading-relaxed text-on-primary/75 md:max-w-xl md:text-base">
          Your presence and blessings mean the world to us. Kindly do come and
          shower the couple with your love.
        </p>
      </div>
    </section>
  );
}
