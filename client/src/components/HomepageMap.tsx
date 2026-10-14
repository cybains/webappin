// Decorative snapshot of the existing MapLibre countries and palette.
// The interactive map remains available to pages that need map controls.
export default function HomepageMap() {
  return (
    <div className="relative h-screen w-full" aria-hidden="true">
      <div className="absolute inset-0 bg-[#D8F2FF] bg-[url('/homepage-world-map.webp')] bg-cover bg-center" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/80 via-white/10 to-transparent" />
    </div>
  );
}
