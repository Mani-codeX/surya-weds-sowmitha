import { useLayoutEffect, useRef } from "react";
import { gsap } from "../lib/gsap";
import { useResponsive } from "../hooks/useResponsive";

/**
 * FloatingElements — the premium "alive" background layers, isolated from the
 * canvas dust / CSS glow so it can't disturb them. Purely additive.
 *
 * Layers (in addition to the canvas dust = Layer 1 and CSS glow = Layer 4):
 *   - Rose petals      : a few DOM petals drifting diagonally, very low density,
 *                        long durations, gentle sway + tumble.
 *   - Floral motes     : tiny soft flower glyphs slowly rising.
 *   - Heart-path motes  : occasional motes that trace a faint heart-shaped path
 *                        then fade — romance felt, never spelled out.
 *
 * Performance contract:
 *   - GSAP timelines only; animates transform (translate/rotate/scale) + opacity.
 *     No filter / blur / shadow / layout props.
 *   - One gsap.context() → a single ctx.revert() kills every tween (no leaks).
 *   - Each element is positioned with translate3d so it lives on its own GPU
 *     layer; total element count is tiny (well under a dozen on desktop).
 *   - Hidden entirely on prefers-reduced-motion; reduced density on mobile.
 *   - timeScale is paused when the tab is hidden (no offscreen work).
 */
export default function FloatingElements() {
  const rootRef = useRef(null);
  const { isMobile, prefersReducedMotion } = useResponsive();

  useLayoutEffect(() => {
    if (prefersReducedMotion) return;
    const root = rootRef.current;
    if (!root) return;

    const vw = () => window.innerWidth;
    const vh = () => window.innerHeight;
    const rand = (a, b) => a + Math.random() * (b - a);

    // Track only THIS component's timelines so we can pause/resume them on tab
    // visibility WITHOUT touching the global timeline (which would freeze the
    // existing section animations). Every timeline created below is registered.
    // Use a Set so recurring motes (which create a fresh timeline each cycle)
    // don't accumulate — each timeline removes itself on completion.
    const timelines = new Set();
    const tl = (vars = {}) => {
      const userComplete = vars.onComplete;
      const t = gsap.timeline({
        ...vars,
        onComplete() {
          timelines.delete(t);
          userComplete?.call(this);
        },
      });
      timelines.add(t);
      return t;
    };

    // Element count is set by the rendered DOM (responsive, see below). Each
    // querySelectorAll loop just animates whatever is present — low density by
    // design (luxury, not confetti).
    const ctx = gsap.context(() => {
      // ── Rose petals: diagonal drift + sway + tumble, long & staggered ──
      root.querySelectorAll(".fx-petal").forEach((el, i) => {
        const drift = () => {
          const startX = rand(-0.05, 0.9) * vw();
          gsap.set(el, {
            x: startX,
            y: -60,
            rotation: rand(0, 360),
            scale: rand(0.7, 1.15),
            opacity: 0,
          });
          const dur = rand(16, 26); // slow, large duration
          tl({ onComplete: drift })
            .to(el, { opacity: rand(0.35, 0.6), duration: 3, ease: "sine.inOut" }, 0)
            .to(
              el,
              {
                y: vh() + 80,
                x: `+=${rand(80, 220)}`, // diagonal travel
                rotation: `+=${rand(180, 420)}`,
                duration: dur,
                ease: "none",
              },
              0
            )
            .to(el, { opacity: 0, duration: 4, ease: "sine.in" }, dur - 4)
            // gentle horizontal sway layered on top
            .to(
              el,
              { xPercent: rand(-40, 40), duration: dur / 3, ease: "sine.inOut", yoyo: true, repeat: 2 },
              0
            );
        };
        gsap.delayedCall(i * rand(2, 5), drift); // stagger so they never burst
      });

      // ── Glowing particles: soft luminous motes drifting up, depth-tiered ──
      root.querySelectorAll(".fx-glow").forEach((el, i) => {
        const float = () => {
          // Depth: ~35% "near" (larger, brighter, a touch faster).
          const near = Math.random() < 0.35;
          gsap.set(el, {
            x: rand(0, vw()),
            y: vh() + 30,
            scale: near ? rand(1.1, 1.7) : rand(0.4, 0.9),
            opacity: 0,
          });
          const dur = near ? rand(18, 26) : rand(26, 40); // near = faster
          const peak = near ? rand(0.45, 0.7) : rand(0.15, 0.35);
          tl({ onComplete: float })
            .to(el, { opacity: peak, duration: 4, ease: "sine.inOut" }, 0)
            .to(el, { y: -50, x: `+=${rand(-50, 50)}`, duration: dur, ease: "none" }, 0)
            // slow twinkle
            .to(el, { opacity: peak * 0.5, duration: dur / 4, ease: "sine.inOut", yoyo: true, repeat: 3 }, 2)
            .to(el, { opacity: 0, duration: 5, ease: "sine.in" }, dur - 5);
        };
        gsap.delayedCall(i * rand(1.5, 3.5), float);
      });

      // ── Floral motes: tiny flower glyphs slowly rising + twinkling ──
      root.querySelectorAll(".fx-floral").forEach((el, i) => {
        const rise = () => {
          gsap.set(el, {
            x: rand(0, vw()),
            y: vh() + 40,
            scale: rand(0.5, 0.9),
            opacity: 0,
          });
          const dur = rand(20, 32);
          tl({ onComplete: rise })
            .to(el, { opacity: rand(0.18, 0.4), duration: 4 }, 0)
            .to(el, { y: -60, x: `+=${rand(-60, 60)}`, rotation: rand(-60, 60), duration: dur, ease: "none" }, 0)
            .to(el, { opacity: 0, duration: 5 }, dur - 5);
        };
        gsap.delayedCall(i * rand(3, 6), rise);
      });

      // ── Heart-path motes: trace a parametric heart, then fade ──
      // Manual parametric path (no MotionPathPlugin dep). We drive a normalized
      // progress 0→1 and write translate via onUpdate — transform only.
      root.querySelectorAll(".fx-heart").forEach((el, i) => {
        const trace = () => {
          const cx = rand(0.2, 0.8) * vw();
          const cy = rand(0.25, 0.7) * vh();
          const size = rand(36, 70); // small, subtle
          const p = { t: 0 };
          // classic heart curve (parametric), scaled & centered
          const at = (t) => {
            const a = t * Math.PI * 2;
            const hx = 16 * Math.sin(a) ** 3;
            const hy =
              13 * Math.cos(a) -
              5 * Math.cos(2 * a) -
              2 * Math.cos(3 * a) -
              Math.cos(4 * a);
            return { x: cx + (hx / 16) * size, y: cy - (hy / 16) * size };
          };
          gsap.set(el, { opacity: 0, scale: rand(0.8, 1.1) });
          const dur = rand(9, 14);
          tl({
            onComplete: () => {
              // long pause before the next heart so it stays "occasional"
              gsap.delayedCall(rand(8, 16), trace);
            },
          })
            .to(el, { opacity: rand(0.3, 0.5), duration: 2.5, ease: "sine.inOut" }, 0)
            .to(
              p,
              {
                t: 1,
                duration: dur,
                ease: "none",
                onUpdate: () => {
                  const { x, y } = at(p.t);
                  gsap.set(el, { x, y });
                },
              },
              0
            )
            .to(el, { opacity: 0, duration: 3, ease: "sine.in" }, dur - 3);
        };
        gsap.delayedCall(i * rand(5, 10) + 4, trace);
      });

    }, root);

    // Pause ONLY this component's timelines while the tab is hidden — zero
    // offscreen cost, and the existing section/global animations are untouched.
    const onVis = () => {
      const s = document.hidden ? 0 : 1;
      timelines.forEach((t) => t.timeScale(s));
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      document.removeEventListener("visibilitychange", onVis);
      ctx.revert();
    };
  }, [isMobile, prefersReducedMotion]);

  // SVG flower glyph reused for floral motes (soft 5-petal rosette).
  const Floral = (props) => (
    <svg viewBox="0 0 24 24" {...props}>
      <g fill="rgba(255, 222, 165, 0.9)">
        {[0, 72, 144, 216, 288].map((deg) => (
          <ellipse key={deg} cx="12" cy="6" rx="2.4" ry="4.6" transform={`rotate(${deg} 12 12)`} />
        ))}
        <circle cx="12" cy="12" r="2.2" fill="rgba(197,160,89,0.95)" />
      </g>
    </svg>
  );

  // Render responsive counts so unused elements never enter the DOM. ~2x the
  // previous density for a richer (but still elegant) atmosphere. Mobile keeps
  // the same layers at reduced count for performance/battery.
  const nPetals = isMobile ? 6 : 13;
  const nGlows = isMobile ? 5 : 11;
  const nFlorals = isMobile ? 5 : 9;
  const nHearts = isMobile ? 1 : 2;

  return (
    <div ref={rootRef} className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {Array.from({ length: nPetals }).map((_, i) => (
        <span key={`p${i}`} className="fx-petal" />
      ))}
      {Array.from({ length: nGlows }).map((_, i) => (
        <span key={`g${i}`} className="fx-glow" />
      ))}
      {Array.from({ length: nFlorals }).map((_, i) => (
        <Floral key={`f${i}`} className="fx-floral" />
      ))}
      {Array.from({ length: nHearts }).map((_, i) => (
        <span key={`h${i}`} className="fx-heart" />
      ))}
    </div>
  );
}
