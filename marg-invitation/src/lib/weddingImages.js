/**
 * Central registry for the couple's wedding photos.
 *
 * All images live in src/assets/wed-images as optimized WebP files (see
 * wed-formar.md). They are imported here so Vite fingerprints + bundles them,
 * and every section references them by a stable key — swapping a photo means
 * dropping a new .webp in and changing ONE line here.
 *
 * Usage:
 *   import { WED_IMG } from "../lib/weddingImages";
 *   <ProtectedImage src={WED_IMG.img2} alt="…" />
 *
 * Always render through <ProtectedImage> so the casual-download protections
 * from wed-formar.md (no drag, no right-click, no select) are applied.
 */
import img1 from "../assets/wed-images/wed-img-1.webp";
import img2 from "../assets/wed-images/wed-img-2.webp";
import img3 from "../assets/wed-images/wed-img-3.webp";
import img4 from "../assets/wed-images/wed-img-4.webp";
import img5 from "../assets/wed-images/wed-img-5.webp";
import img6 from "../assets/wed-images/wed-img-6.webp";
import img7 from "../assets/wed-images/wed-img-7.webp";
import img8 from "../assets/wed-images/wed-img-8.webp";
import img11 from "../assets/wed-images/wed-img-11.webp";
import img13 from "../assets/wed-images/wed-img-13.webp";
import birdOne from "../assets/wed-images/bird-one.webp";
import birdTwo from "../assets/wed-images/bird-two.webp";
import invitation from "../assets/wed-images/mrg-invitP.jpeg";
import img15 from "../assets/wed-images/wed-img-15.jpeg";
import imgRech from "../assets/wed-images/img-rech.webp";

export const WED_IMG = {
  img1,
  img2,
  img3,
  img4,
  img5,
  img6,
  img7,
  img8,
  img11,
  img13,
  birdOne,
  birdTwo,
  invitation,
  img15,
  imgRech,
};
