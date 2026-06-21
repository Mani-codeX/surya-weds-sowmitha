import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "../lib/gsap";
import { splitChars } from "../lib/animations";
import { useResponsive } from "../hooks/useResponsive";
import Section from "../components/ui/Section";
import Reveal from "../components/ui/Reveal";
import { useImageReveal } from "../hooks/useAnimations";
import { IMG } from "../lib/content";

const MILESTONES = [
  { year: "2017", label: "Friendship Day" },
  { year: "2020", label: "Falling in love" },
  { year: "2023", label: "Promised forever" },
  { year: "2026", label: "Our wedding" },
];

const HeartGlyph = ({ ref, className = "" }) => (
  <svg ref={ref} viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path
      d="M12 21s-7.5-4.6-10-9.3C.3 8.4 1.9 5 5.2 5c2 0 3.3 1.1 4.1 2.3l.3.5.3-.5C10.7 6.1 12 5 14 5c3.3 0 4.9 3.4 3.2 6.7C19.5 16.4 12 21 12 21z"
      fill="currentColor"
    />
  </svg>
);

/** Heritage / Love Story — image + narrative with a gold heart-line accent
 *  below the label and a split-text heading reveal (scroll-triggered, once). */
export default function Heritage() {
  const imgRef = useImageReveal();
  const narrativeRef = useRef(null);
  const headingRef = useRef(null);
  const tlLineRef = useRef(null);
  const tlStopsRef = useRef(null);
  const { prefersReducedMotion } = useResponsive();

  useLayoutEffect(() => {
    const root = narrativeRef.current;
    if (!root) return;
    const ctx = gsap.context(() => {
      const stops = tlStopsRef.current.children;

      if (prefersReducedMotion) {
        gsap.set(tlLineRef.current, { scaleX: 1 });
        gsap.set(stops, { opacity: 1, y: 0 });
        return;
      }

      const chars = splitChars(headingRef.current);
      gsap.set(chars, { opacity: 0, yPercent: 60 });
      gsap.set(tlLineRef.current, { scaleX: 0 });
      gsap.set(stops, { opacity: 0, y: 14 });

      // Heading reveal — triggered by the narrative column.
      gsap.fromTo(
        chars,
        { opacity: 0, yPercent: 60 },
        {
          opacity: 1,
          yPercent: 0,
          duration: 1.2,
          stagger: 0.025,
          ease: "power3.out",
          scrollTrigger: { trigger: root, start: "top 80%", once: true },
        }
      );

      // Timeline — its OWN trigger anchored to the timeline element, so it
      // animates exactly when the timeline scrolls into view (works on mobile,
      // where the image stacks above and the column top is reached early).
      const timelineEl = tlStopsRef.current.parentElement;
      const tlTimeline = gsap.timeline({
        scrollTrigger: { trigger: timelineEl, start: "top 88%", once: true },
      });
      tlTimeline
        .to(tlLineRef.current, { scaleX: 1, duration: 1, ease: "power2.inOut", transformOrigin: "left center" })
        .to(stops, { opacity: 1, y: 0, duration: 0.5, stagger: 0.18, ease: "back.out(1.6)" }, 0.4);

      ScrollTrigger.refresh();
    }, root);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <Section id="heritage" className="relative overflow-hidden">
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-grid-gutter items-center">
        {/* Image */}
        <div className="md:col-span-5 relative group">
          <div
            ref={imgRef}
            className="aspect-[3/4] overflow-hidden rounded-lg shadow-2xl border-4 border-secondary/20 grayscale-[0.2]"
          >
            <img
              src={IMG.heritage}
              alt="Intricate Thanjavur painting with gold foil"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
            />
          </div>
          <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-primary-container p-6 rounded-lg text-on-primary shadow-xl hidden md:block">
            <p className="font-label-caps text-xs tracking-widest mb-4">ESTD. 2026</p>
            <p className="font-headline-md text-xl leading-tight">
              Carrying forward the Chola Legacy
            </p>
          </div>
        </div>

        {/* Narrative */}
        <div ref={narrativeRef} className="md:col-span-6 md:col-start-7 flex flex-col gap-element-gap">
          <Reveal as="span" from="fadeUp" className="font-label-caps text-label-caps text-secondary">
            A LOVE STORY
          </Reveal>

          <h2 ref={headingRef} className="font-headline-lg text-3xl leading-tight text-primary md:text-headline-lg">
            When Friendship Became Forever
          </h2>

          <Reveal as="p" from="fadeUp" delay={0.1} className="font-body-lg text-sm leading-relaxed text-on-surface-variant md:text-body-lg">
            It all began on Friendship Day, the first Sunday of August 2017. What
            started as a beautiful friendship grew stronger with each passing day,
            and somewhere along the way, friendship blossomed into love. Through
            dreams, distance, and countless ups and downs, we stood by each other
            with unwavering faith. Together, we focused on our careers, celebrated
            every victory, embraced every challenge, and proved that true love
            knows no boundaries. With the blessings of our families and hearts
            full of gratitude, we now begin the beautiful forever we once dreamed
            of.
          </Reveal>

          {/* Journey timeline — fills the space below the story; the line draws
              and the milestone stops rise in, in sync with the heading. */}
          <div className="relative mt-8">
            {/* the drawn gold line behind the dots */}
            <span
              ref={tlLineRef}
              className="absolute left-0 right-0 top-[7px] block h-px origin-left bg-gradient-to-r from-secondary-fixed/60 via-secondary-fixed/60 to-secondary-fixed/60"
              style={{ transform: "scaleX(0)" }}
              aria-hidden="true"
            />
            <ol ref={tlStopsRef} className="relative flex items-start justify-between">
              {MILESTONES.map((m) => (
                <li key={m.year} className="flex flex-col items-center text-center" style={{ opacity: 0 }}>
                  <HeartGlyph className="h-3.5 w-3.5 text-secondary-fixed" />
                  <span className="mt-3 font-label-caps text-[0.7rem] tracking-[0.2em] text-secondary">
                    {m.year}
                  </span>
                  <span className="mt-1 max-w-[6rem] font-body-md text-xs text-on-surface-variant/80">
                    {m.label}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </Section>
  );
}
