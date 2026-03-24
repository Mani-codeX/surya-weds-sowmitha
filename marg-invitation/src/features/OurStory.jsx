import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import coupleImg from "../assets/ourstory_couple.png";

gsap.registerPlugin(ScrollTrigger);

function OurStory() {
  const sectionRef = useRef(null);
  const cardRef = useRef(null);
  const imgRef = useRef(null);
  const textRef = useRef(null);
  const signatureRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top", 
          end: "+=150%",     
          scrub: 1.5,
          pin: true,        
          anticipatePin: 1,
        }
      });

      // 1. Initial Card Entrance
      tl.fromTo(
        cardRef.current,
        { opacity: 0, scale: 0.95, y: 150 },
        { opacity: 1, scale: 1, y: 0, duration: 1, ease: "none" }
      );

      // 2. Image slide in slowly
      tl.fromTo(
        imgRef.current,
        { opacity: 0, x: -60, scale: 1.1 },
        { opacity: 1, x: 0, scale: 1, duration: 1.5 },
        0.2 // Starts while card is still moving up
      );

      // 3. Text Stagger in (Narrative ONLY)
      const narrativeElements = Array.from(textRef.current.children);
      tl.fromTo(
        narrativeElements,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.4 },
        0.5 
      );

      // 4. SIGNATURE Reveal (Slowly rising from below)
      tl.fromTo(
        signatureRef.current,
        { opacity: 0, y: 100 },
        { opacity: 1, y: 0, duration: 1.5, ease: "power2.out" },
        0.8 
      );

      // Short hold at the end
      tl.to({}, { duration: 0.5 });
      
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex items-center justify-center min-h-screen py-12 md:py-24 px-6 md:px-12 bg-[#041c14] overflow-hidden z-20"
      style={{ marginTop: "60vh" }}
    >
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-[#c9a84c]/5 rounded-full blur-[100px] md:blur-[120px] -mr-32 -mt-32 md:-mr-48 md:-mt-48" />
      <div className="absolute bottom-0 left-0 w-64 h-64 md:w-96 md:h-96 bg-[#c9a84c]/5 rounded-full blur-[100px] md:blur-[120px] -ml-32 -mb-32 md:-ml-48 md:-mb-48" />

      {/* Main Container */}
      <div
        ref={cardRef}
        className="relative z-10 flex flex-col md:flex-row w-full max-w-6xl items-center gap-8 md:gap-20"
      >
        {/* Left Side — Image Card */}
        <div
          ref={imgRef}
          className="relative w-full md:w-[48%] h-[300px] md:h-[650px] rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] md:shadow-[0_40px_80px_rgba(0,0,0,0.8)] border border-[#c9a84c]/10 group flex-shrink-0"
        >
          <img
            src={coupleImg}
            alt="Varun and Meera"
            className="w-full h-full object-cover object-top filter grayscale-[100%] transition-transform duration-[1500ms] group-hover:scale-110"
          />
          {/* Subtle overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[#041c14]/50 to-transparent" />
        </div>

        {/* Right Side — Narrative */}
        <div
          className="flex-1 flex flex-col justify-center py-4 md:py-16 space-y-8 md:space-y-12 px-4 md:px-0"
        >
          <div ref={textRef} className="space-y-6 md:space-y-12">
            <div className="space-y-2 md:space-y-4">
              <h2
                className="text-[clamp(1.8rem,4.8vw,3.5rem)] font-light leading-tight tracking-wide text-[#c9a84c] italic"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                A Tapestry of Fate
              </h2>
            </div>

            <div className="space-y-4 md:space-y-10">
              <p
                className="text-[#d4ded9] text-lg md:text-2xl leading-relaxed opacity-90 font-light max-w-2xl"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                From the bustling streets of Chennai to the quiet temples of
                Madurai, our paths crossed in the most unexpected of ways. What
                began as a chance encounter blossomed into a shared vision of a
                heritage built on love and tradition.
              </p>
              <p
                className="text-[#d4ded9] text-lg md:text-2xl leading-relaxed opacity-90 font-light max-w-2xl"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Today, we stand at the threshold of a new chapter, carrying the
                blessings of our elders and the warmth of our ancestors' stories
                into our future together.
              </p>
            </div>
          </div>

          <div 
            ref={signatureRef}
            className="pt-6 md:pt-10 mt-2 md:mt-6 border-t border-[#c9a84c]/20"
          >
            <p
              className="text-2xl md:text-3xl text-[#c9a84c] italic tracking-[0.1em] font-medium"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Varun & Meera
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default OurStory;


