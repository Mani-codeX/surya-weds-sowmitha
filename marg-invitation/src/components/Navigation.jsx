import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "../lib/gsap";
import { Menu, X } from "../lib/icons";

const LINKS = [
  { href: "#heritage", label: "Heritage" },
  { href: "#garland", label: "Garland Exchange" },
  { href: "#rituals", label: "Ceremony" },
  { href: "#venue", label: "Venue" },
  { href: "#gallery", label: "Gallery" },
];

/**
 * Navigation — no permanent header. A single minimal floating menu button
 * (top-right, desktop + mobile) opens a cinematic fullscreen overlay:
 *   - the overlay fades/scales in, links reveal in a staggered cascade,
 *   - clicking a link smooth-scrolls (Lenis-friendly anchor) and closes.
 *
 * Transforms + opacity only — no backdrop-filter, no blur.
 */
export default function Navigation() {
  const [open, setOpen] = useState(false);
  const overlayRef = useRef(null);
  const listRef = useRef(null);

  // Animate the overlay open/close.
  useLayoutEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    const ctx = gsap.context(() => {
      if (open) {
        gsap.set(overlay, { display: "flex" });
        gsap.fromTo(
          overlay,
          { opacity: 0 },
          { opacity: 1, duration: 0.5, ease: "power2.out" }
        );
        gsap.fromTo(
          listRef.current.children,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease: "power3.out", delay: 0.15 }
        );
      } else {
        gsap.to(overlay, {
          opacity: 0,
          duration: 0.4,
          ease: "power2.in",
          onComplete: () => gsap.set(overlay, { display: "none" }),
        });
      }
    });
    return () => ctx.revert();
  }, [open]);

  // Lock body scroll while the overlay is open.
  useLayoutEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Floating menu button — luxury, minimal, top-right */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="fixed top-6 right-6 z-[80] flex h-12 w-12 items-center justify-center rounded-full border border-secondary/40 bg-surface/90 text-primary shadow-lg transition-transform duration-300 hover:scale-105"
      >
        <Menu className="h-5 w-5" strokeWidth={1.5} />
      </button>

      {/* Fullscreen overlay */}
      <div
        ref={overlayRef}
        style={{ display: "none" }}
        className="fixed inset-0 z-[90] hidden flex-col items-center justify-center bg-primary text-on-primary"
      >
        {/* subtle kolam texture for heritage depth */}
        <div className="absolute inset-0 kolam-bg opacity-20" />

        {/* close */}
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close menu"
          className="absolute top-6 right-6 flex h-12 w-12 items-center justify-center rounded-full border border-secondary-fixed/40 text-secondary-fixed transition-transform duration-300 hover:rotate-90"
        >
          <X className="h-5 w-5" strokeWidth={1.5} />
        </button>

        <span className="relative mb-10 font-label-caps text-label-caps tracking-[0.4em] text-secondary-fixed">
          SOWMITHA &amp; SURYA
        </span>

        <nav ref={listRef} className="relative flex flex-col items-center gap-6 md:gap-8">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="font-headline-lg text-4xl md:text-6xl text-on-primary transition-colors duration-300 hover:text-secondary-fixed"
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* gold ornamental divider */}
        <div className="relative mt-12 h-px w-40 bg-gradient-to-r from-transparent via-secondary-fixed/60 to-transparent" />
      </div>
    </>
  );
}
