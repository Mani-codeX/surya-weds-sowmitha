import { useEffect, useState } from "react";

/**
 * useResponsive — single source for the flags that gate animation cost.
 *   - isMobile: viewport <= 768px
 *   - prefersReducedMotion: OS "reduce motion" setting
 */
export function useResponsive() {
  const [state, setState] = useState(() => ({
    isMobile: typeof window !== "undefined" ? window.innerWidth <= 768 : false,
    prefersReducedMotion:
      typeof window !== "undefined"
        ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
        : false,
  }));

  useEffect(() => {
    const mqMobile = window.matchMedia("(max-width: 768px)");
    const mqMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () =>
      setState({
        isMobile: mqMobile.matches,
        prefersReducedMotion: mqMotion.matches,
      });
    update();
    mqMobile.addEventListener("change", update);
    mqMotion.addEventListener("change", update);
    return () => {
      mqMobile.removeEventListener("change", update);
      mqMotion.removeEventListener("change", update);
    };
  }, []);

  return state;
}
