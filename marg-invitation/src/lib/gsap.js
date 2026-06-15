/**
 * Centralized GSAP setup.
 *
 * Registering plugins in a single module guarantees `gsap.registerPlugin`
 * runs exactly once for the whole app (importing this module is idempotent),
 * instead of being repeated in every component. Always import gsap/ScrollTrigger
 * from here so the rest of the codebase shares one configured instance.
 */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CSSPlugin } from "gsap/CSSPlugin";

// CSSPlugin handles transforms (x/y/scale/rotation) + force3D on DOM elements.
// It normally auto-registers, but registering it explicitly guarantees it's
// present under this bundler/import setup — otherwise GSAP warns
// "Invalid property force3D ... Missing plugin?" when animating DOM nodes.
gsap.registerPlugin(ScrollTrigger, CSSPlugin);

// Sensible global defaults so individual tweens stay terse.
// force3D promotes animated elements to their own GPU layer (smoother transforms).
gsap.defaults({ force3D: true, ease: "power3.out" });

export { gsap, ScrollTrigger };
