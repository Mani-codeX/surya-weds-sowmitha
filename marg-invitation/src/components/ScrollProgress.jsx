import { useEffect, useRef } from "react";

export default function ScrollProgress() {
  const wrapRef  = useRef(null);
  const dotRef   = useRef(null);
  const trackRef = useRef(null);
  const fillRef  = useRef(null);

  useEffect(() => {
    // desktop only — skip entirely on touch/mobile
    if (window.matchMedia("(max-width: 767px)").matches) return;

    const wrap  = wrapRef.current;
    const dot   = dotRef.current;
    const track = trackRef.current;
    const fill  = fillRef.current;
    if (!wrap || !dot || !track || !fill) return;

    wrap.style.opacity = "0";
    wrap.style.transform = "translateY(-50%) translateX(16px)";
    wrap.style.transition = "opacity 0.6s ease, transform 0.6s ease";

    let visible = false;

    const onScroll = () => {
      const scrollY   = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress  = maxScroll > 0 ? Math.min(scrollY / maxScroll, 1) : 0;

      // show after 80px, hide at very top
      if (scrollY > 80 && !visible) {
        visible = true;
        wrap.style.opacity = "1";
        wrap.style.transform = "translateY(-50%) translateX(0)";
      } else if (scrollY <= 40 && visible) {
        visible = false;
        wrap.style.opacity = "0";
        wrap.style.transform = "translateY(-50%) translateX(16px)";
      }

      // move dot inside track
      const trackH = track.offsetHeight;
      const dotH   = dot.offsetHeight;
      const travel = trackH - dotH;
      dot.style.transform = `translateY(${progress * travel}px)`;

      // grow fill line
      fill.style.height = `${progress * trackH}px`;
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
        {/* filled portion */}
        <div
          ref={fillRef}
          className="absolute top-0 left-0 w-full rounded-full"
          style={{ height: 0, background: "rgba(197,160,89,0.45)" }}
        />
        {/* glowing dot */}
        <div
          ref={dotRef}
          className="absolute left-1/2 rounded-full"
          style={{
            width: "8px",
            height: "8px",
            marginLeft: "-3px",
            background: "radial-gradient(circle, #f4d27a 0%, #c5a059 60%, transparent 100%)",
            boxShadow: "0 0 8px 3px rgba(197,160,89,0.7), 0 0 2px 1px rgba(244,210,122,0.9)",
            transform: "translateY(0px)",
          }}
        />
      </div>

      {/* bottom diamond */}
      <svg width="7" height="7" viewBox="0 0 8 8">
        <path d="M4 0 L8 4 L4 8 L0 4 Z" fill="rgba(197,160,89,0.25)" />
      </svg>
    </div>
  );
}
