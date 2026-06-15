/**
 * Shared animation presets — transform + opacity ONLY (no filter/blur, no
 * layout-affecting props), so everything runs on the compositor at 60fps.
 */

// Play on enter, reverse on scroll-up.
export const REVEAL_TRIGGER = {
  start: "top 82%",
  toggleActions: "play none none reverse",
};

export const FROM = {
  fadeUp: { opacity: 0, y: 50 },
  fadeDown: { opacity: 0, y: -50 },
  fadeLeft: { opacity: 0, x: -60 },
  fadeRight: { opacity: 0, x: 60 },
  fade: { opacity: 0 },
  scaleIn: { opacity: 0, scale: 0.94 },
};

// clip-path wipe for image/mask reveals (composited).
export const MASK_FROM = { clipPath: "inset(0% 0% 100% 0%)" };
export const MASK_TO = { clipPath: "inset(0% 0% 0% 0%)" };

export const DURATION = { fast: 0.6, base: 1, slow: 1.4 };
export const STAGGER = 0.15;

/**
 * splitChars — wrap each character in an inline-block span for letter reveals.
 * No paid SplitText plugin; spaces preserved; accessible via aria-label.
 */
export function splitChars(el) {
  const text = el.textContent;
  el.textContent = "";
  el.setAttribute("aria-label", text);
  const spans = [];
  for (const ch of text) {
    const span = document.createElement("span");
    span.textContent = ch === " " ? " " : ch;
    span.style.display = "inline-block";
    span.setAttribute("aria-hidden", "true");
    el.appendChild(span);
    spans.push(span);
  }
  return spans;
}
