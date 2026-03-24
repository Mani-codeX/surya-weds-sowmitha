import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import kovilBg from "../assets/kovil4.jpg";

gsap.registerPlugin(ScrollTrigger);

function Home() {
  const sectionRef = useRef(null);
  const overlayRef = useRef(null);
  const heroContentRef = useRef(null);
  const saveDateContentRef = useRef(null);
  const scrollIndicatorRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const introTl = gsap.timeline({ defaults: { ease: "power4.out" } });

      gsap.fromTo(
        sectionRef.current,
        { filter: "blur(15px)" },
        { filter: "blur(0px)", duration: 2, ease: "power2.out" }
      );

      introTl
        .fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 2 }, 0)
        .fromTo(
          heroContentRef.current.children,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 1.5, stagger: 0.2 },
          0.5
        )
        .fromTo(
          scrollIndicatorRef.current,
          { opacity: 0, height: 0 },
          { opacity: 1, height: "60px", duration: 1 },
          "-=0.5"
        );

      
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=400%", // Keep Home FIXED until well after Story is done
          pin: true,
          pinSpacing: false,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      // --- STAGE 1: NAME (Very fast) ---
      scrollTl
        .to(heroContentRef.current, {
          opacity: 0,
          y: -20,
          duration: 0.3, 
        })
        
        // --- STAGE 2: SAVE THE DATE (Very fast) ---
        .fromTo(
          saveDateContentRef.current,
          { opacity: 0, scale: 1.02, y: 20 },
          { opacity: 1, scale: 1, y: 0, duration: 0.3 },
          ">"
        )
        // HOLD at the end — Home stays stationary while OurStory overlays at scroll offset 60vh
        .to({}, { duration: 3.4 }); 

      // Hide indicator as soon as user scrolls
      gsap.to(scrollIndicatorRef.current.parentElement, {
        opacity: 0,
        duration: 1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          scrub: true,
        }
      });

      // Arrow Bounce
      gsap.to(".scroll-arrow", {
        y: 8,
        repeat: -1,
        yoyo: true,
        duration: 1.5,
        ease: "sine.inOut",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-black z-0"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${kovilBg})`,
          backgroundPosition: "center 40%",
        }}
      />

      {/* Deep Atmosphere Overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0 z-0 bg-gradient-to-b from-[#041c14]/95 via-[#041c14]/85 to-[#041c14]"
      />

      {/* STAGE 1: NAMES */}
      <div
        ref={heroContentRef}
        className="relative z-10 flex flex-col items-center text-center px-10 pointer-events-none"
      >
        <p
          className="text-[#c9a84c] text-[clamp(0.7rem,1.5vw,0.85rem)] uppercase tracking-[0.4em] mb-8 font-light"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Together with their families
        </p>
        <h1
          className="text-[#c9a84c] text-[clamp(3.5rem,10vw,7.5rem)] italic mb-6 leading-tight"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Varun & Meera
        </h1>
        <p
          className="text-[#d4ded9] text-[clamp(1.1rem,2vw,1.4rem)] italic max-w-2xl leading-relaxed opacity-80"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Invite you to witness the beginning of their eternal journey under the
          stars.
        </p>
      </div>

      {/* STAGE 2: SAVE THE DATE */}
      <div
        ref={saveDateContentRef}
        className="absolute z-10 flex flex-col items-center text-center px-10 pointer-events-none space-y-10"
        style={{ opacity: 0 }}
      >
        <p
          className="text-[#c9a84c] text-[clamp(1rem,2vw,1.25rem)] uppercase tracking-[0.5em] font-light italic"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Save the Date
        </p>
        <div className="flex flex-col items-center space-y-4">
          <h2
            className="text-[clamp(3rem,8vw,6.5rem)] text-[#c9a84c] font-light leading-none"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            24 • 10 • 2026
          </h2>
          <p
            className="text-[#d4ded9] text-[clamp(1rem,1.5vw,1.25rem)] uppercase tracking-[0.3em] opacity-60"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Saturday Afternoon
          </p>
        </div>
        <p
          className="text-[#d4ded9] text-[clamp(1.1rem,1.8vw,1.6rem)] italic opacity-80 max-w-lg leading-relaxed pt-8 border-t border-[#c9a84c]/20"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          To be held at the historic temple grounds of Madurai, Tamil Nadu.
        </p>
      </div>

      {/* Scroll Indicator Section */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
        <div
          ref={scrollIndicatorRef}
          className="w-[1px] bg-gradient-to-b from-transparent via-[#c9a84c]/50 to-[#c9a84c]"
        />
        <div className="scroll-arrow mt-4">
          <svg
            width="14"
            height="8"
            viewBox="0 0 14 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 1L7 7L13 1"
              stroke="#c9a84c"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}

export default Home;




