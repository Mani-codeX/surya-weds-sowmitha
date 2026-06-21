import { useEffect, useRef, useState } from "react";
import { gsap } from "../lib/gsap";
import { Music, VolumeX } from "../lib/icons";
import trackUrl from "../assets/audio/wedding_music.mp3";

const KEY_ENABLED = "musicEnabled"; // "true" | "false"
const KEY_POSITION = "musicPosition"; // seconds (string)

const TARGET_VOLUME = 0.25; // 25% — premium, not intrusive
const FADE_IN = 2.5; // seconds
const FADE_OUT = 1.5; // seconds
const UNLOCK_EVENTS = ["click", "touchstart", "pointerdown", "scroll", "wheel"];

/**
 * MusicToggle — automatic, premium, seamless background music.
 *
 * Lifecycle (all driven by one persistent <audio> element + module-level refs,
 * so React never recreates audio and never re-renders in a loop):
 *
 *   1. On load, unless the user explicitly turned music OFF before, we ATTEMPT
 *      autoplay (starting at volume 0 and fading in 2.5s).
 *   2. If the browser blocks autoplay (Chrome/Safari/iOS/Android), we silently
 *      arm a ONE-TIME unlock on the first click/touch/pointer/scroll/wheel —
 *      no error, no popup. That interaction starts + fades in the music, then
 *      every unlock listener is removed.
 *   3. The floating button toggles play/pause with fade-out/fade-in.
 *
 * Persistence:
 *   - musicEnabled: explicit OFF survives refresh (no autoplay); ON / first
 *     visit autoplays.
 *   - musicPosition: saved every few seconds; restored so playback resumes from
 *     the exact point instead of restarting.
 *
 * Animation (GSAP, transform + opacity only): playing → glow pulse + heartbeat
 * + rotating ring; start → one-time ripple + particle burst; paused → static.
 */
export default function MusicToggle() {
  const audioRef = useRef(null);
  const fadeRef = useRef(null); // current volume-fade tween (so we can kill it)
  const btnRef = useRef(null);
  const ringRef = useRef(null);
  const glowRef = useRef(null);
  const rippleRef = useRef(null);
  const particlesRef = useRef(null);
  const loopRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  // ── Audio setup + autoplay/unlock (run once) ──
  useEffect(() => {
    const audio = new Audio(trackUrl);
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = 0;
    audioRef.current = audio;

    let unlockArmed = false;
    let unlockHandler = null; // tracked so cleanup can remove it reliably

    const fadeTo = (vol, dur) => {
      fadeRef.current?.kill();
      fadeRef.current = gsap.to(audio, {
        volume: vol,
        duration: dur,
        ease: "sine.inOut",
        onComplete: () => {
          if (vol === 0) audio.pause();
        },
      });
    };

    // Unmute (if needed) + fade the volume up to the target. Used by both the
    // first-interaction unlock and the unaudible→audible transition.
    const makeAudible = () => {
      audio.muted = false;
      fadeTo(TARGET_VOLUME, FADE_IN);
      localStorage.setItem(KEY_ENABLED, "true");
    };

    // One-time first-interaction listener: unmute + fade in, then self-remove.
    const armUnlock = () => {
      if (unlockArmed) return;
      unlockArmed = true;
      unlockHandler = () => {
        UNLOCK_EVENTS.forEach((e) => window.removeEventListener(e, unlockHandler));
        unlockHandler = null;
        if (localStorage.getItem(KEY_ENABLED) === "false") return;
        // Ensure it's actually playing (in case even muted autoplay was denied),
        // then make it audible.
        if (audio.paused) audio.play().catch(() => {});
        makeAudible();
      };
      UNLOCK_EVENTS.forEach((e) =>
        window.addEventListener(e, unlockHandler, { passive: true })
      );
    };

    // ── events ──
    const onLoaded = () => console.log("Audio Loaded");
    const onError = () =>
      console.error("Audio Error — could not load track", audio.error);
    // "playing" (for the icon/glow) means AUDIBLE — actually playing AND not
    // muted. During muted-autoplay the element is technically playing but
    // silent, so the button must still read as OFF until the user unmutes.
    const syncState = () => setPlaying(!audio.paused && !audio.muted);
    const onPlay = syncState;
    const onPause = syncState;
    const onVolume = syncState; // fires on muted/volume changes
    const onTime = () => {
      if (!audio.paused) {
        localStorage.setItem(KEY_POSITION, audio.currentTime.toFixed(1));
      }
    };

    audio.addEventListener("canplaythrough", onLoaded);
    audio.addEventListener("error", onError);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("volumechange", onVolume);
    audio.addEventListener("timeupdate", onTime);

    // Restore saved position once metadata is known.
    audio.addEventListener(
      "loadedmetadata",
      () => {
        const t = parseFloat(localStorage.getItem(KEY_POSITION) || "0");
        if (t > 0 && t < (audio.duration || Infinity)) audio.currentTime = t;
      },
      { once: true }
    );

    // Decide initial behaviour. Explicit OFF → stay silent. Otherwise (ON or
    // first visit) → start playing IMMEDIATELY but MUTED. Browsers allow muted
    // autoplay, so the song begins (and its position advances) the instant the
    // page loads. We then arm a one-time interaction listener to UNMUTE + fade
    // in — so it becomes audible on the user's first scroll/tap/click. If even
    // muted autoplay is denied, the same listener will start it on interaction.
    if (localStorage.getItem(KEY_ENABLED) !== "false") {
      audio.muted = true;
      audio.volume = TARGET_VOLUME; // ready under the mute, so unmute is instant
      audio.play().catch(() => {});
      armUnlock();
    }

    return () => {
      fadeRef.current?.kill();
      if (unlockHandler) {
        UNLOCK_EVENTS.forEach((e) => window.removeEventListener(e, unlockHandler));
      }
      audio.removeEventListener("canplaythrough", onLoaded);
      audio.removeEventListener("error", onError);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("volumechange", onVolume);
      audio.removeEventListener("timeupdate", onTime);
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  // ── Button animations driven by `playing` ──
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (playing) {
        console.log("Music Started");

        gsap.fromTo(
          rippleRef.current,
          { scale: 0.6, opacity: 0.6 },
          { scale: 2.4, opacity: 0, duration: 1, ease: "power2.out" }
        );

        const dots = particlesRef.current.querySelectorAll("span");
        dots.forEach((dot, i) => {
          const ang = (i / dots.length) * Math.PI * 2;
          gsap.fromTo(
            dot,
            { x: 0, y: 0, opacity: 1, scale: 1 },
            {
              x: Math.cos(ang) * gsap.utils.random(26, 40),
              y: Math.sin(ang) * gsap.utils.random(26, 40),
              opacity: 0,
              scale: 0.3,
              duration: 1,
              ease: "power2.out",
            }
          );
        });

        const tl = gsap.timeline();
        tl.to(btnRef.current, {
          scale: 1.08,
          duration: 0.9,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          transformOrigin: "50% 50%",
        });
        tl.to(
          glowRef.current,
          { opacity: 0.55, scale: 1.25, duration: 1.4, ease: "sine.inOut", yoyo: true, repeat: -1 },
          0
        );
        tl.to(
          ringRef.current,
          { rotation: 360, duration: 8, ease: "none", repeat: -1, transformOrigin: "50% 50%" },
          0
        );
        loopRef.current = tl;
      } else {
        console.log("Music Paused");
        loopRef.current?.kill();
        loopRef.current = null;
        gsap.to(btnRef.current, { scale: 1, duration: 0.4, ease: "power2.out" });
        gsap.to(glowRef.current, { opacity: 0, scale: 1, duration: 0.4 });
        gsap.set(ringRef.current, { rotation: 0 });
      }
    });
    return () => ctx.revert();
  }, [playing]);

  // ── Manual toggle ──
  // One click reliably flips AUDIBLE on/off. `playing` already means audible
  // (playing && !muted), so we key off that — no more "first click only unmutes,
  // second click plays" ambiguity. Turning OFF is INSTANT (state flips now; the
  // fade is purely cosmetic and never delays the pause feel).
  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    fadeRef.current?.kill();

    if (playing) {
      // ── turn OFF — instant ──
      setPlaying(false);
      localStorage.setItem(KEY_ENABLED, "false");
      // brief cosmetic fade, but pause right away-ish so there's no lag
      fadeRef.current = gsap.to(audio, {
        volume: 0,
        duration: 0.4,
        ease: "power2.out",
        onComplete: () => {
          audio.pause();
          audio.muted = true; // reset so a future muted-autoplay works
        },
      });
    } else {
      // ── turn ON — single click, always audible ──
      audio.muted = false;
      audio.volume = 0;
      setPlaying(true); // optimistic; volumechange/play events keep it honest
      localStorage.setItem(KEY_ENABLED, "true");
      const p = audio.paused ? audio.play() : Promise.resolve();
      p
        .then(() => {
          fadeRef.current = gsap.to(audio, {
            volume: TARGET_VOLUME,
            duration: FADE_IN,
            ease: "sine.inOut",
          });
        })
        .catch((err) => {
          setPlaying(false);
          if (err?.name === "NotSupportedError") {
            console.error("Audio Error — no playable source for the track.");
          } else {
            console.error("Audio Error — play() rejected", err);
          }
        });
    }
  };

  return (
    <button
      ref={btnRef}
      type="button"
      onClick={toggle}
      aria-label={playing ? "Pause Music" : "Play Music"}
      aria-pressed={playing}
      className="fixed bottom-6 right-6 z-[70] flex h-12 w-12 items-center justify-center rounded-full border border-secondary/40 bg-primary text-secondary-fixed shadow-xl"
    >
      <span
        ref={glowRef}
        className="absolute inset-0 rounded-full opacity-0"
        style={{
          background:
            "radial-gradient(circle, rgba(233,193,118,0.6), rgba(233,193,118,0) 70%)",
        }}
      />
      <span
        ref={ringRef}
        className="absolute inset-[-4px] rounded-full border border-dashed border-secondary-fixed/50"
      />
      <span
        ref={rippleRef}
        className="absolute inset-0 rounded-full border border-secondary-fixed/60 opacity-0"
      />
      <span ref={particlesRef} className="absolute inset-0 flex items-center justify-center">
        {Array.from({ length: 6 }).map((_, i) => (
          <span key={i} className="absolute h-1 w-1 rounded-full bg-secondary-fixed opacity-0" />
        ))}
      </span>
      {playing ? (
        <Music className="relative h-5 w-5" />
      ) : (
        <VolumeX className="relative h-5 w-5" />
      )}
    </button>
  );
}
