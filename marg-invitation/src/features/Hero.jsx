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
      const amp = ampRef.current;

      // Gold-foil gradient for the title: base burgundy with a narrow warm-gold
      // highlight band centred in the gradient. Sliding background-position
      // makes that gold highlight glide across the LETTERS (background-clip:text)
      // — gold lettering catching light. Re-asserted up front so a re-run never
      // inherits a leftover settled state.
      const GRAD =
        "linear-gradient(100deg, var(--color-primary) 0%, var(--color-primary) 42%, #c9a24b 47%, #ffe9c2 50%, #c9a24b 53%, var(--color-primary) 58%, var(--color-primary) 100%)";
      const armGradient = () => {
        names.style.backgroundImage = GRAD;
        names.style.backgroundSize = "400% 100%";
        names.style.backgroundPosition = "240% center";
        names.style.webkitBackgroundClip = "text";
        names.style.backgroundClip = "text";
        names.style.webkitTextFillColor = "transparent";
        names.style.color = "transparent";
      };
      // After the passes (the highlight is resting ON the &): names → solid
      // burgundy, & → permanent gold. We swap at peak brightness then gently
      // relax it, so the light "fades" onto the & with no hard cut.
      const settle = () => {
        names.style.backgroundImage = "none";
        names.style.webkitBackgroundClip = "border-box";
        names.style.backgroundClip = "border-box";
        names.style.webkitTextFillColor = "var(--color-primary)";
        names.style.color = "var(--color-primary)";
        if (!amp) return;
        amp.classList.add("hero-amp-settled"); // permanent gold &
        gsap.fromTo(
          amp,
          { filter: "brightness(1.2)" },
          { filter: "brightness(1)", duration: 1.2, ease: "sine.out" }
        );
      };

      if (prefersReducedMotion) {
        gsap.set(
          [eyebrowRef.current, names, quoteRef.current, dividerRef.current, metaRef.current, cueRef.current],
          { opacity: 1, y: 0 }
        );
        settle();
        return;
      }

      armGradient();

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // background glow + eyebrow
      tl.fromTo(glowRef.current, { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 1.6, ease: "power2.out" }, 0)
        .fromTo(eyebrowRef.current, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.9 }, 0.1)
        // title fades in
        .fromTo(names, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out" }, 0.3)
        // GOLD-FOIL SHINE — TWO slow L→R passes. Pass 1 crosses the whole title
        // and exits; Pass 2 comes back in and decelerates to rest on the centred
        // & (slow), where it fades into the settled state. ONE keyframes tween
        // (StrictMode-safe), off-screen edges so the reset is invisible (no
        // flash). Only background-position animates.
        .to(
          names,
          {
            keyframes: [
              { backgroundPosition: "-160% center", duration: 2.6, ease: "power1.inOut" }, // PASS 1 — full L→R, slow
              { backgroundPosition: "240% center", duration: 0 },                          // invisible reset off-left
              { backgroundPosition: "50% center", duration: 3.0, ease: "power2.out" },      // PASS 2 — L→R, slow, rest on the &
            ],
            onComplete: settle,
          },
          1.0
        )
        // supporting elements settle in
        .fromTo(quoteRef.current, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1 }, 1.1)
        .fromTo(dividerRef.current, { scaleX: 0 }, { scaleX: 1, duration: 1, ease: "power2.inOut", transformOrigin: "center" }, 1.3)
        .fromTo(metaRef.current.children, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.15 }, 1.5)
        .fromTo(cueRef.current, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 1 }, 2.0);

      // continuous gentle pulse on the scroll-cue line
      gsap.to(".hero-cue-line", { scaleY: 1.4, transformOrigin: "top", repeat: -1, yoyo: true, duration: 1.4, ease: "sine.inOut" });

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
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-mobile-margin md:px-container-padding text-center"
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

        {/* Title — the gold-foil gradient + clip are applied by JS on load so
            the highlight glides across the LETTERS once, then settles (names
            burgundy, & permanent gold). */}
        <h1
          ref={namesRef}
          className="relative z-10 font-display-lg leading-[0.95] text-[clamp(3.5rem,15vw,9rem)] text-primary opacity-0"
        >
          {COUPLE.bride}{" "}
          <span ref={ampRef} className="hero-amp">
            &amp;
          </span>{" "}
          {COUPLE.groom}
        </h1>

        <p
          ref={quoteRef}
          className="mt-8 max-w-xl font-quote text-xl md:text-quote italic text-on-surface-variant opacity-0"
        >
          Two souls, one promise, and a lifetime of love.
        </p>

        {/* gold ornamental divider */}
        <div className="mt-10 flex items-center gap-4">
          <span
            ref={dividerRef}
            className="block h-px w-32 md:w-56 origin-center bg-gradient-to-r from-transparent via-secondary to-transparent"
          />
        </div>

        <div ref={metaRef} className="mt-10 flex flex-col items-center gap-3 font-label-caps text-label-caps tracking-[0.25em] text-primary md:flex-row md:gap-10">
          <span className="opacity-0">JULY 12, 2026</span>
          <span className="hidden h-4 w-px bg-secondary/50 md:block opacity-0" />
          <span className="opacity-0">BODINAYAKANUR, TAMIL NADU</span>
        </div>
      </div>

      {/* Premium scroll cue */}
      <div ref={cueRef} className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-0">
        <span className="font-label-caps text-[0.7rem] tracking-[0.35em] text-secondary">
          BEGIN THE JOURNEY
        </span>
        <span className="hero-cue-line block h-10 w-px bg-gradient-to-b from-secondary to-transparent" />
      </div>
    </section>
  );
}
