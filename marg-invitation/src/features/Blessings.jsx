import Section from "../components/ui/Section";
import Reveal from "../components/ui/Reveal";
import Icon from "../components/ui/Icon";
import { useStagger } from "../hooks/useAnimations";
import { BLESSINGS } from "../lib/content";

/** Blessings — gold section with quote + 4 virtue icons (staggered). */
export default function Blessings() {
  const gridRef = useStagger({ from: "fadeUp", stagger: 0.12 });

  return (
    <Section id="blessings" className="bg-secondary text-on-secondary" pad={false}>
      <div className="py-section-gap relative">
        <div className="absolute inset-0 bg-primary/20" />
        <div className="max-w-4xl mx-auto text-center relative z-10 px-container-padding">
          <Reveal from="scaleIn">
            <Icon name="favorite" className="text-on-secondary-container text-6xl mb-8" />
          </Reveal>
          <Reveal as="h2" from="fadeUp" delay={0.05} className="font-headline-lg text-headline-lg mb-8">
            With the Blessings of the Divine
          </Reveal>
          <Reveal as="p" from="fadeUp" delay={0.1} className="font-quote text-quote italic mb-12">
            "May your union be as timeless as the stones of Thanjavur, and as
            fragrant as the jasmine of Madurai."
          </Reveal>

          <div ref={gridRef} className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {BLESSINGS.map((b) => (
              <div key={b.label} className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-on-secondary/10 flex items-center justify-center mb-4">
                  <Icon name={b.icon} />
                </div>
                <span className="font-label-caps text-xs">{b.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
