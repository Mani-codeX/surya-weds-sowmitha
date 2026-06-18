import { useLayoutEffect, useRef } from "react";

/**
 * ScratchCard — a real canvas scratch surface (GPay-style).
 *
 * The cover is painted on a <canvas> as a gold-foil texture; pointer/touch
 * drag erases it via globalCompositeOperation = "destination-out" (a true brush
 * erase, not an opacity fade or CSS mask). The children (the date) sit
 * underneath and show through wherever the cover is erased.
 *
 * Progress is sampled from the canvas alpha channel; once `threshold` of the
 * surface is cleared, onComplete() fires and the canvas fades out (the parent
 * runs the celebration). Works with mouse + touch; 60fps (erase only repaints
 * the brush dab, sampling is throttled).
 *
 * Props:
 *   threshold   – fraction (0–1) cleared before auto-complete (default 0.68)
 *   brush       – erase radius in px (default 26)
 *   onComplete  – called once when threshold reached
 *   className   – sizing for the wrapper (must size the children)
 */
export default function ScratchCard({
  threshold = 0.68,
  brush = 26,
  radius = 9999, // pill by default
  onComplete,
  onProgress,
  className = "",
  children,
}) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const doneRef = useRef(false);
  const drawingRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  const onProgressRef = useRef(onProgress);
  onProgressRef.current = onProgress;

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });

    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Paint the ornate gold "blessing plaque" cover — temple-inspired border,
    // corner kolam motifs, embossed invitation text, gold-dust speckle. Purely
    // the visual surface; the scratch/erase engine is unchanged.
    const paintCover = () => {
      // Clip everything to a rounded "pill" so the cover (and thus the
      // scratchable area) is capsule-shaped, not a rectangle.
      ctx.save();
      const rr = Math.min(radius, h / 2, w / 2);
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(0, 0, w, h, rr);
      } else {
        // fallback rounded path
        ctx.moveTo(rr, 0);
        ctx.arcTo(w, 0, w, h, rr);
        ctx.arcTo(w, h, 0, h, rr);
        ctx.arcTo(0, h, 0, 0, rr);
        ctx.arcTo(0, 0, w, 0, rr);
      }
      ctx.clip();

      // base metallic gold sheen
      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, "#6f4f10");
      g.addColorStop(0.25, "#caa24b");
      g.addColorStop(0.5, "#f4dd9a");
      g.addColorStop(0.75, "#caa24b");
      g.addColorStop(1, "#7a5611");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      // diagonal shimmer streak
      const s = ctx.createLinearGradient(0, 0, w, h);
      s.addColorStop(0.35, "rgba(255,255,255,0)");
      s.addColorStop(0.5, "rgba(255,250,235,0.5)");
      s.addColorStop(0.65, "rgba(255,255,255,0)");
      ctx.fillStyle = s;
      ctx.fillRect(0, 0, w, h);

      // gold-dust speckle
      const dots = Math.floor((w * h) / 850);
      for (let i = 0; i < dots; i++) {
        const x = Math.random() * w;
        const y = Math.random() * h;
        const r = Math.random() * 1.2 + 0.2;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = Math.random() < 0.5 ? "rgba(255,245,210,0.55)" : "rgba(110,72,16,0.4)";
        ctx.fill();
      }

      // ── engraved pill outline (rounded, embossed) ──
      const pad = Math.max(8, Math.min(w, h) * 0.05);
      const roundPath = (inset) => {
        const rr2 = Math.min(rr - inset, h / 2 - inset);
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(inset, inset, w - inset * 2, h - inset * 2, rr2);
        else ctx.rect(inset, inset, w - inset * 2, h - inset * 2);
      };
      ctx.lineWidth = 2;
      roundPath(pad - 1); ctx.strokeStyle = "rgba(90,58,10,0.45)"; ctx.stroke(); // shadow
      ctx.lineWidth = 1;
      roundPath(pad + 1); ctx.strokeStyle = "rgba(255,245,215,0.5)"; ctx.stroke(); // highlight
      ctx.lineWidth = 1.5;
      roundPath(pad); ctx.strokeStyle = "rgba(120,78,14,0.75)"; ctx.stroke(); // main rule

      // ── single centered prompt (engraved), sized to fit the pill cleanly ──
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const fs = Math.max(9, Math.min(w / 26, 13));
      ctx.font = `600 ${fs}px 'Source Serif 4', serif`;
      ctx.fillStyle = "rgba(80,50,8,0.6)"; // engraved shadow
      ctx.fillText("✦  SCRATCH TO REVEAL  ✦", w / 2 + 0.6, h / 2 + 0.6);
      ctx.fillStyle = "rgba(255,248,225,0.95)"; // raised highlight
      ctx.fillText("✦  SCRATCH TO REVEAL  ✦", w / 2, h / 2);

      ctx.restore();
    };

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      w = Math.max(1, Math.round(rect.width));
      h = Math.max(1, Math.round(rect.height));
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!doneRef.current) paintCover();
    };

    // Erase a soft circular dab at (x, y).
    const erase = (x, y) => {
      ctx.globalCompositeOperation = "destination-out";
      // soft brush: a small radial gradient so edges feather
      const grad = ctx.createRadialGradient(x, y, 0, x, y, brush);
      grad.addColorStop(0, "rgba(0,0,0,1)");
      grad.addColorStop(0.7, "rgba(0,0,0,1)");
      grad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, brush, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = "source-over";
    };

    // Throttled progress sampling (cheap: downscaled alpha scan).
    let sampleTick = 0;
    const sampleProgress = () => {
      if (doneRef.current) return;
      sampleTick++;
      if (sampleTick % 4 !== 0) return; // sample ~every 4th move
      const step = 8; // sample a sparse grid for speed
      const img = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let clear = 0;
      let total = 0;
      const rowBytes = canvas.width * 4;
      for (let y = 0; y < canvas.height; y += step) {
        for (let x = 0; x < canvas.width; x += step) {
          const alpha = img[y * rowBytes + x * 4 + 3];
          total++;
          if (alpha < 40) clear++;
        }
      }
      const frac = total ? clear / total : 0;
      onProgressRef.current?.(frac);
      if (frac >= threshold) {
        doneRef.current = true;
        // auto-complete: fade the remaining cover away, then notify the parent
        // to run the celebration. CSS transition keeps it cheap (opacity only).
        canvas.style.transition = "opacity 0.6s ease-out";
        canvas.style.opacity = "0";
        canvas.style.pointerEvents = "none";
        onCompleteRef.current?.();
      }
    };

    const pos = (e) => {
      const rect = canvas.getBoundingClientRect();
      const t = e.touches ? e.touches[0] : e;
      return { x: t.clientX - rect.left, y: t.clientY - rect.top };
    };

    const start = (e) => {
      if (doneRef.current) return;
      drawingRef.current = true;
      const { x, y } = pos(e);
      erase(x, y);
    };
    const move = (e) => {
      if (!drawingRef.current || doneRef.current) return;
      if (e.cancelable) e.preventDefault(); // stop page scroll while scratching
      const { x, y } = pos(e);
      erase(x, y);
      sampleProgress();
    };
    const end = () => {
      drawingRef.current = false;
    };

    resize();
    window.addEventListener("resize", resize);
    // pointer events cover mouse + touch + pen
    canvas.addEventListener("pointerdown", start);
    window.addEventListener("pointermove", move, { passive: false });
    window.addEventListener("pointerup", end);

    return () => {
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointerdown", start);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", end);
    };
  }, [threshold, brush, radius]);

  return (
    <div ref={wrapRef} className={`relative ${className}`}>
      {/* the hidden content (date) sits underneath */}
      {children}
      {/* the scratchable cover */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-20 cursor-grab touch-none active:cursor-grabbing"
        style={{ borderRadius: radius >= 9999 ? "9999px" : `${radius}px` }}
      />
    </div>
  );
}
