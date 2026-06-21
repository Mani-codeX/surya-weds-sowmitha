import Section from "../components/ui/Section";
import Reveal from "../components/ui/Reveal";
import ProtectedImage from "../components/ProtectedImage";
import { WED_IMG } from "../lib/weddingImages";
import { GALLERY } from "../lib/content";

/** Gallery — asymmetric bento grid, images scale on hover. */
export default function Gallery() {
  return (
    <Section id="gallery">
      <div className="mb-16">
        <Reveal as="h2" from="fadeUp" className="font-headline-lg text-3xl leading-tight text-primary text-center md:text-headline-lg">
          Glimpses of Forever
        </Reveal>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[300px]">
        {GALLERY.map((g, i) => (
          <div
            key={i}
            className={`overflow-hidden group border border-outline-variant ${g.span} ${g.order || ""}`}
          >
            <ProtectedImage
              src={WED_IMG[g.key]}
              alt="Surya & Sowmitha"
              className={`w-full h-full object-cover transition-transform duration-1000 ${g.zoom ? "scale-125 group-hover:scale-[1.32]" : "group-hover:scale-105"}`}
              style={g.position ? { objectPosition: g.position } : undefined}
            />
          </div>
        ))}
      </div>
    </Section>
  );
}
