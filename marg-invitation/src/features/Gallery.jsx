import Section from "../components/ui/Section";
import Reveal from "../components/ui/Reveal";
import { GALLERY } from "../lib/content";

/** Gallery — asymmetric bento grid, images scale on hover. */
export default function Gallery() {
  return (
    <Section id="gallery">
      <div className="mb-16">
        <Reveal as="h2" from="fadeUp" className="font-headline-lg text-headline-lg text-primary text-center">
          Glimpses of Forever
        </Reveal>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[300px]">
        {GALLERY.map((g, i) => (
          <div
            key={i}
            className={`overflow-hidden group border border-outline-variant ${g.span}`}
          >
            <img
              src={g.img}
              alt="Wedding gallery"
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
            />
          </div>
        ))}
      </div>
    </Section>
  );
}
