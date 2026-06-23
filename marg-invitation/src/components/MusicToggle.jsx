import { useEffect, useRef, useState } from "react";
import { gsap } from "../lib/gsap";
import { Music, VolumeX } from "../lib/icons";
import trackUrl from "../assets/audio/wedding_music.mp3";

const KEY_ENABLED = "musicEnabled"; // "true" | "false"

const TARGET_VOLUME = 0.25; // 25% — premium, not intrusive
const FADE_IN = 2.5; // seconds
const UNLOCK_EVENTS = ["pointerdown", "touchstart", "keydown", "scroll", "wheel"];

/**
 * ── Module-level singleton audio ──
 * Created ONCE for the lifetime of the page, OUTSIDE React. This is the real
 * fix for the "works first time, dead after refresh / double audio" bugs:
 * React StrictMode mounts effects twice in dev, and an audio created inside an
 * effect gets torn down + recreated, losing state and sometimes leaving a
 * second silent instance. A module singleton is immune to that.
 */
let audioEl = null;
function getAudio() {
  if (audioEl) return audioEl;
  if (typeof Audio === "undefined") return null;
  const a = new Audio(trackUrl);
  a.loop = true;
  a.preload = "auto";
  a.volume = 0;
  audioEl = a;
  return a;
}

const log = (...args) => console.log("[music]", ...args);

/**
 * MusicToggle — reliable, premium background music.
 *
 * Flow:
 *   - On load, if music wasn't explicitly turned OFF, attempt to resume from
 *     the saved position and fade in.
 *   - If the browser blocks autoplay, show an elegant "Tap anywhere to continue
 *     music" prompt; the first interaction starts playback, then the prompt and
 *     all unlock listeners are removed.
 *   - The floating button toggles audible play/pause.
 *
 * State persisted: musicEnabled (explicit OFF survives refresh) + musicPosition.
 */
export default function MusicToggle() {
  const fadeRef = useRef(null);
  const btnRef = useRef(null);
  const ringRef = useRef(null);
  const glowRef = useRef(null);
  const rippleRef = useRef(null);
  const particlesRef = useRef(null);
  const loopRef = useRef(null);

  const [playing, setPlaying] = useState(false); // audible (playing && !muted)
  const [showPrompt, setShowPrompt] = useState(false); // autoplay-blocked prompt

  const fadeTo = (vol, dur, onDone) => {
    const audio = getAudio();
    if (!audio) return;
    fadeRef.current?.kill();
    fadeRef.current = gsap.to(audio, {
      volume: vol,
      duration: dur,
      ease: "sine.inOut",
      onComplete: onDone,
    });
  };

  // ── Setup: restore + autoplay attempt + unlock fallback (runs once) ──
  useEffect(() => {
    const audio = getAudio();
    if (!audio) return;

    let unlockHandler = null;
    const removeUnlock = () => {
      if (!unlockHandler) return;
      UNLOCK_EVENTS.forEach((e) => window.removeEventListener(e, unlockHandler));
      unlockHandler = null;
    };

    const syncState = () => setPlaying(!audio.paused && !audio.muted && audio.volume > 0.001);

    const onPlay = () => { log("event: play, readyState:", audio.readyState); syncState(); };
    const onPause = () => { log("event: pause"); syncState(); };
    const onVolume = syncState;
    const onError = () => console.error("[music] load error", audio.error);

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("volumechange", onVolume);
    audio.addEventListener("error", onError);

    // Always begin from the start on a fresh page load.
    audio.currentTime = 0;

    // Start audible playback (used by autoplay + the unlock fallback).
    const startAudible = () => {
      audio.muted = false;
      audio.volume = 0;
      return audio
        .play()
        .then(() => {
          log("playback started");
          fadeTo(TARGET_VOLUME, FADE_IN);
          localStorage.setItem(KEY_ENABLED, "true");
          setShowPrompt(false);
          removeUnlock();
        });
    };

    const armUnlock = () => {
      if (unlockHandler) return;
      log("autoplay blocked → arming first-interaction unlock");
      setShowPrompt(true);
      unlockHandler = (ev) => {
        // the button runs its own toggle; don't double-trigger from it
        if (ev?.target?.closest?.("[data-music-toggle]")) return;
        if (localStorage.getItem(KEY_ENABLED) === "false") { removeUnlock(); setShowPrompt(false); return; }
        startAudible().catch((e) => log("unlock play failed", e?.name));
      };
      UNLOCK_EVENTS.forEach((e) =>
        window.addEventListener(e, unlockHandler, { passive: true })
      );
    };

    // Decide initial behaviour: explicit OFF → stay silent; else try to autoplay
    // audibly, and fall back to the unlock prompt if the browser blocks it.
    if (localStorage.getItem(KEY_ENABLED) !== "false") {
      log("attempting autoplay…");
      startAudible().catch((err) => {
        log("autoplay rejected:", err?.name);
        armUnlock();
      });
    }

    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("volumechange", onVolume);
      audio.removeEventListener("error", onError);
      removeUnlock();
      // NOTE: we do NOT pause/destroy the singleton audio here — keeping it
      // alive across StrictMode remounts is what makes refresh + navigation
      // reliable. fadeRef is killed to avoid orphan tweens.
      fadeRef.current?.kill();
    };
  }, []);

  // ── Button animations ──
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (playing) {
        gsap.fromTo(rippleRef.current, { scale: 0.6, opacity: 0.6 }, { scale: 2.4, opacity: 0, duration: 1, ease: "power2.out" });
        const dots = particlesRef.current.querySelectorAll("span");
        dots.forEach((dot, i) => {
          const ang = (i / dots.length) * Math.PI * 2;
          gsap.fromTo(dot, { x: 0, y: 0, opacity: 1, scale: 1 }, {
            x: Math.cos(ang) * gsap.utils.random(26, 40),
            y: Math.sin(ang) * gsap.utils.random(26, 40),
            opacity: 0, scale: 0.3, duration: 1, ease: "power2.out",
          });
        });
        const tl = gsap.timeline();
        tl.to(btnRef.current, { scale: 1.08, duration: 0.9, ease: "sine.inOut", yoyo: true, repeat: -1, transformOrigin: "50% 50%" });
        tl.to(glowRef.current, { opacity: 0.55, scale: 1.25, duration: 1.4, ease: "sine.inOut", yoyo: true, repeat: -1 }, 0);
        tl.to(ringRef.current, { rotation: 360, duration: 8, ease: "none", repeat: -1, transformOrigin: "50% 50%" }, 0);
        loopRef.current = tl;
      } else {
        loopRef.current?.kill();
        loopRef.current = null;
        gsap.to(btnRef.current, { scale: 1, duration: 0.4, ease: "power2.out" });
        gsap.to(glowRef.current, { opacity: 0, scale: 1, duration: 0.4 });
        gsap.set(ringRef.current, { rotation: 0 });
      }
    });
    return () => ctx.revert();
  }, [playing]);

  // ── Manual toggle — single click flips audible on/off ──
  const toggle = () => {
    const audio = getAudio();
    if (!audio) return;
    fadeRef.current?.kill();
    setShowPrompt(false);

    if (playing) {
      log("toggle → OFF");
      setPlaying(false);
      localStorage.setItem(KEY_ENABLED, "false");
      fadeTo(0, 0.4, () => audio.pause());
    } else {
      log("toggle → ON");
      audio.muted = false;
      audio.volume = 0.001;
      localStorage.setItem(KEY_ENABLED, "true");
      setPlaying(true); // optimistic; events keep it honest
      audio
        .play()
        .then(() => { log("toggle play ok"); fadeTo(TARGET_VOLUME, FADE_IN); })
        .catch((err) => {
          console.error("[music] play() rejected", err?.name);
          setPlaying(false);
        });
    }
  };

  return (
    <>
      {/* Autoplay-blocked prompt — elegant, dismisses on first interaction */}
      {showPrompt && (
        <button
          type="button"
          onClick={toggle}
          className="fixed bottom-20 right-6 z-[71] flex items-center gap-2 rounded-full border border-secondary-fixed/40 bg-primary/90 px-4 py-2.5 font-label-caps text-[0.6rem] tracking-widest text-secondary-fixed shadow-xl"
        >
          🎵 TAP TO PLAY MUSIC
        </button>
      )}

      <button
        ref={btnRef}
        type="button"
        data-music-toggle
        onClick={toggle}
        aria-label={playing ? "Pause Music" : "Play Music"}
        aria-pressed={playing}
        className="fixed bottom-6 right-6 z-[70] flex h-12 w-12 items-center justify-center rounded-full border border-secondary/40 bg-primary text-secondary-fixed shadow-xl"
      >
        <span
          ref={glowRef}
          className="absolute inset-0 rounded-full opacity-0"
          style={{ background: "radial-gradient(circle, rgba(233,193,118,0.6), rgba(233,193,118,0) 70%)" }}
        />
        <span ref={ringRef} className="absolute inset-[-4px] rounded-full border border-dashed border-secondary-fixed/50" />
        <span ref={rippleRef} className="absolute inset-0 rounded-full border border-secondary-fixed/60 opacity-0" />
        <span ref={particlesRef} className="absolute inset-0 flex items-center justify-center">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="absolute h-1 w-1 rounded-full bg-secondary-fixed opacity-0" />
          ))}
        </span>
        {playing ? <Music className="relative h-5 w-5" /> : <VolumeX className="relative h-5 w-5" />}
      </button>
    </>
  );
}
