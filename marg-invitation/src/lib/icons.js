/**
 * Central icon registry.
 *
 * One place for every icon used across the site. Components import from here
 * (never directly from "lucide-react"), so swapping an icon, restyling, or
 * changing the icon library later means editing ONLY this file.
 *
 * Usage:
 *   import { MapPin, Sparkle } from "../lib/icons";
 *   <MapPin className="h-5 w-5 text-secondary" />
 *
 * Or look one up by semantic key (handy for data-driven lists):
 *   import { ICONS } from "../lib/icons";
 *   const Cmp = ICONS[item.icon];  <Cmp className="..." />
 *
 * Decorative / branded artwork (the animated HeartCenterpiece, the rotating
 * MandalaRings, the GoldMotif, the floating florals, the countdown progress
 * rings) are bespoke SVGs with their own animations — they are NOT icons and
 * intentionally stay in their own components.
 */
import {
  MapPin,
  Car,
  Heart,
  Music,
  VolumeX,
  Sparkles,
  Flower,
  Sprout,
  Gem,
  Menu,
  X,
  Mail,
  Phone,
  Calendar,
  Landmark,
  BookHeart,
  Users,
  HandHeart,
  HeartHandshake,
  Flame,
  CalendarHeart,
  Share2,
  Check,
  MessageCircle,
  MessageSquare,
  Link,
  Copy,
} from "lucide-react";

// Named re-exports — import the ones you need by name.
export {
  MapPin,
  Car,
  Heart,
  Music,
  VolumeX,
  Sparkles,
  Flower,
  Sprout,
  Gem,
  Menu,
  X,
  Mail,
  Phone,
  Calendar,
  Landmark,
  BookHeart,
  Users,
  HandHeart,
  HeartHandshake,
  Flame,
  CalendarHeart,
  Share2,
  Check,
  MessageCircle,
  MessageSquare,
  Link,
  Copy,
};

/**
 * Semantic lookup map — for data-driven usage where the icon is chosen by a
 * string key in content.js (e.g. BLESSINGS, Venue DETAILS). Keep the keys
 * stable; point them at whichever lucide icon fits best.
 */
export const ICONS = {
  // venue / contact
  location: MapPin,
  parking: Car,
  email: Mail,
  phone: Phone,
  calendar: Calendar,
  // music toggle
  music: Music,
  musicOff: VolumeX,
  // blessings / virtues
  tradition: Landmark,
  heritage: BookHeart,
  family: Users,
  devotion: HandHeart,
  // accents
  heart: Heart,
  sparkle: Sparkles,
  flower: Flower,
  sprout: Sprout,
  ring: Gem,
  // rituals
  engagement: HeartHandshake,
  vows: HandHeart, // offering love — Tamil wedding muhurtham
};
