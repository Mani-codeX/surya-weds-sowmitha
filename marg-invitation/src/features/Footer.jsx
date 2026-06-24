import { COUPLE } from "../lib/content";

export default function Footer() {
  return (
    <footer className="bg-primary text-on-primary py-4 px-6 md:py-8 md:px-container-padding lg:py-12 text-center relative z-20 border-t border-secondary/20">
      <p className="font-body-md text-xs text-on-primary/50 md:text-sm lg:text-base">
        © 2026 {COUPLE.groom} &amp; {COUPLE.bride}. Made with love.
      </p>
    </footer>
  );
}
