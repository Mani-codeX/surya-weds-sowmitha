import Reveal from "../components/ui/Reveal";
import { IMG } from "../lib/content";

const GoldMotif = ({ className = "" }) => (
  <svg className={className} fill="none" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M50 0C50 27.6142 27.6142 50 0 50C27.6142 50 50 72.3858 50 100C50 72.3858 72.3858 50 100 50C72.3858 50 50 27.6142 50 0Z"
      fill="currentColor"
    />
  </svg>
);

/** Save the Date — cinematic full-bleed image with dark overlay + gold motifs. */
export default function SaveTheDate() {
  return (
    <section className="h-screen flex items-center justify-center relative">
      {/* PERF: brightness-[0.4] filter on a full-screen image is an expensive
          rasterization. Replaced with a plain dark overlay (composited, free). */}
      <div className="absolute inset-0 z-0">
        <img
          src={IMG.saveTheDate}
          alt="Ancient stone temple corridor"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-primary/60" />
      </div>

      <div className="relative z-10 text-center px-container-padding">
        <Reveal from="fade" className="mb-8 border-y border-secondary/50 py-4 inline-block">
          <span className="font-label-caps text-label-caps text-secondary-fixed-dim tracking-[0.5em]">
            SAVE THE DATE
          </span>
        </Reveal>
        <Reveal as="h2" from="fadeUp" delay={0.1} className="font-display-lg text-[10vw] md:text-[8vw] text-on-primary leading-none mb-12 [text-shadow:0_4px_24px_rgba(0,0,0,0.5)]">
          12 . 12 . 24
        </Reveal>
        <Reveal from="fadeUp" delay={0.2} className="flex flex-col items-center gap-6">
          <span className="font-headline-md text-secondary-fixed">
            THE MAYOR RAMANATHAN CHETTIAR HALL
          </span>
          <span className="font-body-lg text-surface-container-lowest tracking-widest">
            CHENNAI, TAMIL NADU
          </span>
        </Reveal>
      </div>

      <div className="absolute top-1/2 left-10 -translate-y-1/2 w-32 h-32 opacity-30">
        <GoldMotif className="text-secondary-fixed" />
      </div>
      <div className="absolute top-1/2 right-10 -translate-y-1/2 w-32 h-32 opacity-30">
        <GoldMotif className="text-secondary-fixed scale-x-[-1]" />
      </div>
    </section>
  );
}
