import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "../lib/gsap";
import { MessageSquare, Link, Check } from "../lib/icons";

/** Real WhatsApp glyph (lucide build here ships no WhatsApp icon). */
const WhatsAppIcon = ({ className = "" }) => (
  <svg viewBox="0 0 32 32" fill="currentColor" className={className} aria-hidden="true">
    <path d="M16.04 3C8.84 3 3 8.74 3 15.82c0 2.5.74 4.82 2.01 6.78L3 29l6.58-1.92a13.15 13.15 0 006.46 1.67c7.2 0 13.04-5.74 13.04-12.82C29.08 8.74 23.24 3 16.04 3zm0 23.4c-2.06 0-4.07-.55-5.82-1.58l-.42-.25-3.9 1.14 1.2-3.77-.27-.43a10.33 10.33 0 01-1.6-5.5c0-5.72 4.8-10.38 10.8-10.38 5.95 0 10.8 4.66 10.8 10.38 0 5.72-4.85 10.39-10.8 10.39zm5.92-7.8c-.33-.16-1.96-.96-2.27-1.07-.3-.11-.53-.16-.75.16-.22.32-.86 1.07-1.05 1.29-.2.21-.38.24-.71.08-.33-.16-1.4-.5-2.66-1.59-.98-.85-1.64-1.9-1.84-2.22-.19-.32-.02-.49.15-.65.15-.14.33-.38.49-.57.16-.19.22-.32.33-.54.11-.21.05-.4-.03-.57-.08-.16-.75-1.78-1.03-2.44-.27-.64-.54-.55-.75-.56h-.64c-.22 0-.57.08-.87.4-.3.32-1.14 1.11-1.14 2.7s1.17 3.13 1.33 3.34c.16.22 2.3 3.53 5.57 4.95.78.34 1.39.54 1.87.69.79.25 1.5.21 2.06.13.63-.09 1.96-.8 2.24-1.58.27-.78.27-1.45.19-1.58-.08-.13-.3-.21-.63-.38z" />
  </svg>
);

/** Instagram glyph. */
const InstagramGlyph = ({ className = "" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

/**
 * ShareDialog — a premium tooltip-style popover that springs out of the Share
 * button (GSAP). Icon-only options with hover micro-animations: WhatsApp first,
 * then SMS, Instagram, Copy link. Anchored above the trigger.
 */
export default function ShareDialog({ open, onClose, shareText, mapUrl }) {
  const popRef = useRef(null);
  const [copied, setCopied] = useState(false);

  // GSAP spring-in for the panel + each chip.
  useLayoutEffect(() => {
    if (!open) return;
    const el = popRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.set(el, { visibility: "visible" });
      gsap.fromTo(
        el,
        { autoAlpha: 0, y: 14, scale: 0.8, transformOrigin: "left bottom" },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.38, ease: "back.out(2.2)" }
      );
      gsap.fromTo(
        el.querySelectorAll("[data-share-item]"),
        { opacity: 0, y: 14, scale: 0.4 },
        { opacity: 1, y: 0, scale: 1, duration: 0.42, stagger: 0.06, ease: "back.out(2.8)", delay: 0.1 }
      );
    }, el);
    return () => ctx.revert();
  }, [open]);

  // Close on Escape / outside click (ignores the trigger in the same wrapper).
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    const onDown = (e) => {
      const wrapper = popRef.current?.parentElement;
      if (wrapper && !wrapper.contains(e.target)) onClose();
    };
    window.addEventListener("keydown", onKey);
    const id = setTimeout(() => window.addEventListener("mousedown", onDown), 0);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onDown);
      clearTimeout(id);
    };
  }, [open, onClose]);

  if (!open) return null;

  // WhatsApp / SMS carry the full formatted message (📍 venue + address + Maps
  // link). Copy Link copies ONLY the exact Google Maps venue URL.
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
  const smsUrl = `sms:?&body=${encodeURIComponent(shareText)}`;

  const copyLink = async () => {
    const link = mapUrl || shareText;
    let ok = false;
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(link);
        ok = true;
      } catch {
        ok = false;
      }
    }
    if (!ok) {
      try {
        const ta = document.createElement("textarea");
        ta.value = link;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        ok = document.execCommand("copy");
        document.body.removeChild(ta);
      } catch {
        ok = false;
      }
    }
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  // Open a URL in a new tab WITHOUT triggering a re-render/close flash: we close
  // the popover only after the new tab is requested, and never navigate the
  // current page.
  const openExternal = (href) => {
    window.open(href, "_blank", "noopener,noreferrer");
    onClose();
  };

  const openInstagram = () => {
    copyLink();
    openExternal("https://www.instagram.com/");
  };

  const chip =
    "group relative grid h-12 w-12 place-items-center rounded-full text-white shadow-lg " +
    "transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1.5 hover:scale-110 " +
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-secondary";

  return (
    <div
      ref={popRef}
      role="dialog"
      aria-label="Share venue location"
      style={{ visibility: "hidden" }}
      className="absolute bottom-full left-0 z-50 mb-3.5 flex items-center gap-3.5 rounded-2xl border border-secondary/40 bg-surface/95 px-5 py-4 shadow-[0_18px_50px_rgba(74,4,4,0.28)]"
    >
      {/* WhatsApp */}
      <button data-share-item type="button" onClick={() => openExternal(whatsappUrl)} aria-label="Share on WhatsApp" className={`${chip} bg-[#25D366]`}>
        <span className="pointer-events-none absolute inset-0 rounded-full bg-white/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <WhatsAppIcon className="relative h-6 w-6" />
      </button>
      {/* SMS / Messages */}
      <button data-share-item type="button" onClick={() => openExternal(smsUrl)} aria-label="Share via Message" className={`${chip} bg-[#2f6df6]`}>
        <span className="pointer-events-none absolute inset-0 rounded-full bg-white/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <MessageSquare className="relative h-5 w-5" strokeWidth={2.25} />
      </button>
      {/* Instagram */}
      <button data-share-item type="button" onClick={openInstagram} aria-label="Share on Instagram" className={`${chip} bg-linear-to-tr from-[#f58529] via-[#dd2a7b] to-[#8134af]`}>
        <span className="pointer-events-none absolute inset-0 rounded-full bg-white/25 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <InstagramGlyph className="relative h-5 w-5" />
      </button>
      {/* Copy link */}
      <button data-share-item type="button" onClick={copyLink} aria-label="Copy link" className={`${chip} ${copied ? "bg-secondary" : "bg-primary"}`}>
        {copied ? <Check className="relative h-5 w-5" strokeWidth={2.5} /> : <Link className="relative h-5 w-5" strokeWidth={2.25} />}
      </button>

      {/* pointer tail */}
      <span className="absolute -bottom-1.5 left-9 h-3 w-3 rotate-45 border-b border-r border-secondary/40 bg-surface" />
    </div>
  );
}
