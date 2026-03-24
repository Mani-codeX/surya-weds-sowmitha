import { useEffect } from "react";
import Lenis from "lenis";
import Home from "./features/Home";
import OurStory from "./features/OurStory";

function App() {
  useEffect(() => {
    // 1. GLOBAL SMOOTH SCROLL (Lenis)
    // This gives the "Buttery Smooth" feel for premium experiences
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
      smoothWheel: true,
      wheelMultiplier: 1.1,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Sync Lenis with GSAP ScrollTrigger
    lenis.on('scroll', () => {
       // Refresh triggers if needed for complex overlaps
    });

    return () => lenis.destroy();
  }, []);

  return (
    <main className="bg-[#041c14]">
      <Home />
      <OurStory />
    </main>
  );
}

export default App;

