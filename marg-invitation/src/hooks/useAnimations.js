import { useLayoutEffect, useRef } from "react";
import { gsap } from "../lib/gsap";
import {
  REVEAL_TRIGGER,
  FROM,
  MASK_FROM,
  MASK_TO,
  DURATION,
  STAGGER,
  splitChars,
} from "../lib/animations";

/*
 * Reusable scroll-animation hooks. All share three rules:
 *   1. useLayoutEffect → GSAP sets the hidden from-state BEFORE first paint
 *      (no flicker / FOUC).
 *   2. fromTo + immediateRender + overwrite:"auto" → no tween conflicts.
 *   3. gsap.context() + ctx.revert() → tweens AND their ScrollTriggers are
 *      cleaned up together (no leaks).
 * Only transform/opacity/clip-path animate → composited, 60fps.
 */

/** fadeUp / fade / slide reveal of a single element. */
export function useReveal({
  from = "fadeUp",
  duration = DURATION.base,
  delay = 0,
  ease = "power3.out",
  trigger = {},
  vars = {},
} = {}) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fromVars = FROM[from] || FROM.fadeUp;
    const to = { opacity: 1 };
    if ("x" in fromVars) to.x = 0;
    if ("y" in fromVars) to.y = 0;
    if ("scale" in fromVars) to.scale = 1;

    const ctx = gsap.context(() => {
      gsap.fromTo(el, fromVars, {
        ...to,
        duration,
        delay,
        ease,
        immediateRender: true,
        overwrite: "auto",
        ...vars,
        scrollTrigger: { trigger: el, ...REVEAL_TRIGGER, ...trigger },
      });
    }, el);
    return () => ctx.revert();
  }, [from, duration, delay, ease, trigger, vars]);
  return ref;
}

/** Stagger the direct children of a container. */
export function useStagger({
  from = "fadeUp",
  stagger = STAGGER,
  duration = DURATION.base,
  ease = "power3.out",
  trigger = {},
} = {}) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !el.children.length) return;
    const fromVars = FROM[from] || FROM.fadeUp;
    const ctx = gsap.context(() => {
      gsap.fromTo(el.children, fromVars, {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        duration,
        stagger,
        ease,
        immediateRender: true,
        overwrite: "auto",
        scrollTrigger: { trigger: el, ...REVEAL_TRIGGER, ...trigger },
      });
    }, el);
    return () => ctx.revert();
  }, [from, stagger, duration, ease, trigger]);
  return ref;
}

/** Letter-by-letter ("chars") or line-by-line ("lines") text reveal. */
export function useTextReveal({
  mode = "lines",
  stagger = mode === "chars" ? 0.04 : 0.16,
  duration = 0.9,
  delay = 0,
  trigger = {},
} = {}) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const targets = mode === "chars" ? splitChars(el) : Array.from(el.children);
      if (!targets.length) return;
      gsap.fromTo(
        targets,
        { opacity: 0, yPercent: mode === "chars" ? 60 : 40 },
        {
          opacity: 1,
          yPercent: 0,
          duration,
          delay,
          stagger,
          ease: "power2.out",
          immediateRender: true,
          overwrite: "auto",
          scrollTrigger: { trigger: el, ...REVEAL_TRIGGER, ...trigger },
        }
      );
    }, el);
    return () => ctx.revert();
  }, [mode, stagger, duration, delay, trigger]);
  return ref;
}

/** Mask/clip-path image reveal (curtain wipe up). */
export function useImageReveal({ duration = 1.3, trigger = {} } = {}) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(el, MASK_FROM, {
        ...MASK_TO,
        duration,
        ease: "power3.inOut",
        immediateRender: true,
        overwrite: "auto",
        scrollTrigger: { trigger: el, ...REVEAL_TRIGGER, ...trigger },
      });
    }, el);
    return () => ctx.revert();
  }, [duration, trigger]);
  return ref;
}

/** Scrub-linked vertical parallax (inherently reversible). */
export function useParallax({ speed = -80, trigger = {} } = {}) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { y: -speed / 2 },
        {
          y: speed / 2,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
            ...trigger,
          },
        }
      );
    }, el);
    return () => ctx.revert();
  }, [speed, trigger]);
  return ref;
}
