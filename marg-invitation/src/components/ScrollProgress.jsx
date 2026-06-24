import { useEffect, useRef } from "react";

export default function ScrollProgress() {
  const wrapRef   = useRef(null);
  const dotRef    = useRef(null);
  const trackRef  = useRef(null);
  const fillRef   = useRef(null);
  const hintRef   = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(max-width: 767px)").matches) return;

    const wrap  = wrapRef.current;
    const dot   = dotRef.current;
    const track = trackRef.current;
    const fill  = fillRef.current;
    const hint  = hintRef.current;
    if (!wrap || !dot || !track || !fill || !hint) return;

    wrap.style.opacity = "0";
    wrap.style.transform = "translateY(-50%) translateX(16px)";
    wrap.style.transition = "opacity 0.6s ease, transform 0.6s ease";

    let visible = false;

    const onScroll = () => {
      const scrollY   = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress  = maxScroll > 0 ? Math.min(scrollY / maxScroll, 1) : 0;

      if (scrollY > 80 && !visible) {
        visible = true;
        wrap.style.opacity = "1";
        wrap.style.transform = "translateY(-50%) translateX(0)";
      } else if (scrollY <= 40 && visible) {
        visible = false;
        wrap.style.opacity = "0";
        wrap.style.transform = "translateY(-50%) translateX(16px)";
      }

      const trackH = track.offsetHeight;
      const dotH   = dot.offsetHeight;
      dot.style.transform = `translateY(${progress * (trackH - dotH)}px)`;
      fill.style.height = `${progress * trackH}px`;

      // hide scroll hint when near bottom
      hint.style.opacity = progress > 0.92 ? "0" : "1";
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      ref={wrapRef}
      className="hidden md:flex fixed right-5 top-1/2 z-50 flex-col items-center gap-1.5 pointer-events-none"
      style={{ transform: "translateY(-50%) translateX(16px)" }}
      aria-hidden="true"
    >
      {/* top diamond */}
      <svg width="7" height="7" viewBox="0 0 8 8">
        <path d="M4 0 L8 4 L4 8 L0 4 Z" fill="rgba(197,160,89,0.6)" />
      </svg>

      {/* track */}
      <div
        ref={trackRef}
        className="relative rounded-full overflow-hidden"
        style={{ width: "2px", height: "clamp(70px, 14vh, 110px)", background: "rgba(197,160,89,0.15)" }}
      >
        <div
          ref={fillRef}
          className="absolute top-0 left-0 w-full rounded-full"
          style={{ height: 0, background: "rgba(197,160,89,0.45)" }}
        />
        <div
          ref={dotRef}
          className="absolute left-1/2 rounded-full"
          style={{
            width: "8px", height: "8px", marginLeft: "-3px",
            background: "radial-gradient(circle, #f4d27a 0%, #c5a059 60%, transparent 100%)",
            boxShadow: "0 0 8px 3px rgba(197,160,89,0.7), 0 0 2px 1px rgba(244,210,122,0.9)",
          }}
        />
      </div>

      {/* bottom diamond */}
      <svg width="7" height="7" viewBox="0 0 8 8">
        <path d="M4 0 L8 4 L4 8 L0 4 Z" fill="rgba(197,160,89,0.25)" />
      </svg>

      {/* scroll hint — bouncing arrows only */}
      <div
        ref={hintRef}
        className="flex flex-col items-center mt-2"
        style={{ gap: "2px", transition: "opacity 0.5s ease" }}
      >
        <svg width="8" height="6" viewBox="0 0 10 6" fill="none" stroke="rgba(197,160,89,0.7)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "rsvp-bounce 1.4s ease-in-out infinite" }}>
          <path d="M1 1l4 4 4-4" />
        </svg>
        <svg width="8" height="6" viewBox="0 0 10 6" fill="none" stroke="rgba(197,160,89,0.35)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "rsvp-bounce 1.4s ease-in-out 0.2s infinite" }}>
          <path d="M1 1l4 4 4-4" />
        </svg>
      </div>

      <style>{`
        @keyframes rsvp-bounce {
          0%, 100% { transform: translateY(0); opacity: 0.9; }
          50%       { transform: translateY(4px); opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
