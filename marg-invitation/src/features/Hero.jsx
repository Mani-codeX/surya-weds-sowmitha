import { useLayoutEffect, useRef } from "react";
import { gsap } from "../lib/gsap";
import { useResponsive } from "../hooks/useResponsive";
import { COUPLE } from "../lib/content";

/**
 * Hero — a cinematic typographic opening (no card).
 *
 * The names carry their PERMANENT colours at all times (Aparna burgundy, &
 * gold, Raghav burgundy) — nothing ever animates the text fill. The shine is a
 * completely SEPARATE highlight layer that sweeps left→right across the title
 * once on load and fades out. After that the title is static forever.
 *
 * Load sequence (auto, no scroll/interaction needed):
 *   0.0s  background glow + eyebrow fade in
 *   0.3s  title fades in
 *   ~immediately after  → single gold shine sweeps L→R across the title, exits
 *   then  quote / divider / meta / cue settle in; title stays still
 */
export default function Hero() {
  const rootRef = useRef(null);
  const eyebrowRef = useRef(null);
  const namesRef = useRef(null);
  const shineRef = useRef(null);
  const ampRef = useRef(null);
  const glowRef = useRef(null);
  const quoteRef = useRef(null);
  const dividerRef = useRef(null);
  const metaRef = useRef(null);
  const cueRef = useRef(null);
  const petalsRef = useRef(null);
  const { isMobile, prefersReducedMotion } = useResponsive();

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const names = namesRef.current;
      const shine = shineRef.current;
      const amp = ampRef.current;

      // The LETTERS (namesRef) are always solid burgundy and never animate their
      // fill — they can never "disappear". The gold glint lives entirely on the
      // overlay copy (shineRef): it's filled with a gold gradient and clipped to
      // its own text, then REVEALED only inside a soft vertical band via an
      // animated mask. Sliding the mask makes a gold highlight travel across the
      // names exactly once, then rest on the &. Burgundy text underneath stays
      // put the whole time.
      const GOLD =
        "linear-gradient(160deg, #fff3d0 0%, #f4d27a 22%, #d4af37 50%, #b8860b 74%, #8a6508 100%)";
      // Soft glint band centred on --x (a 0..1 fraction of the title width).
      // Opaque (white) at the centre, feathering to transparent ±14% either
      // side — so only a soft vertical strip of the gold overlay shows, and it
      // moves as --x changes. Outside the band the overlay is fully transparent.
      const BAND =
        "linear-gradient(90deg, transparent calc(var(--x) * 100% - 14%), #fff calc(var(--x) * 100%), transparent calc(var(--x) * 100% + 14%))";

      const armShine = () => {
        shine.style.backgroundImage = GOLD;
        shine.style.webkitBackgroundClip = "text";
        shine.style.backgroundClip = "text";
        shine.style.webkitTextFillColor = "transparent";
        shine.style.color = "transparent";
        shine.style.setProperty("--x", "-0.3"); // band starts off the left edge
        shine.style.webkitMaskImage = BAND;
        shine.style.maskImage = BAND;
        shine.style.webkitMaskRepeat = "no-repeat";
        shine.style.maskRepeat = "no-repeat";
        shine.style.opacity = "1";
      };

      // The & centre as a 0..1 fraction of the title width — where the glint must
      // rest. Measured live so it's exact on mobile (stacked) and desktop (one
      // line); re-measurable after the display font loads.
      const ampRestFrac = () => {
        if (!amp) return 0.5;
        const titleBox = names.getBoundingClientRect();
        const ampBox = amp.getBoundingClientRect();
        if (!titleBox.width) return 0.5;
        return (ampBox.left + ampBox.width / 2 - titleBox.left) / titleBox.width;
      };

      // Once the glint rests on the &: lock the & to PERMANENT gold first (so it
      // never blinks back to burgundy), THEN gently fade out the moving overlay.
      // The overlay's GOLD gradient is identical to .hero-amp-settled, so the
      // handoff is seamless — the glint resting on the & simply becomes the
      // permanent gold &. The rest of the names quietly return to burgundy as
      // the overlay fades.
      const settle = () => {
        if (amp) {
          amp.classList.add("hero-amp-settled"); // permanent gold & (stays gold forever)
          gsap.fromTo(
            amp,
            { filter: "brightness(1.25)" },
            { filter: "brightness(1)", duration: 1.2, ease: "sine.out" }
          );
        }
        if (shine) {
          gsap.to(shine, { opacity: 0, duration: 0.6, ease: "sine.out" });
        }
      };

      if (prefersReducedMotion) {
        gsap.set(
          [eyebrowRef.current, names, quoteRef.current, dividerRef.current, metaRef.current, cueRef.current],
          { opacity: 1, y: 0 }
        );
        settle();
        return;
      }

      armShine();

      // Where the glint rests (& centre fraction). Mutable so the font-ready
      // callback can correct it before Pass 2 begins.
      const rest = { frac: ampRestFrac() };

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // background glow + eyebrow
      tl.fromTo(glowRef.current, { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 1.6, ease: "power2.out" }, 0)
        .fromTo(eyebrowRef.current, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.9 }, 0.1)
        // title fades in (burgundy letters, always solid)
        .fromTo(names, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out" }, 0.3)
        // GOLD GLINT — TWO passes. Pass 1: the band starts off the LEFT edge and
        // sweeps the WHOLE way across, exiting past the right edge. Then it
        // resets instantly back off the left (invisible — the band is off-screen
        // so there's no flash). Pass 2: it sweeps in again and decelerates to
        // rest exactly ON the &. Driving the --x CSS var (fraction across the
        // title) moves the masked band; the burgundy letters never change.
        .to(
          shine,
          {
            keyframes: [
              { "--x": 1.3, duration: 2.4, ease: "power1.inOut" },        // PASS 1 — full sweep L→R, exits right
              { "--x": -0.3, duration: 0 },                               // invisible reset off the left
              { "--x": () => rest.frac, duration: 3.0, ease: "power2.out" }, // PASS 2 — sweeps in, decelerates, rests ON the &
            ],
            onComplete: settle,
          },
          1.1
        )
        // supporting elements settle in
        .fromTo(quoteRef.current, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1 }, 1.1)
        .fromTo(dividerRef.current, { scaleX: 0 }, { scaleX: 1, duration: 1, ease: "power2.inOut", transformOrigin: "center" }, 1.3)
        .fromTo(metaRef.current.children, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.15 }, 1.5)
        .fromTo(cueRef.current, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 1 }, 2.0);

      // If the display font loads after first layout it nudges the & a few
      // pixels; re-measure once fonts are ready so the glint still rests
      // dead-centre on the &. The tween reads rest.frac live.
      if (document.fonts?.ready) {
        document.fonts.ready.then(() => {
          rest.frac = ampRestFrac();
        });
      }

      // SCROLL CUE — animated "go down" invitation, all transform/opacity (cheap):
      //  • a gold glint repeatedly travels DOWN the track (the "scroll" hint)
      //  • the whole cue gently bobs down-and-up
      //  • the label softly breathes in opacity
      // A short repeatDelay between dot runs reads as a calm, deliberate pulse.
      gsap.to(".hero-cue-dot", {
        repeat: -1,
        repeatDelay: 0.5,
        keyframes: [
          { yPercent: -120, opacity: 0, duration: 0 },          // start above the track, hidden
          { opacity: 1, duration: 0.4, ease: "sine.out" },      // fade in near the top
          { yPercent: 320, opacity: 0, duration: 1.1, ease: "power1.in" }, // glide down, fading out at the bottom
        ],
      });
      gsap.to(cueRef.current, { y: 8, repeat: -1, yoyo: true, duration: 1.6, ease: "sine.inOut" });
      gsap.to(".hero-cue-label", { opacity: 0.55, repeat: -1, yoyo: true, duration: 1.6, ease: "sine.inOut" });
      // chevron gently nudges down and back, fading at the bottom — a soft "↓"
      gsap.fromTo(
        ".hero-cue-arrow",
        { y: -2, opacity: 0.45 },
        { y: 4, opacity: 1, repeat: -1, yoyo: true, duration: 1.4, ease: "sine.inOut" }
      );

      // rose petals — slow, low density, recycled
      petalsRef.current.querySelectorAll(".hero-petal").forEach((petal, i) => {
        const drift = () => {
          gsap.set(petal, {
            xPercent: gsap.utils.random(0, 95),
            yPercent: -8,
            opacity: 0,
            rotation: gsap.utils.random(0, 360),
            scale: gsap.utils.random(0.7, 1.15),
          });
          const dur = gsap.utils.random(13, 20);
          gsap
            .timeline({ onComplete: drift })
            .to(petal, { opacity: gsap.utils.random(0.3, 0.55), duration: 3 }, 0)
            .to(petal, { yPercent: 1200, xPercent: `+=${gsap.utils.random(-25, 25)}`, rotation: `+=${gsap.utils.random(120, 320)}`, duration: dur, ease: "none" }, 0)
            .to(petal, { opacity: 0, duration: 3.5 }, dur - 3.5);
        };
        gsap.delayedCall(i * gsap.utils.random(2, 4) + 1, drift);
      });
    }, root);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section
      ref={rootRef}
      id="hero"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-mobile-margin md:px-container-padding text-center py-20 md:py-0"
    >
      {/* warm radial glow centerpiece */}
      <div
        ref={glowRef}
        className="pointer-events-none absolute left-1/2 top-1/2 h-[120vmin] w-[120vmin] -translate-x-1/2 -translate-y-1/2 opacity-0"
        style={{
          background:
            "radial-gradient(circle, rgba(254,212,136,0.28), rgba(255,222,165,0.10) 40%, transparent 70%)",
        }}
      />
      {/* subtle kolam heritage wash */}
      <div className="pointer-events-none absolute inset-0 kolam-bg opacity-20" />

      {/* rose petals */}
      <div ref={petalsRef} className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {Array.from({ length: isMobile ? 3 : 6 }).map((_, i) => (
          <span
            key={i}
            className="hero-petal absolute left-0 top-0 h-3.5 w-3 will-change-transform"
            style={{
              borderRadius: "100% 0 100% 0",
              background:
                "radial-gradient(120% 120% at 30% 20%, rgba(210,106,95,0.9), rgba(157,65,57,0.85) 55%, rgba(74,4,4,0.55))",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <p
          ref={eyebrowRef}
          className="mb-6 font-label-caps text-label-caps tracking-[0.4em] text-secondary opacity-0"
        >
          WITH JOY IN OUR HEARTS AND BLESSINGS FROM OUR FAMILIES
        </p>

        {/* Title — names stack on mobile (Surya / & / Sowmitha) so they never
            overflow the viewport; on md+ they sit on one line. max-w-full keeps
            the one-line layout inside the screen on narrow desktops.

            The LETTERS are always solid burgundy and never disappear. The gold
            "shine" is a SEPARATE overlay (shineRef) — an exact copy of the same
            text filled with a gold gradient and revealed only inside a soft
            moving band (a mask). The band sweeps across once and comes to rest
            on the &, so a gold glint travels over the names without ever hiding
            them. After it rests, the & stays permanently gold. */}
        <div className="relative z-10 max-w-full">
          <h1
            ref={namesRef}
            className="flex max-w-full flex-col items-center gap-1 font-display-lg leading-[0.95] text-[clamp(2.5rem,10vw,8rem)] text-primary opacity-0 md:flex-row md:flex-wrap md:justify-center md:gap-x-5"
          >
            <span>{COUPLE.groom}</span>
            <span ref={ampRef} className="hero-amp leading-none">
              &amp;
            </span>
            <span>{COUPLE.bride}</span>
          </h1>

          {/* Gold shine overlay — pixel-perfect copy stacked on top, aria-hidden
              so it isn't announced twice. Filled gold, revealed by a moving mask. */}
          <div
            ref={shineRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 flex max-w-full flex-col items-center gap-1 font-display-lg leading-[0.95] text-[clamp(2.5rem,10vw,8rem)] opacity-0 md:flex-row md:flex-wrap md:justify-center md:gap-x-5"
          >
            <span>{COUPLE.groom}</span>
            <span className="leading-none">&amp;</span>
            <span>{COUPLE.bride}</span>
          </div>
        </div>

        <p
          ref={quoteRef}
          className="mt-6 md:mt-8 max-w-xl font-quote text-xl md:text-quote italic text-on-surface-variant opacity-0"
        >
          Two souls, one promise, and a lifetime of love.
        </p>

        {/* gold ornamental divider */}
        <div className="mt-7 md:mt-10 flex items-center gap-4">
          <span
            ref={dividerRef}
            className="block h-px w-32 md:w-56 origin-center bg-gradient-to-r from-transparent via-secondary to-transparent"
          />
        </div>

        <div ref={metaRef} className="mt-7 md:mt-10 flex flex-col items-center gap-3 font-label-caps text-label-caps tracking-[0.25em] text-primary md:flex-row md:gap-10">
          <span className="opacity-0">JULY 12, 2026</span>
          <span className="hidden h-4 w-px bg-secondary/50 md:block opacity-0" />
          <span className="opacity-0">BODINAYAKANUR, TAMIL NADU</span>
        </div>
      </div>

      {/* Premium scroll cue — a gold glint travels DOWN the line on a loop, the
          whole cue gently bobs, and the label softly breathes: a clear, elegant
          "scroll down to begin" invitation.

          Mobile: sits in normal flow (relative) with a top margin, so it can
          NEVER overlap the meta text however short the viewport is. Desktop:
          pinned to the bottom of the hero as before. */}
      <div ref={cueRef} className="relative mt-14 flex flex-col items-center gap-3 opacity-0 md:absolute md:bottom-10 md:left-0 md:right-0 md:mt-0">
        <span className="hero-cue-label font-label-caps text-[0.7rem] tracking-[0.35em] text-secondary">
          BEGIN THE JOURNEY
        </span>
        {/* track + a travelling light dot */}
        <span className="relative block h-12 w-px overflow-hidden bg-linear-to-b from-secondary/40 to-transparent">
          <span className="hero-cue-dot absolute left-1/2 top-0 h-3 w-px -translate-x-1/2 bg-linear-to-b from-transparent via-secondary to-transparent" />
        </span>
        {/* thin chevron arrow — gently drifts down, reinforcing "scroll down" */}
        <svg
          className="hero-cue-arrow -mt-1 h-3 w-4 text-secondary"
          viewBox="0 0 16 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M2 3l6 6 6-6" />
        </svg>
      </div>
    </section>
  );
}
