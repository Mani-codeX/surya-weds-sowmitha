import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function SaveTheDate() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const dateRef = useRef(null);
  const locationRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 90%",
          end: "top 40%",
          scrub: 1,
        },
      });

      tl.fromTo(
        titleRef.current,
        { opacity: 0, scale: 0.9, y: 30 },
        { opacity: 1, scale: 1, y: 0, duration: 1.2, ease: "power3.out" }
      )
        .fromTo(
          dateRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
          "-=0.8"
        )
        .fromTo(
          locationRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
          "-=0.6"
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-[80vh] flex flex-col items-center justify-center bg-[#041c14] py-20 px-6"
    >
      {/* Decorative center element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#c9a84c]/5 rounded-full blur-[100px]" />

      <div className="relative z-10 flex flex-col items-center text-center space-y-12">
        {/* Title */}
        <p
          ref={titleRef}
          className="text-[#c9a84c] text-[clamp(1rem,2vw,1.25rem)] uppercase tracking-[0.5em] font-light italic"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Save the Date
        </p>

        {/* Date */}
        <div ref={dateRef} className="flex flex-col items-center space-y-4">
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

        {/* Location / Message */}
        <p
          ref={locationRef}
          className="text-[#d4ded9] text-[clamp(1.1rem,1.8vw,1.6rem)] italic opacity-80 max-w-lg leading-relaxed pt-8 border-t border-[#c9a84c]/20"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          To be held at the historic temple grounds of Madurai, Tamil Nadu.
        </p>
      </div>
    </section>
  );
}

export default SaveTheDate;
