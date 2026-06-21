import { useLayoutEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "../lib/gsap";
import Section from "../components/ui/Section";
import Reveal from "../components/ui/Reveal";
import QRCode from "../components/QRCode";
import ShareDialog from "../components/ShareDialog";
import { MapPin, Share2 } from "../lib/icons";
import { useImageReveal } from "../hooks/useAnimations";
import { useResponsive } from "../hooks/useResponsive";
import { IMG, VENUE, VENUE_SHARE_MESSAGE } from "../lib/content";

/** Venue — narrative + framed venue image with a scannable directions QR card. */
export default function Venue() {
  const imgRef = useImageReveal();
  const qrRef = useRef(null);
  const [shareOpen, setShareOpen] = useState(false);
  const { isMobile, prefersReducedMotion } = useResponsive();

  // The QR card springs in only AFTER the venue image has finished its reveal
  // wipe — so the order reads: image loads/wipes → then the QR pops on.
  useLayoutEffect(() => {
    const el = qrRef.current;
    if (!el) return;
    if (prefersReducedMotion) {
      gsap.set(el, { autoAlpha: 1, scale: 1, y: 0 });
      return;
    }
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { autoAlpha: 0, scale: 0.7, y: 16 },
        {
          autoAlpha: 1,
          scale: 1,
          y: 0,
          duration: 0.6,
          ease: "back.out(2)",
          delay: 1.1, // wait for the image clip-path wipe (~1.3s) to play
          scrollTrigger: { trigger: imgRef.current, start: "top 80%", once: true },
        }
      );
    }, el);
    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [prefersReducedMotion, imgRef]);

  return (
    <Section id="venue" className="bg-surface-container-low silk-grain">
      <div className="mx-auto max-w-7xl">
        {/* Mobile: heading → image → details (single column, explicit order).
            Desktop: 2-col grid — left column = heading + details (rows 1–2),
            right column = image spanning both rows. */}
        <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-16">
          {/* ── Heading ── */}
          <div className="order-1 md:col-start-1 md:row-start-1 md:self-end">
            <Reveal as="span" from="fadeUp" className="mb-4 block font-label-caps text-label-caps tracking-[0.3em] text-secondary">
              {VENUE.label}
            </Reveal>
            <Reveal as="h2" from="fadeUp" delay={0.05} className="font-headline-lg text-3xl leading-tight text-primary md:text-headline-lg">
              {VENUE.heading}
            </Reveal>
          </div>

          {/* ── Framed image + scannable QR card ── */}
          <div className="order-2 w-full md:col-start-2 md:row-span-2 md:row-start-1">
            <div className="relative border border-outline-variant p-3 sm:p-4">
              <div ref={imgRef} className="aspect-square overflow-hidden">
                <img
                  src={IMG.venue}
                  alt={VENUE.name}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* QR directions card — lower-right corner, springs in after the
                  image reveal. Smaller & tighter on mobile so it sits neatly. */}
              <div
                ref={qrRef}
                className="invisible absolute bottom-3 right-3 flex flex-col items-center gap-1.5 rounded-lg border border-secondary/40 bg-surface/95 p-2 shadow-2xl sm:bottom-6 sm:right-6 sm:gap-2 sm:rounded-xl sm:p-3"
              >
                <span className="absolute -left-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-primary text-on-primary shadow-md sm:h-7 sm:w-7">
                  <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5" strokeWidth={2} fill="currentColor" />
                </span>
                <a
                  href={VENUE.directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Scan or tap for directions to the venue"
                  className="block rounded-md p-0.5 ring-1 ring-secondary/20 sm:p-1"
                >
                  <QRCode
                    value={VENUE.directionsUrl}
                    size={isMobile ? 68 : 104}
                    alt="Scan for directions to the venue"
                    className="rounded-sm"
                  />
                </a>
                <span className="font-label-caps text-[0.5rem] tracking-[0.15em] text-secondary sm:text-[0.6rem] sm:tracking-[0.2em]">
                  SCAN FOR DIRECTIONS
                </span>
              </div>
            </div>
          </div>

          {/* ── Details: description, address, CTAs ── */}
          <div className="order-3 md:col-start-1 md:row-start-2 md:self-start">
            <Reveal as="p" from="fadeUp" delay={0.1} className="mb-7 max-w-xl font-body-lg text-sm leading-relaxed text-on-surface-variant md:text-body-lg">
              {VENUE.description}
            </Reveal>

            {/* Venue name + address — elegant serif, name prestigious, address
                lighter so the hierarchy reads name → address at a glance. */}
            <Reveal from="fadeUp" delay={0.15} className="border-l-2 border-secondary/40 pl-5">
              <div className="mb-2 flex items-center gap-2 text-secondary">
                <MapPin className="h-4 w-4" strokeWidth={1.75} />
                <span className="font-label-caps text-[0.65rem] tracking-[0.3em]">THE LOCATION</span>
              </div>
              <h5 className="font-headline-md text-xl leading-snug text-primary md:text-3xl">
                {VENUE.name}
              </h5>
              <address className="mt-3 not-italic font-quote text-base leading-relaxed text-on-surface-variant/75 md:text-lg">
                {VENUE.address.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>
            </Reveal>

            {/* CTAs — directions (primary) + share (secondary). Side by side on
                desktop, stacked full-width on mobile. */}
            <Reveal from="fadeUp" delay={0.2} className="mt-7 flex flex-col gap-3.5 sm:flex-row">
              {/* Primary — solid maroon, gold sweep on hover */}
              <a
                href={VENUE.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="cta-btn group flex w-full items-center justify-center gap-3 bg-primary px-9 py-4 font-label-caps text-label-caps tracking-widest text-on-primary shadow-[0_10px_30px_rgba(74,4,4,0.25)] hover:shadow-[0_16px_40px_rgba(74,4,4,0.35)] sm:w-auto"
              >
                <MapPin className="cta-icon h-5 w-5" strokeWidth={2} />
                GET DIRECTIONS
              </a>
              {/* Secondary — gold outline that fills with gold on hover */}
              <div className="relative w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setShareOpen((v) => !v)}
                  aria-expanded={shareOpen}
                  className="cta-btn group flex w-full items-center justify-center gap-3 border border-secondary bg-transparent px-9 py-4 font-label-caps text-label-caps tracking-widest text-secondary hover:bg-secondary hover:text-on-secondary sm:w-auto"
                >
                  <Share2 className="cta-icon h-5 w-5" strokeWidth={1.75} />
                  SHARE LOCATION
                </button>
                <ShareDialog
                  open={shareOpen}
                  onClose={() => setShareOpen(false)}
                  shareText={VENUE_SHARE_MESSAGE}
                  mapUrl={VENUE.mapUrl}
                />
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </Section>
  );
}
