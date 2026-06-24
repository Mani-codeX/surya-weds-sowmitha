import { createContext, useContext, useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "../lib/gsap";

/**
 * SmoothScrollProvider
 *
 * The single owner of the Lenis instance for the entire app. Centralizing it
 * here (instead of inside App) means:
 *   - There is exactly ONE smooth-scroll engine; no competing scroll systems.
 *   - GSAP ScrollTrigger is driven by Lenis' RAF loop, so scroll position and
 *     scroll-based animations never desync.
 *   - Any component can read the Lenis instance via `useLenis()` (e.g. to
 *     scroll-to an anchor) without prop drilling.
 *
 * The instance is exposed through a ref, not state: it's created once and never
 * replaced, so there's no reason to trigger a re-render when it's set. Consumers
 * read `useLenis().current` at call time (e.g. inside an event handler).
 *
 * Integration strategy (the important part):
 *   1. Drive Lenis from GSAP's ticker rather than its own requestAnimationFrame,
 *      so both share a single render loop (smoother, no double RAF).
 *   2. On every Lenis scroll, call ScrollTrigger.update() so triggers read the
 *      virtual scroll position Lenis controls.
 *   3. Disable GSAP's lag smoothing — Lenis already smooths motion; double
 *      smoothing causes drift.
 */
const LenisContext = createContext({ current: null });

// eslint-disable-next-line react-refresh/only-export-components
export const useLenis = () => useContext(LenisContext);

export function SmoothScrollProvider({ children }) {
  const lenisRef = useRef(null);

  useEffect(() => {
    const instance = new Lenis({
    
      lerp: 0.1,
      smoothWheel: true,
      wheelMultiplier: 1,
      syncTouch: true,
      touchMultiplier: 2,
      syncTouchLerp: 0.075,
    });

    lenisRef.current = instance;

    // 1. Keep ScrollTrigger in sync with Lenis' virtual scroll.
    instance.on("scroll", ScrollTrigger.update);

    // 2. Drive Lenis from GSAP's ticker => one shared RAF loop.
    //    GSAP reports time in seconds; Lenis.raf expects milliseconds.
    const tick = (time) => instance.raf(time * 1000);
    gsap.ticker.add(tick);

    // 3. Lenis handles smoothing; turn GSAP's own lag smoothing off.
    gsap.ticker.lagSmoothing(0);

    // Mobile stability: ignore the address-bar show/hide resize that otherwise
    // re-triggers animated sections on phones. We deliberately do NOT call
    // normalizeScroll(true) — with Lenis driving scroll it fights the wheel
    // handler and is a known jitter source. Lenis already normalizes input.
    ScrollTrigger.config({ ignoreMobileResize: true });

    // SINGLE source of explicit refreshes. Components must NOT call refresh()
    // themselves; scattered refreshes during mount cause layout thrash. We
    // refresh once after layout settles and again once webfonts load (Cormorant
    // reflows text and shifts trigger positions). Resize refreshes are handled
    // automatically by ScrollTrigger, so we don't add a listener for them.
    ScrollTrigger.refresh();
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => ScrollTrigger.refresh());
    }

    return () => {
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(1000, 16); // restore default
      instance.off("scroll", ScrollTrigger.update);
      instance.destroy();
      lenisRef.current = null;
    };
  }, []);

  return (
    <LenisContext.Provider value={lenisRef}>{children}</LenisContext.Provider>
  );
}
