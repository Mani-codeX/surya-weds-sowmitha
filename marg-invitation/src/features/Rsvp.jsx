import { useLayoutEffect, useRef } from "react";
import { gsap } from "../lib/gsap";
import { useResponsive } from "../hooks/useResponsive";
import ProtectedImage from "../components/ProtectedImage";
import { WED_IMG } from "../lib/weddingImages";
import { COUPLE } from "../lib/content";

const PARTICLES = Array.from({ length: 12 }, (_, i) => i);

const PAPER = "https://www.transparenttextures.com/patterns/natural-paper.png";

export default function Rsvp() {
  const sectionRef    = useRef(null);
  const doorWrapRef   = useRef(null);
  const leftRef       = useRef(null);
  const rightRef      = useRef(null);
  const closingRef    = useRef(null);
  const initialsRef   = useRef(null);
  const dividerRef    = useRef(null);
  const quoteRef      = useRef(null);
  const subRef        = useRef(null);
  const particlesRef  = useRef(null);
  const { prefersReducedMotion } = useResponsive();

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(leftRef.current, { xPercent: -100 });
        gsap.set(rightRef.current, { xPercent: 100 });
        gsap.set([initialsRef.current, dividerRef.current, quoteRef.current, subRef.current], { opacity: 1, y: 0, scaleX: 1, filter: "none" });
        return;
      }

      // Doors part as the section scrolls into view
      gsap
        .timeline({
          scrollTrigger: {
            trigger: doorWrapRef.current,
            start: "top 75%",
            end: "center 60%",
            scrub: 1,
          },
        })
        .to(leftRef.current,  { xPercent: -100, ease: "none" }, 0)
        .to(rightRef.current, { xPercent:  100, ease: "none" }, 0);

      // Closing section — staggered cinematic reveal
      const tl = gsap.timeline({
        scrollTrigger: { trigger: closingRef.current, start: "top 80%", once: true },
      });

      tl.fromTo(initialsRef.current,
        { opacity: 0, y: -40, scale: 0.7 },
        { opacity: 1, y: 0, scale: 1, duration: 1.1, ease: "back.out(1.8)" },
        0
      )
      .fromTo(initialsRef.current,
        { backgroundPosition: "200% center" },
        { backgroundPosition: "-20% center", duration: 1.2, ease: "power2.inOut" },
        0.8
      )
      .fromTo(dividerRef.current,
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 1, duration: 0.7, ease: "power3.out", transformOrigin: "center" },
        0.7
      )
      .fromTo(quoteRef.current,
        { opacity: 0, y: 28, filter: "blur(6px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 1, ease: "power3.out" },
        1.0
      )
      .fromTo(subRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
        1.4
      );

      if (particlesRef.current) {
        particlesRef.current.querySelectorAll(".rsvp-particle").forEach((dot) => {
          gsap.fromTo(dot,
            { opacity: 0, y: 0, x: 0, scale: 0 },
            {
              opacity: Math.random() * 0.5 + 0.2,
              y: -(60 + Math.random() * 80),
              x: (Math.random() - 0.5) * 200,
              scale: Math.random() * 0.8 + 0.4,
              duration: 2 + Math.random() * 2,
              delay: 1.2 + Math.random() * 0.8,
              ease: "power1.out",
              scrollTrigger: { trigger: closingRef.current, start: "top 80%", once: true },
            }
          );
        });
      }
    }, section);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section ref={sectionRef} id="rsvp" className="bg-primary text-on-primary relative">

      <div ref={doorWrapRef} className="relative flex h-screen w-full items-center justify-center overflow-hidden">
        {/* Left door */}
        <div
          ref={leftRef}
          className="absolute left-0 top-0 w-1/2 h-full bg-primary z-20 flex items-center justify-end border-r border-secondary/30 will-change-transform"
        >
          <div className="w-full h-full opacity-20" style={{ backgroundImage: `url(${PAPER})` }} />
          <div className="absolute right-4 w-12 h-64 border-l-2 border-secondary/20" />
        </div>

        {/* Right door */}
        <div
          ref={rightRef}
          className="absolute right-0 top-0 w-1/2 h-full bg-primary z-20 flex items-center justify-start border-l border-secondary/30 will-change-transform"
        >
          <div className="w-full h-full opacity-20" style={{ backgroundImage: `url(${PAPER})` }} />
          <div className="absolute left-4 w-12 h-64 border-r-2 border-secondary/20" />
        </div>

        {/* Invitation image */}
        <div className="relative z-10 flex h-full w-full items-center justify-center overflow-hidden p-4">
          <ProtectedImage
            src={WED_IMG.invitation}
            alt="Surya & Sowmitha — Wedding Invitation"
            className="max-w-none -rotate-90 rounded-lg object-contain shadow-2xl"
            style={{ maxHeight: "94vw", maxWidth: "88vh", height: "auto", width: "auto" }}
            loading="eager"
          />
        </div>
      </div>

      {/* Closing — cinematic invite block */}
      <div ref={closingRef} className="relative z-10 -mt-[34vh] px-mobile-margin pb-20 pt-0 text-center md:-mt-[18vh] md:px-container-padding md:pb-24 overflow-hidden">

        <div ref={particlesRef} className="pointer-events-none absolute inset-0 flex items-end justify-center">
          {PARTICLES.map((i) => (
            <span key={i} className="rsvp-particle absolute bottom-1/2 rounded-full"
              style={{
                width: `${3 + (i % 4)}px`, height: `${3 + (i % 4)}px`,
                left: `${20 + (i * 6.5) % 60}%`,
                background: "radial-gradient(circle, #f4d27a 0%, #c5a059 70%, transparent 100%)",
                opacity: 0,
              }}
            />
          ))}
        </div>

        <h2 ref={initialsRef} className="font-display-lg text-5xl md:text-display-lg"
          style={{
            background: "linear-gradient(110deg, #c5a059 0%, #fff3d0 30%, #f4d27a 50%, #fff3d0 70%, #c5a059 100%)",
            backgroundSize: "220% 100%", backgroundPosition: "200% center",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            opacity: 0,
          }}
        >
          {COUPLE.initials}
        </h2>

        <div ref={dividerRef} className="mx-auto mt-4 h-px w-20 md:w-24"
          style={{ background: "linear-gradient(90deg, transparent, rgba(197,160,89,0.8) 50%, transparent)", transform: "scaleX(0)", opacity: 0 }}
        />

        <p ref={quoteRef} className="mx-auto mt-7 max-w-md font-quote text-lg italic leading-relaxed text-secondary-fixed md:mt-10 md:max-w-2xl md:text-3xl" style={{ opacity: 0 }}>
          With hearts full of joy, we lovingly invite you to be part of our special day.
        </p>

        <p ref={subRef} className="mx-auto mt-3 max-w-sm font-body-lg text-sm leading-relaxed text-on-primary/75 md:max-w-xl md:text-base" style={{ opacity: 0 }}>
          Your presence and blessings mean the world to us. Kindly do come and shower the couple with your love.
        </p>
      </div>
    </section>
  );
}
