import { useLayoutEffect, useRef } from "react";
import { gsap } from "../lib/gsap";
import { useResponsive } from "../hooks/useResponsive";

/**
 * HeartCenterpiece — the romantic divider centerpiece between the bride/groom
 * silhouettes (replaces the old settings_heart icon).
 *
 * Composition (all clipped to a single heart silhouette):
 *   - Gold outline heart (stroke = secondary #775a19) that gently pulses.
 *   - A soft rose inner glow that slowly travels UPWARD inside the heart and
 *     fades in/out — "glowing with love and warmth".
 *   - A few tiny particles that occasionally rise from the heart and fade.
 *
 * Performance: GSAP timelines, transform + opacity ONLY (no filters). The glow
 * is a static radial gradient masked by clip-path; only its translate/opacity
 * animate. Subtle scale (1 → 1.05 → 1), 3–5s, infinite. Honors reduced motion.
 */
export default function HeartCenterpiece({ className = "" }) {
  const rootRef = useRef(null);
  const heartRef = useRef(null);
  const outlineRef = useRef(null);
  const glowRef = useRef(null);
  const particlesRef = useRef(null);
  const { prefersReducedMotion } = useResponsive();

  // Heart path drawn in a 100x100 viewBox, used both as the visible outline
  // and (via clipPath) as the mask for the inner glow.
  const HEART_D =
    "M50 88 C 18 64, 6 44, 6 28 C 6 14, 17 6, 30 6 C 40 6, 47 12, 50 20 C 53 12, 60 6, 70 6 C 83 6, 94 14, 94 28 C 94 44, 82 64, 50 88 Z";

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // 1. Subtle breathing scale + outline pulse on the whole heart.
      gsap.to(heartRef.current, {
        scale: 1.05,
        duration: 2.2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        transformOrigin: "50% 55%",
      });
      gsap.to(outlineRef.current, {
        opacity: 0.65,
        duration: 2.2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      // 2. Inner rose glow travels upward inside the heart and fades.
      //    It lives inside a clipPath, so it can only ever show heart-shaped.
      gsap.set(glowRef.current, { yPercent: 35, opacity: 0 });
      gsap
        .timeline({ repeat: -1, defaults: { ease: "sine.inOut" } })
        .to(glowRef.current, { opacity: 1, duration: 1.6 }, 0)
        .to(glowRef.current, { yPercent: -25, duration: 4, ease: "none" }, 0)
        .to(glowRef.current, { opacity: 0, duration: 1.4 }, 2.6)
        .set(glowRef.current, { yPercent: 35 });

      // 3. Occasional tiny particles rising from the heart, very low density.
      const dots = particlesRef.current.querySelectorAll(".heart-spark");
      dots.forEach((dot, i) => {
        const rise = () => {
          gsap.set(dot, {
            x: gsap.utils.random(-8, 8),
            y: 0,
            opacity: 0,
            scale: gsap.utils.random(0.6, 1),
          });
          const dur = gsap.utils.random(2.6, 4);
          gsap
            .timeline({
              onComplete: () =>
                gsap.delayedCall(gsap.utils.random(2, 5), rise),
            })
            .to(dot, { opacity: gsap.utils.random(0.4, 0.7), duration: 0.8 }, 0)
            .to(dot, { y: gsap.utils.random(-26, -40), x: `+=${gsap.utils.random(-10, 10)}`, duration: dur, ease: "power1.out" }, 0)
            .to(dot, { opacity: 0, duration: 1 }, dur - 1);
        };
        gsap.delayedCall(i * gsap.utils.random(1.5, 3) + 1, rise);
      });
    }, root);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <div
      ref={rootRef}
      className={`relative ${className}`}
      style={{ width: 64, height: 64 }}
      aria-hidden="true"
    >
      {/* particles rise from just above the heart */}
      <div ref={particlesRef} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        {Array.from({ length: 4 }).map((_, i) => (
          <span
            key={i}
            className="heart-spark absolute h-1 w-1 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(255,222,165,0.95), rgba(157,65,57,0.4) 70%, transparent)",
              opacity: 0,
            }}
          />
        ))}
      </div>

      <svg
        ref={heartRef}
        viewBox="0 0 100 100"
        className="w-full h-full overflow-visible will-change-transform"
      >
        <defs>
          <clipPath id="heart-clip">
            <path d={HEART_D} />
          </clipPath>
          <radialGradient id="heart-glow" cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor="#d26a5f" stopOpacity="0.95" />
            <stop offset="45%" stopColor="#9d4139" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#4a0404" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Inner travelling rose glow, clipped to the heart silhouette */}
        <g clipPath="url(#heart-clip)">
          {/* faint base fill so the heart never looks empty */}
          <path d={HEART_D} fill="#4a0404" fillOpacity="0.18" />
          <rect
            ref={glowRef}
            x="0"
            y="0"
            width="100"
            height="100"
            fill="url(#heart-glow)"
            className="will-change-transform"
          />
        </g>

        {/* Gold outline */}
        <path
          ref={outlineRef}
          d={HEART_D}
          fill="none"
          stroke="#775a19"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
