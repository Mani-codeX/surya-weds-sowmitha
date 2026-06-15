import Section from "../components/ui/Section";
import Reveal from "../components/ui/Reveal";
import Button from "../components/ui/Button";
import { useImageReveal } from "../hooks/useAnimations";
import { IMG } from "../lib/content";

/** Heritage — staggered editorial layout: image card (mask reveal) + narrative. */
export default function Heritage() {
  const imgRef = useImageReveal();

  return (
    <Section id="heritage">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-grid-gutter items-center">
        {/* Image */}
        <div className="md:col-span-5 relative group">
          {/* PERF: grayscale-[0.2] moved to this static wrapper. On the
              hover-scaling <img> the filter re-rasterized every transform frame;
              on the non-animating parent it rasterizes once. */}
          <div
            ref={imgRef}
            className="aspect-[3/4] overflow-hidden rounded-lg shadow-2xl border-4 border-secondary/20 grayscale-[0.2]"
          >
            <img
              src={IMG.heritage}
              alt="Intricate Thanjavur painting with gold foil"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
            />
          </div>
          <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-primary-container p-6 rounded-lg text-on-primary shadow-xl hidden md:block">
            <p className="font-label-caps text-xs tracking-widest mb-4">ESTD. 2024</p>
            <p className="font-headline-md text-xl leading-tight">
              Carrying forward the Chola Legacy
            </p>
          </div>
        </div>

        {/* Narrative */}
        <div className="md:col-span-6 md:col-start-7 flex flex-col gap-element-gap">
          <Reveal as="span" from="fadeUp" className="font-label-caps text-label-caps text-secondary">
            THE ANCESTRY
          </Reveal>
          <Reveal as="h2" from="fadeUp" delay={0.05} className="font-headline-lg text-headline-lg text-primary">
            A Tale Written in Stone and Silk
          </Reveal>
          <Reveal as="p" from="fadeUp" delay={0.1} className="font-body-lg text-body-lg text-on-surface-variant">
            Our story begins in the heart of Tamil Nadu, where the gopurams touch
            the clouds and the sound of temple bells echoes through time. Aparna,
            a descendant of the Kaveri delta's artist lineage, and Raghav, whose
            family has protected the temple traditions for generations, unite
            under the blessings of our ancestors.
          </Reveal>
          <Reveal from="fadeUp" delay={0.15} className="mt-8 flex flex-wrap gap-4">
            <Button variant="primary">READ OUR STORY</Button>
            <Button variant="secondary">VIEW GALLERY</Button>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
