import { useLayoutEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "../lib/gsap";
import { useResponsive } from "../hooks/useResponsive";
import ProtectedImage from "../components/ProtectedImage";
import { WED_IMG } from "../lib/weddingImages";
import { COUPLE } from "../lib/content";

const MESSAGE = [
  "Every blessing,",
  "every prayer,",
  "and every word of encouragement",
  "has guided us to this beautiful moment.",
  "",
  "As we begin this new chapter together,",
  "we carry your love and blessings in our hearts.",
  "",
  "Thank you for being part of our journey.",
];

const STORAGE_KEY = "guestBlessing";
const PLACEHOLDER = "May your journey together be filled with love and happiness.";

/**
 * Blessings — "A Message From Our Hearts" gratitude note + a premium wedding
 * guestbook: the visitor shares ONE blessing (localStorage-gated). On submit, a
 * cinematic reveal plays — heaven glow, pulsing heart, rose petals, and the
 * blessing typed in letter by letter. transform + opacity only (no
 * backdrop-filter), honours reduced motion.
 */
export default function Blessings() {
  const rootRef = useRef(null);
  const imgRef = useRef(null);
  const labelRef = useRef(null);
  const headingRef = useRef(null);
  const linesRef = useRef(null);
  const signRef = useRef(null);
  const glowRef = useRef(null);
  const heartRef = useRef(null);
  const wishRef = useRef(null);
  const typeTimer = useRef(null);
  const { prefersReducedMotion } = useResponsive();

  // saved blessing (persisted) → once set, the visitor can't submit again
  const [saved, setSaved] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || "";
    } catch {
      return "";
    }
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [typed, setTyped] = useState(saved); // letters revealed so far

  // Letter-by-letter reveal of the saved blessing + heaven/heart/petals.
  const playReveal = (text) => {
    setTyped("");
    requestAnimationFrame(() => {
      const glow = glowRef.current;
      const heart = heartRef.current;
      if (prefersReducedMotion) {
        gsap.set([glow, heart], { opacity: 1, scale: 1 });
        setTyped(text);
        return;
      }
      gsap.killTweensOf([glow, heart]);
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .fromTo(glow, { opacity: 0, scale: 0.3 }, { opacity: 1, scale: 1, duration: 1.1, ease: "power2.out" }, 0)
        .fromTo(heart, { opacity: 0, y: 24, scale: 0.4 }, { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: "back.out(2)" }, 0.2);

      // type the blessing in, letter by letter, after the heart lands
      let i = 0;
      clearInterval(typeTimer.current);
      setTimeout(() => {
        typeTimer.current = setInterval(() => {
          i += 1;
          setTyped(text.slice(0, i));
          if (i >= text.length) clearInterval(typeTimer.current);
        }, 38);
      }, 700);
    });
  };

  const submit = (e) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    try {
      localStorage.setItem(STORAGE_KEY, text);
    } catch {
      /* storage blocked — still show it this session */
    }
    setSaved(text);
    setModalOpen(false);
    playReveal(text);
  };

  useLayoutEffect(() => () => clearInterval(typeTimer.current), []);

  // Gratitude reveal on scroll (image → heading → message → signature).
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const ctx = gsap.context(() => {
      const lines = linesRef.current.children;
      if (prefersReducedMotion) {
        gsap.set([imgRef.current, labelRef.current, headingRef.current, ...lines, signRef.current], { opacity: 1, y: 0, scale: 1 });
        return;
      }
      gsap.set(imgRef.current, { opacity: 0, scale: 1.06 });
      gsap.set([labelRef.current, headingRef.current], { opacity: 0, y: 30 });
      gsap.set(lines, { opacity: 0, y: 22 });
      gsap.set(signRef.current, { opacity: 0, y: 20, scale: 0.96 });

      gsap
        .timeline({ defaults: { ease: "power3.out" }, scrollTrigger: { trigger: root, start: "top 70%", once: true } })
        .to(imgRef.current, { opacity: 1, scale: 1, duration: 2, ease: "power2.out" }, 0)
        .to(labelRef.current, { opacity: 1, y: 0, duration: 1 }, 0.6)
        .to(headingRef.current, { opacity: 1, y: 0, duration: 1.2 }, 0.8)
        .to(lines, { opacity: 1, y: 0, duration: 1, stagger: 0.22 }, 1.4)
        .to(signRef.current, { opacity: 1, y: 0, scale: 1, duration: 1.3, ease: "back.out(1.4)" }, "+=0.3");

      ScrollTrigger.refresh();
    }, root);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section
      ref={rootRef}
      id="blessings"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-primary py-section-gap text-on-primary"
    >
      {/* Softly-blended couple image */}
      <div className="absolute inset-0 z-0">
        <ProtectedImage
          ref={imgRef}
          src={WED_IMG.img13}
          alt="Surya & Sowmitha"
          className="h-full w-full object-cover opacity-0"
          style={{
            objectPosition: "center 25%",
            WebkitMaskImage: "radial-gradient(ellipse 90% 80% at 50% 40%, #000 30%, transparent 78%)",
            maskImage: "radial-gradient(ellipse 90% 80% at 50% 40%, #000 30%, transparent 78%)",
          }}
        />
        <div className="absolute inset-0 bg-primary/65" />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 70% 70% at 50% 50%, rgba(233,193,118,0.10), transparent 70%)" }} />
      </div>

      <Bokeh />

      {/* Message */}
      <div className="relative z-10 mx-auto max-w-3xl px-mobile-margin text-center md:px-container-padding">
        <span ref={labelRef} className="block font-label-caps text-label-caps tracking-[0.4em] text-secondary-fixed [text-shadow:0_2px_12px_rgba(0,0,0,0.5)]">
          WITH GRATITUDE
        </span>
        <h2 ref={headingRef} className="mt-5 font-headline-lg text-3xl text-secondary-fixed md:text-headline-lg [text-shadow:0_2px_16px_rgba(0,0,0,0.5)]">
          A Message From Our Hearts
        </h2>

        <div ref={linesRef} className="mt-10 font-quote text-lg italic leading-relaxed text-on-primary/90 md:text-2xl">
          {MESSAGE.map((line, i) =>
            line === "" ? (
              <span key={i} className="block h-4 md:h-6" aria-hidden="true" />
            ) : (
              <p key={i} className="[text-shadow:0_2px_14px_rgba(0,0,0,0.55)]">
                {line}
              </p>
            )
          )}
        </div>

        <p ref={signRef} className="mt-12 font-display-lg text-3xl text-secondary-fixed md:text-4xl [text-shadow:0_0_30px_rgba(233,193,118,0.45),0_2px_10px_rgba(0,0,0,0.5)]">
          ❤️ {COUPLE.groom} &amp; {COUPLE.bride}
        </p>

        {/* ── Guestbook ── */}
        <div className="relative mt-14 flex flex-col items-center">
          {/* heaven glow + heart + the revealed blessing (after submission) */}
          {saved && (
            <div className="relative mb-10 flex w-full flex-col items-center">
              <span
                ref={glowRef}
                className="heaven-glow pointer-events-none absolute left-1/2 top-1/2 z-0 h-[160%] w-[120%]"
                aria-hidden="true"
                style={{ background: "radial-gradient(ellipse at center, rgba(233,193,118,0.26), rgba(233,193,118,0.08) 42%, transparent 72%)" }}
              />
              <Petals />
              <span
                ref={heartRef}
                className="heart-beat relative z-10 mb-5 block text-4xl md:text-5xl"
                style={{ filter: "drop-shadow(0 0 18px rgba(233,193,118,0.6))" }}
                aria-hidden="true"
              >
                💛
              </span>
              <p ref={wishRef} className="blessing-text relative z-10 max-w-xl font-quote text-xl italic leading-relaxed md:text-3xl">
                “{typed}”
              </p>
              <p className="relative z-10 mt-5 font-label-caps text-[0.7rem] tracking-[0.3em] text-secondary-fixed/90">
                — WITH LOVE
              </p>
              <p className="relative z-10 mt-8 font-quote text-base italic text-on-primary/70">
                💛 Thank you for sharing your blessing.
              </p>
            </div>
          )}

          {/* share button — only until the visitor has submitted once */}
          {!saved && (
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="blessing-cta group inline-flex items-center gap-3 rounded-full border border-secondary-fixed/60 bg-secondary-fixed/15 px-9 py-4 font-label-caps text-label-caps tracking-widest text-secondary-fixed transition-transform duration-300 hover:scale-105"
            >
              💌 SHARE YOUR BLESSING
            </button>
          )}
        </div>
      </div>

      {/* ── Share modal ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <button type="button" aria-label="Close" onClick={() => setModalOpen(false)} className="absolute inset-0 bg-primary/75" />
          <form
            onSubmit={submit}
            className="relative z-10 w-full max-w-md rounded-3xl border border-secondary-fixed/40 bg-surface p-8 text-left text-on-surface shadow-2xl"
            style={{ backgroundImage: "linear-gradient(160deg, rgba(233,193,118,0.10), transparent 55%)" }}
          >
            <span className="pointer-events-none absolute inset-2.5 rounded-[1.4rem] border border-secondary/25" />
            <h3 className="mb-1 text-center font-headline-md text-2xl text-primary">Share Your Blessing</h3>
            <p className="mb-6 text-center font-body-md text-sm text-on-surface-variant">For {COUPLE.groom} &amp; {COUPLE.bride}</p>

            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              required
              rows={4}
              maxLength={240}
              placeholder={`Write your blessing for the couple…\ne.g. ${PLACEHOLDER}`}
              className="mb-6 w-full resize-none rounded-xl border border-outline-variant bg-transparent px-4 py-3 font-quote text-lg italic text-on-surface placeholder:text-on-surface-variant/45 focus:border-secondary focus:outline-none"
            />

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="flex-1 rounded-full border border-outline-variant py-3 font-label-caps text-xs tracking-widest text-on-surface-variant transition-colors hover:border-secondary hover:text-primary"
              >
                CANCEL
              </button>
              <button
                type="submit"
                className="blessing-cta flex-1 rounded-full bg-primary py-3 font-label-caps text-xs tracking-widest text-on-primary transition-transform hover:scale-[1.03]"
              >
                ✨ SEND BLESSING
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}

/** Soft floating golden bokeh — a few blurred dots drifting slowly. */
function Bokeh() {
  const ref = useRef(null);
  const { prefersReducedMotion } = useResponsive();
  useLayoutEffect(() => {
    if (prefersReducedMotion) return;
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      el.querySelectorAll("span").forEach((dot, i) => {
        gsap.to(dot, {
          y: i % 2 ? -28 : -40,
          x: i % 2 ? 16 : -14,
          opacity: 0.5,
          duration: gsap.utils.random(6, 10),
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          delay: i * 0.6,
        });
      });
    }, el);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  const dots = [
    "left-[12%] top-[22%] h-3 w-3",
    "left-[80%] top-[18%] h-2 w-2",
    "left-[24%] top-[72%] h-2.5 w-2.5",
    "left-[68%] top-[68%] h-3.5 w-3.5",
    "left-[48%] top-[30%] h-2 w-2",
    "left-[88%] top-[55%] h-2.5 w-2.5",
  ];
  return (
    <div ref={ref} className="pointer-events-none absolute inset-0 z-[5]" aria-hidden="true">
      {dots.map((c, i) => (
        <span key={i} className={`absolute rounded-full bg-secondary-fixed/30 ${c}`} style={{ filter: "blur(2px)", opacity: 0.25 }} />
      ))}
    </div>
  );
}

/** Soft rose petals drifting up around the revealed blessing. */
function Petals() {
  const ref = useRef(null);
  const { prefersReducedMotion } = useResponsive();
  useLayoutEffect(() => {
    if (prefersReducedMotion) return;
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      el.querySelectorAll("span").forEach((p, i) => {
        gsap.fromTo(
          p,
          { y: 30, opacity: 0, rotateZ: 0 },
          {
            y: -60,
            opacity: 0.7,
            rotateZ: i % 2 ? 40 : -40,
            duration: gsap.utils.random(5, 8),
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            delay: i * 0.5,
          }
        );
      });
    }, el);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  const petals = ["left-[18%] top-[40%]", "left-[82%] top-[30%]", "left-[30%] top-[70%]", "left-[72%] top-[64%]", "left-[50%] top-[18%]"];
  return (
    <div ref={ref} className="pointer-events-none absolute inset-0 z-[6]" aria-hidden="true">
      {petals.map((c, i) => (
        <span key={i} className={`absolute text-base opacity-0 ${c}`}>
          🌸
        </span>
      ))}
    </div>
  );
}
