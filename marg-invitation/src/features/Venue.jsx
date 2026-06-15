import Section from "../components/ui/Section";
import Reveal from "../components/ui/Reveal";
import Button from "../components/ui/Button";
import Icon from "../components/ui/Icon";
import { useImageReveal } from "../hooks/useAnimations";
import { IMG } from "../lib/content";

const DETAILS = [
  {
    icon: "location_on",
    title: "Mayor Ramanathan Chettiar Hall",
    text: "Raja Annamalai Puram, Chennai, Tamil Nadu 600028",
  },
  {
    icon: "directions_car",
    title: "Valet Parking",
    text: "Available for all guests at the main entrance.",
  },
];

/** Venue — narrative + framed image with mini map overlay. */
export default function Venue() {
  const imgRef = useImageReveal();

  return (
    <Section id="venue" className="bg-surface-container-low silk-grain">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-16 items-center">
          {/* Narrative */}
          <div className="flex-1 order-2 md:order-1">
            <Reveal as="span" from="fadeUp" className="font-label-caps text-label-caps text-secondary mb-4 block">
              THE VENUE
            </Reveal>
            <Reveal as="h2" from="fadeUp" delay={0.05} className="font-headline-lg text-headline-lg text-primary mb-8">
              A Sanctuary of Love
            </Reveal>
            <Reveal as="p" from="fadeUp" delay={0.1} className="font-body-lg text-body-lg text-on-surface-variant mb-8">
              Set within a recreated traditional Mandapam, our wedding venue
              features hand-carved pillars, thousands of fresh marigolds, and the
              gentle fragrance of incense. It is a space designed to bridge the
              human and the divine.
            </Reveal>

            <div className="space-y-6">
              {DETAILS.map((d) => (
                <Reveal key={d.title} from="fadeUp" className="flex items-start gap-4">
                  <Icon name={d.icon} className="text-secondary pt-1" />
                  <div>
                    <h5 className="font-bold text-primary">{d.title}</h5>
                    <p className="text-on-surface-variant">{d.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal from="fadeUp">
              <Button variant="primary" className="mt-12 px-12 py-5 tracking-widest hover:bg-secondary">
                GET DIRECTIONS
              </Button>
            </Reveal>
          </div>

          {/* Image + mini map */}
          <div className="flex-1 order-1 md:order-2 w-full">
            <div className="relative p-4 border border-outline-variant">
              <div ref={imgRef} className="aspect-square overflow-hidden">
                <img src={IMG.venue} alt="Grand South Indian wedding hall" className="w-full h-full object-cover" />
              </div>
              <div className="absolute bottom-10 right-10 w-40 h-40 bg-white shadow-2xl p-1 border-2 border-secondary/50">
                <div className="w-full h-full bg-surface-variant flex items-center justify-center overflow-hidden relative">
                  <img src={IMG.venueMap} alt="Map of Chennai" className="w-full h-full object-cover grayscale opacity-50" />
                  <Icon name="location_on" className="absolute text-primary text-3xl" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
