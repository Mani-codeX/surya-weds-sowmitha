import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "../lib/gsap";
import { useResponsive } from "../hooks/useResponsive";
import { COUPLE } from "../lib/content";
import creatorPhoto from "../assets/wed-images/me-img-1.png";

const DUST_COUNT  = 14;
const BURST_COUNT = 10;

export default function CreatorReveal() {
  const { prefersReducedMotion } = useResponsive();

  const sectionRef = useRef(null);
  const ornRef     = useRef(null);
  const eyebrowRef = useRef(null);
  const lineRef    = useRef(null);
  const clusterRef = useRef(null);
  const haloRef    = useRef(null);
  const ringRef    = useRef(null);
  const photoRef   = useRef(null);
  const photoWrap  = useRef(null);
  const nameRef    = useRef(null);
  const heartRef   = useRef(null);
  const divRef     = useRef(null);
  const roleRef    = useRef(null);
  const dedRef     = useRef(null);
  const dustField  = useRef(null);

  /* ── seed dust particles ── */
  useEffect(() => {
    const field = dustField.current;
    if (!field) return;
    for (let i = 0; i < DUST_COUNT; i++) {
      const d = document.createElement("span");
      d.className = "cr-dust";
      d.style.left   = `${8 + Math.random() * 84}%`;
      d.style.bottom = `${8 + Math.random() * 70}%`;
      d.style.setProperty("--delay", `${(Math.random() * 5).toFixed(2)}s`);
      d.style.setProperty("--dur",   `${(3.5 + Math.random() * 4).toFixed(2)}s`);
      d.style.setProperty("--dx",    `${(-18 + Math.random() * 36).toFixed(1)}px`);
      field.appendChild(d);
    }
  }, []);

  /* ── entrance animation ── */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    /* Create prologue node directly on document.body — completely outside
       Lenis / any scroll container so position:fixed works correctly */
    const prologueEl = document.createElement("p");
    prologueEl.className = "cr-prologue";
    prologueEl.setAttribute("aria-hidden", "true");
    prologueEl.textContent = "Every love story deserves a beautiful beginning…";
    document.body.appendChild(prologueEl);

    if (prefersReducedMotion) {
      prologueEl.style.opacity = "0";
      return () => prologueEl.remove();
    }

    const els = {
      prologue : prologueEl,
      orn      : ornRef.current,
      eyebrow  : eyebrowRef.current,
      line     : lineRef.current,
      cluster  : clusterRef.current,
      halo     : haloRef.current,
      ring     : ringRef.current,
      photo    : photoRef.current,
      wrap     : photoWrap.current,
      name     : nameRef.current,
      heart    : heartRef.current,
      div      : divRef.current,
      role     : roleRef.current,
      ded      : dedRef.current,
    };

    gsap.set(els.prologue, { opacity: 0 });
    gsap.set([els.orn, els.eyebrow, els.name, els.heart, els.role, els.ded], { opacity: 0 });
    gsap.set(els.line,    { scaleX: 0, opacity: 0 });
    gsap.set(els.div,     { scaleX: 0, opacity: 0 });
    gsap.set(els.cluster, { opacity: 0, scale: 0.9 });
    gsap.set(els.halo,    { opacity: 0 });
    gsap.set(els.ring,    { opacity: 0 });
    gsap.set(els.photo,   { opacity: 0 });

    const tl = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });

    tl.to(els.prologue, { opacity: 1, duration: 0.6, ease: "power2.out" })
      .to(els.prologue, { opacity: 0, duration: 0.5, ease: "power2.in", delay: 0.8 })

      .to(els.orn,     { opacity: 1, duration: 0.5 })
      .to(els.eyebrow, { opacity: 1, duration: 0.5 }, "-=0.25")
      .to(els.line,    { scaleX: 1, opacity: 1, duration: 0.65, ease: "power2.inOut" }, "-=0.2")

      .to(els.cluster, { opacity: 1, scale: 1, duration: 0.85 }, "-=0.15")
      .to(els.halo,    { opacity: 1, duration: 0.7 }, "-=0.6")
      .to(els.ring,    { opacity: 0.9, duration: 0.55 }, "-=0.65")
      .to(els.photo,   { opacity: 1, duration: 0.45 }, "-=0.45")

      .fromTo(".cr-sweep",
        { x: "-110%" },
        { x: "110%", duration: 0.8, ease: "power2.inOut" }, "-=0.1")

      .add(() => burstSparkles(els.wrap), "-=0.35")

      .to(els.name,  { opacity: 1, duration: 0.5 })
      .to(els.heart, { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(2.2)" }, "-=0.2")
      .to(els.div,   { scaleX: 1, opacity: 1, duration: 0.55, ease: "power2.inOut" }, "-=0.25")
      .to(els.role,  { opacity: 1, duration: 0.5 }, "-=0.3")
      .to(els.ded,   { opacity: 1, duration: 0.5 }, "-=0.3");

    const floatLoop = gsap.to(els.wrap, {
      y: -7, duration: 2.8, ease: "sine.inOut",
      yoyo: true, repeat: -1, paused: true,
    });
    const ringLoop = gsap.to(els.ring, {
      rotation: 360, duration: 20, ease: "none",
      repeat: -1, paused: true, transformOrigin: "50% 50%",
    });

    ScrollTrigger.create({
      trigger: section,
      start: "top 88%",
      once: true,
      onEnter: () => {
        tl.play();
        tl.eventCallback("onComplete", () => {
          floatLoop.play();
          ringLoop.play();
        });
      },
    });

    return () => {
      tl.kill();
      floatLoop.kill();
      ringLoop.kill();
      prologueEl.remove();
      ScrollTrigger.getAll()
        .filter((t) => t.vars?.trigger === section)
        .forEach((t) => t.kill());
    };
  }, [prefersReducedMotion]);

  /* ── hover / tap ── */
  const onEnter = () => {
    if (prefersReducedMotion) return;
    gsap.to(haloRef.current, { opacity: 1, scale: 1.15, duration: 0.4 });
    gsap.to(ringRef.current, { timeScale: 3.5, duration: 0.4 });
    nameRef.current?.classList.add("cr-name--shimmer");
    burstSparkles(photoWrap.current);
  };
  const onLeave = () => {
    if (prefersReducedMotion) return;
    gsap.to(haloRef.current, { opacity: 0.7, scale: 1, duration: 0.6 });
    gsap.to(ringRef.current, { timeScale: 1, duration: 0.8 });
    nameRef.current?.classList.remove("cr-name--shimmer");
  };

  return (
    <section ref={sectionRef} className="cr-section" aria-label="Creator signature">

      <div ref={dustField} className="cr-dust-field" aria-hidden="true" />

      <div className="cr-card">

        <div ref={ornRef} className="cr-ornament" aria-hidden="true">
          <svg width="160" height="20" viewBox="0 0 160 20" fill="none">
            <line x1="0" y1="10" x2="60" y2="10" stroke="url(#ornGL)" strokeWidth="0.6"/>
            <circle cx="68" cy="10" r="1.2" fill="rgba(197,160,89,0.5)"/>
            <circle cx="80" cy="10" r="2.2" fill="rgba(197,160,89,0.75)"/>
            <circle cx="92" cy="10" r="1.2" fill="rgba(197,160,89,0.5)"/>
            <line x1="100" y1="10" x2="160" y2="10" stroke="url(#ornGR)" strokeWidth="0.6"/>
            <defs>
              <linearGradient id="ornGL" x1="0" y1="0" x2="60" y2="0" gradientUnits="userSpaceOnUse">
                <stop offset="0%"   stopColor="rgba(197,160,89,0)"/>
                <stop offset="100%" stopColor="rgba(197,160,89,0.5)"/>
              </linearGradient>
              <linearGradient id="ornGR" x1="100" y1="0" x2="160" y2="0" gradientUnits="userSpaceOnUse">
                <stop offset="0%"   stopColor="rgba(197,160,89,0.5)"/>
                <stop offset="100%" stopColor="rgba(197,160,89,0)"/>
              </linearGradient>
            </defs>
          </svg>
        </div>

        <p ref={eyebrowRef} className="cr-eyebrow">✦ Crafted With Heart ✦</p>

        <div ref={lineRef} className="cr-line" aria-hidden="true" />

        <div
          ref={clusterRef}
          className="cr-photo-cluster"
          onMouseEnter={onEnter}
          onMouseLeave={onLeave}
          onTouchStart={onEnter}
          onTouchEnd={onLeave}
        >
          <div ref={haloRef} className="cr-halo" aria-hidden="true" />

          <svg ref={ringRef} className="cr-ring" viewBox="0 0 160 160" aria-hidden="true">
            <circle cx="80" cy="80" r="72" fill="none"
              stroke="url(#ringGrad)" strokeWidth="1.4"
              strokeDasharray="8 5" strokeLinecap="round"/>
            <defs>
              <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%"   stopColor="#fff3d0" stopOpacity="0.9"/>
                <stop offset="40%"  stopColor="#e9c176" stopOpacity="1"/>
                <stop offset="70%"  stopColor="#c5a059" stopOpacity="0.8"/>
                <stop offset="100%" stopColor="#fff3d0" stopOpacity="0.4"/>
              </linearGradient>
            </defs>
          </svg>

          <div ref={photoWrap} className="cr-photo-wrap">
            <img ref={photoRef} src={creatorPhoto}
              alt="Mani — Designer & Developer"
              className="cr-photo" draggable="false"/>
            <div className="cr-sweep" aria-hidden="true" />
          </div>
        </div>

        <h2 ref={nameRef} className="cr-name">Mani</h2>

        <span ref={heartRef} className="cr-heart heart-beat" aria-hidden="true">♥</span>

        <div ref={divRef} className="cr-divider" aria-hidden="true" />

        <p ref={roleRef} className="cr-role">Designer &amp; Developer</p>

        <p ref={dedRef} className="cr-dedication">
          Crafted with passion for{" "}
          <em>{COUPLE.groom} &amp; {COUPLE.bride}</em>
        </p>

      </div>
    </section>
  );
}

function burstSparkles(anchor) {
  if (!anchor) return;
  const rect = anchor.getBoundingClientRect();
  const cx = rect.left + rect.width  / 2;
  const cy = rect.top  + rect.height / 2;
  for (let i = 0; i < BURST_COUNT; i++) {
    const s     = document.createElement("span");
    const angle = (i / BURST_COUNT) * Math.PI * 2;
    const dist  = 38 + Math.random() * 48;
    const size  = 3 + Math.random() * 4;
    Object.assign(s.style, {
      position: "fixed", borderRadius: "50%", pointerEvents: "none",
      zIndex: 9999, width: `${size}px`, height: `${size}px`,
      left: `${cx}px`, top: `${cy}px`,
      background: "radial-gradient(circle,#fff8d0 0%,#e9c176 55%,transparent 100%)",
    });
    document.body.appendChild(s);
    gsap.fromTo(s,
      { opacity: 0.9, scale: 1, x: 0, y: 0 },
      { opacity: 0, scale: 0.3,
        x: Math.cos(angle) * dist, y: Math.sin(angle) * dist,
        duration: 0.65 + Math.random() * 0.35, ease: "power2.out",
        onComplete: () => s.remove() }
    );
  }
}