import { COUPLE } from "../lib/content";

export default function Footer() {
  return (
    <footer className="bg-primary text-on-primary py-12 px-container-padding text-center relative z-20 border-t border-secondary/20">
      <p className="font-body-md text-on-primary/50">
        © 2026 {COUPLE.groom} &amp; {COUPLE.bride}. Made with love.
      </p>
    </footer>
  );
}
