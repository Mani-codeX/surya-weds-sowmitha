import Section from "../components/ui/Section";
import Reveal from "../components/ui/Reveal";
import { useStagger } from "../hooks/useAnimations";
import { RITUALS } from "../lib/content";

/** Rituals — dark maroon section, 3 Mandapam cards (staggered reveal). */
export default function Rituals() {
  const gridRef = useStagger({ from: "fadeUp", stagger: 0.18 });

  return (
    <Section id="rituals" className="bg-primary text-on-primary overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="kolam-bg h-full w-full" />
      </div>

      <div className="relative z-10">
        <div className="text-center mb-section-gap">
          <Reveal as="span" from="fadeUp" className="font-label-caps text-label-caps text-secondary-fixed mb-4 inline-block">
            THE SACRED RITES
          </Reveal>
          <Reveal as="h2" from="fadeUp" delay={0.05} className="font-headline-lg text-headline-lg text-on-primary">
            The Path to Eternal Union
          </Reveal>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-grid-gutter">
          {RITUALS.map((r) => (
            <div key={r.title} className="mandapam-card bg-primary-container p-8 border-secondary/30 group">
              <div className="aspect-square mb-8 overflow-hidden rounded-lg">
                <img
                  src={r.img}
                  alt={r.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <h4 className="font-headline-md text-headline-md text-secondary-fixed mb-4">
                {r.title}
              </h4>
              <p className="text-on-primary-container/80 font-body-md">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
