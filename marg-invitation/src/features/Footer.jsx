import { COUPLE } from "../lib/content";

const LINKS = ["The Wedding Story", "Travel & Stay", "RSVP", "Gift Registry"];

export default function Footer() {
  return (
    <footer className="bg-primary text-on-primary py-section-gap px-container-padding text-center relative z-20">
      <div className="mb-12">
        <h2 className="font-display-lg text-display-lg text-secondary-fixed">
          {COUPLE.initials}
        </h2>
        <div className="w-24 h-px bg-secondary-fixed mx-auto mt-4" />
      </div>
      <div className="flex flex-wrap justify-center gap-12 mb-12">
        {LINKS.map((l) => (
          <a key={l} href="#" className="text-on-primary/70 hover:text-on-primary font-body-md transition-all">
            {l}
          </a>
        ))}
      </div>
      <p className="font-body-md text-on-primary/50">
        © 2026 {COUPLE.bride} &amp; {COUPLE.groom}. Handcrafted with Heritage.
      </p>
    </footer>
  );
}
