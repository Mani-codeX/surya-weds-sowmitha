import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * useGsapReveal Hook
 * 
 * Reusable GSAP scroll-triggered animation hook.
 * 
 * @param {object} options 
 * @property {React.RefObject} ref - The element to animate
 * @property {object} animationProps - GSAP selection properties (from/to)
 * @property {object} scrollTriggerProps - ScrollTrigger configuration
 * @property {string} type - 'from', 'to', or 'fromTo'
 * @property {Array} staggerChildren - If true, animates children of the ref
 */
export const useGsapReveal = (ref, { 
  animationProps = {}, 
  scrollTriggerProps = {}, 
  type = "from",
  stagger = 0.2,
  delay = 0 
} = {}) => {
  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;
    
    // Default animation props if none provided
    const defaultFrom = { opacity: 0, y: 50 };
    const defaultTo = { opacity: 1, y: 0, duration: 1, ease: "power3.out" };

    const ctx = gsap.context(() => {
      const config = {
        scrollTrigger: {
          trigger: element,
          start: "top 85%",
          toggleActions: "play none none none",
          ...scrollTriggerProps
        },
        ...animationProps,
        stagger: animationProps.stagger || stagger,
        delay: animationProps.delay || delay
      };

      if (type === "from") {
        gsap.from(element, config);
      } else if (type === "to") {
        gsap.to(element, config);
      } else if (type === "fromTo") {
        gsap.fromTo(element, animationProps.from || defaultFrom, {
          ...animationProps.to || defaultTo,
          ...config
        });
      }
    });

    return () => ctx.revert();
  }, [ref, animationProps, scrollTriggerProps, type, stagger, delay]);
};

/**
 * useGsapStacking Hook
 * 
 * Specifically for the requested "Stacking" / "Cover" effect.
 * Pins the previous section while the next one slides over it.
 */
export const useGsapStacking = (sectionRef, contentRef, nextSectionRef) => {
    useEffect(() => {
        if (!sectionRef.current) return;

        const ctx = gsap.context(() => {
            // Pin the current section
            ScrollTrigger.create({
                trigger: sectionRef.current,
                start: "top top",
                end: "+=100%",
                pin: true,
                pinSpacing: false, // This allows the next section to scroll OVER
            });
        });

        return () => ctx.revert();
    }, [sectionRef]);
}
