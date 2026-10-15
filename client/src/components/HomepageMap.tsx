// Decorative snapshot of the existing MapLibre countries and palette.
// The interactive map remains available to pages that need map controls.
import MapRoutes from "./MapRoutes";
import { preload } from "react-dom";

export default function HomepageMap() {
  // The static map is already compressed; discover it before the CSS arrives.
  preload("/homepage-world-map-optimized.webp", { as: "image", fetchPriority: "high" });
  return (
    <div className="relative h-screen w-full" aria-hidden="true">
      <div className="absolute inset-0 opacity-40">
        <div className="absolute inset-0 bg-[#D8F2FF] bg-[url('/homepage-world-map-optimized.webp')] bg-cover bg-center" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/80 via-white/10 to-transparent" />
      </div>
      <MapRoutes />
    </div>
  );
}
