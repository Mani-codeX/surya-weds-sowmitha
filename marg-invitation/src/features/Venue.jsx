import { useLayoutEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "../lib/gsap";
import Section from "../components/ui/Section";
import Reveal from "../components/ui/Reveal";
import Button from "../components/ui/Button";
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
        <div className="flex flex-col items-center gap-12 md:flex-row md:gap-16">
          {/* ── Narrative ── */}
          <div className="order-2 flex-1 md:order-1">
            <Reveal as="span" from="fadeUp" className="mb-4 block font-label-caps text-label-caps tracking-[0.3em] text-secondary">
              {VENUE.label}
            </Reveal>
            <Reveal as="h2" from="fadeUp" delay={0.05} className="mb-7 font-headline-lg text-headline-lg text-primary">
              {VENUE.heading}
            </Reveal>
            <Reveal as="p" from="fadeUp" delay={0.1} className="mb-10 max-w-xl font-body-lg text-body-lg leading-relaxed text-on-surface-variant">
              {VENUE.description}
            </Reveal>

            {/* Venue name + address — elegant serif, name prestigious, address
                lighter so the hierarchy reads name → address at a glance. */}
            <Reveal from="fadeUp" delay={0.15} className="border-l-2 border-secondary/40 pl-5">
              <div className="mb-2 flex items-center gap-2 text-secondary">
                <MapPin className="h-4 w-4" strokeWidth={1.75} />
                <span className="font-label-caps text-[0.65rem] tracking-[0.3em]">THE LOCATION</span>
              </div>
              <h5 className="font-headline-md text-2xl leading-snug text-primary md:text-3xl">
                {VENUE.name}
              </h5>
              <address className="mt-3 not-italic font-quote text-lg leading-relaxed text-on-surface-variant/75">
                {VENUE.address.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>
            </Reveal>

            {/* CTAs — directions (primary) + share (secondary). Side by side on
                desktop, stacked full-width on mobile. */}
            <Reveal from="fadeUp" delay={0.2} className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Button
                as="a"
                href={VENUE.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                variant="primary"
                className="flex w-full items-center justify-center gap-3 px-9 py-4 tracking-widest hover:bg-secondary sm:w-auto"
              >
                <MapPin className="h-5 w-5" strokeWidth={2} />
                GET DIRECTIONS
              </Button>
              <div className="relative w-full sm:w-auto">
                <Button
                  as="button"
                  type="button"
                  onClick={() => setShareOpen((v) => !v)}
                  variant="secondary"
                  aria-expanded={shareOpen}
                  className="flex w-full items-center justify-center gap-3 px-9 py-4 tracking-widest sm:w-auto"
                >
                  <Share2 className="h-5 w-5" strokeWidth={1.75} />
                  SHARE LOCATION
                </Button>
                <ShareDialog
                  open={shareOpen}
                  onClose={() => setShareOpen(false)}
                  shareText={VENUE_SHARE_MESSAGE}
                  mapUrl={VENUE.mapUrl}
                />
              </div>
            </Reveal>
          </div>

          {/* ── Framed image + scannable QR card ── */}
          <div className="order-1 w-full flex-1 md:order-2">
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
        </div>
      </div>
    </Section>
  );
}
