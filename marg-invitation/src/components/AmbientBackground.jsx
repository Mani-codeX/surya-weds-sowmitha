import { useLayoutEffect, useRef } from "react";
import { gsap } from "../lib/gsap";
import { useResponsive } from "../hooks/useResponsive";
import FloatingElements from "./FloatingElements";

/**
 * AmbientBackground — fixed atmosphere layer behind all content, replacing the
 * source HTML's WebGL shader + Three.js petal/dust scene with a lightweight
 * equivalent that matches the screenshots:
 *
 *   - CSS maroon→bronze gradient glow with a slow antique-gold radial light.
 *   - Canvas golden dust (shares GSAP's single ticker; throttled ~30fps;
 *     pauses when the tab is hidden; DPR capped).
 *   - Kolam dot-grid + heavy vignette (CSS).
 *
 * pointer-events-none; honors prefers-reduced-motion (canvas skipped).
 */
export default function AmbientBackground() {
  const canvasRef = useRef(null);
  const { isMobile, prefersReducedMotion } = useResponsive();

  useLayoutEffect(() => {
    if (prefersReducedMotion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    // Richer dust field for a visibly "alive" atmosphere (~2x). Still cheap:
    // no shadowBlur, capped DPR, 30fps throttle, simple arc fills.
    const COUNT = isMobile ? 64 : 150;
    let width = 0;
    let height = 0;
    let particles = [];

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const rand = (a, b) => a + Math.random() * (b - a);
    const seed = () => {
      particles = Array.from({ length: COUNT }, () => {
        // Depth tier: ~25% "near" (bigger, faster, brighter), rest "far"
        // (tiny, slow, faint). Mixing tiers gives cinematic parallax depth.
        const near = Math.random() < 0.25;
        return {
          x: rand(0, width),
          y: rand(0, height),
          r: near ? rand(1.6, 3) : rand(0.4, 1.4),
          vy: near ? rand(-0.28, -0.12) : rand(-0.1, -0.03),
          vx: near ? rand(-0.1, 0.1) : rand(-0.05, 0.05),
          a: near ? rand(0.35, 0.7) : rand(0.08, 0.32),
          tw: rand(0, Math.PI * 2),
          tws: rand(0.004, 0.012),
        };
      });
    };

    let frame = 0;
    const draw = () => {
      if (document.hidden) return;
      frame++;
      if (frame % 2 !== 0) return; // ~30fps
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.tw += p.tws;
        if (p.y < -10) {
          p.y = height + 10;
          p.x = rand(0, width);
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        const alpha = p.a * (0.65 + 0.35 * Math.sin(p.tw));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(197, 160, 89, ${alpha})`; // antique gold #C5A059
        ctx.fill();
      }
    };

    resize();
    seed();
    gsap.ticker.add(draw);
    window.addEventListener("resize", resize);
    return () => {
      gsap.ticker.remove(draw);
      window.removeEventListener("resize", resize);
    };
  }, [isMobile, prefersReducedMotion]);

  return (
    <div aria-hidden="true" className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* maroon→bronze gradient glow */}
      <div className="ambient-glow absolute inset-0" />
      {/* golden dust (Layer 1) */}
      <canvas ref={canvasRef} className="absolute inset-0 opacity-90" />
      {/* rose petals + floral motes + heart-path motes (GSAP, isolated) */}
      <FloatingElements />
      {/* kolam dot-grid */}
      <div className="absolute inset-0 kolam-bg" />
      {/* heavy vignette — sits above the motes to keep them subtle */}
      <div className="absolute inset-0 vignette-heavy" />
      {/* single fixed paper-grain layer (replaces per-section silk-grain) */}
      <div className="grain-layer" />
    </div>
  );
}
