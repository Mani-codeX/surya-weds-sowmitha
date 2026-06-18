import Section from "../components/ui/Section";
import Reveal from "../components/ui/Reveal";
import { useStagger } from "../hooks/useAnimations";
import { RITUALS } from "../lib/content";

/** Rotating mandala RINGS only (no heart) — gets the spin animation. */
const MandalaRings = ({ className = "" }) => (
  <svg viewBox="0 0 200 200" className={className} fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
    {/* concentric rings */}
    <circle cx="100" cy="100" r="92" />
    <circle cx="100" cy="100" r="66" />
    <circle cx="100" cy="100" r="40" />
    {/* 12 spokes + a dot at each spoke tip on the outer/mid rings — same count,
        so dots sit exactly on the spokes (clean, aligned mandala). */}
    {Array.from({ length: 12 }).map((_, i) => {
      const a = (i / 12) * Math.PI * 2 - Math.PI / 2; // start at top
      const cos = Math.cos(a);
      const sin = Math.sin(a);
      return (
        <g key={i}>
          <line x1={100 + cos * 40} y1={100 + sin * 40} x2={100 + cos * 92} y2={100 + sin * 92} />
          <circle cx={100 + cos * 66} cy={100 + sin * 66} r="4.5" />
          <circle cx={100 + cos * 92} cy={100 + sin * 92} r="3" />
        </g>
      );
    })}
  </svg>
);

/**
 * CircleOfLove — a faint backdrop: rotating mandala rings with a STATIC heart
 * at the centre holding a couple initial. The rings spin; the heart + letter
 * stay still.
 */
const CircleOfLove = ({ initial, spinClass, wrapperClass }) => (
  <div className={`pointer-events-none absolute text-secondary-fixed ${wrapperClass}`}>
    {/* spinning rings */}
    <MandalaRings className={`${spinClass} h-full w-full opacity-[0.05]`} />
    {/* static heart + initial at centre */}
    <div className="absolute inset-0 flex items-center justify-center opacity-[0.07]">
      <div className="relative grid place-items-center" style={{ width: "26%", height: "26%" }}>
        <svg viewBox="0 0 32 30" className="absolute inset-0 h-full w-full" fill="currentColor" aria-hidden="true">
          {/* clean, symmetric heart centred on x=16 */}
          <path d="M16 28C6 21 1 15.5 1 9.2 1 5 4.2 2 8 2c3.3 0 6 2 8 5 2-3 4.7-5 8-5 3.8 0 7 3 7 7.2C31 15.5 26 21 16 28z" />
        </svg>
        <span className="relative font-headline-lg text-[clamp(2rem,5vw,4rem)] text-primary">
          {initial}
        </span>
      </div>
    </div>
  </div>
);

/** Rituals / The Celebrations — a gallery of two sacred wedding moments. */
export default function Rituals() {
  const gridRef = useStagger({ from: "fadeUp", stagger: 0.18 });

  return (
    <Section id="rituals" className="relative bg-primary text-on-primary overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="kolam-bg h-full w-full" />
      </div>

      {/* Faint "circle of love" backdrops — desktop only (hidden on mobile). */}
      <CircleOfLove
        initial="S"
        spinClass="mandala-spin"
        wrapperClass="-left-40 top-1/3 hidden h-[34rem] w-[34rem] lg:block"
      />
      <CircleOfLove
        initial="S"
        spinClass="mandala-spin-rev"
        wrapperClass="-right-40 bottom-1/4 hidden h-[34rem] w-[34rem] lg:block"
      />

      <div className="relative z-10">
        <div className="text-center mb-12 md:mb-20">
          <Reveal as="span" from="fadeUp" className="font-label-caps text-label-caps text-secondary-fixed mb-4 inline-block">
            THE CELEBRATIONS
          </Reveal>
          <Reveal as="h2" from="fadeUp" delay={0.05} className="font-headline-lg text-headline-lg text-on-primary">
            From Promise to Forever
          </Reveal>
        </div>

        {/* Two cards occupying ~75% of the container, with generous spacing. */}
        <div
          ref={gridRef}
          className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-10 md:grid-cols-2 md:gap-14"
        >
          {RITUALS.map((r) => (
            <div
              key={r.title}
              className="mandapam-card group bg-primary-container p-8 md:p-10 border-secondary/30 shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="aspect-[16/10] mb-6 overflow-hidden rounded-lg">
                <img
                  src={r.img}
                  alt={r.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <h4 className="mb-4 font-headline-md text-3xl md:text-4xl font-semibold text-secondary">
                {r.title}
              </h4>
              <p className="font-body-md text-base leading-relaxed text-on-secondary-container">
                {r.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
