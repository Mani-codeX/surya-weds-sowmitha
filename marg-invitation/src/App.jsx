import { SmoothScrollProvider } from "./providers/SmoothScrollProvider";
import AmbientBackground from "./components/AmbientBackground";
import MusicToggle from "./components/MusicToggle";
import Hero from "./features/Hero";
import Heritage from "./features/Heritage";
import GarlandExchange from "./features/GarlandExchange";
import Rituals from "./features/Rituals";
import SaveTheDate from "./features/SaveTheDate";
import Venue from "./features/Venue";
import Blessings from "./features/Blessings";
import Gallery from "./features/Gallery";
import Rsvp from "./features/Rsvp";
import Footer from "./features/Footer";
import CreatorReveal from "./features/CreatorReveal";


function App() {
  return (
    <SmoothScrollProvider>
      <AmbientBackground />
      <MusicToggle />

      <main className="relative z-0 overflow-hidden silk-grain">
        <Hero />
        <GarlandExchange />
        <Heritage />
        <SaveTheDate />
        <Rituals />
        <Venue />
        <Blessings />
        <Gallery />
        <Rsvp />
        <CreatorReveal />
        <Footer />
      </main>
    </SmoothScrollProvider>
  );
}

export default App;
