"use client";

export default function Hero() {
  return (
    <section
      className="hero relative h-[75vh] flex flex-col items-center justify-center px-6 text-center overflow-hidden"
      style={{ backgroundColor: "transparent" }}
    >
      <div className="max-w-3xl">
        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl text-gray-950 tracking-tight text-balance z-10 relative leading-tight">
          Better Growth.
        </h1>
        <p className="mt-6 text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-700">
          Data in a suit, with a smirk.
        </p>
        <p className="mt-6 text-base sm:text-lg md:text-xl text-gray-700">
          Europe’s economy, without the drama. We measure what matters, ignore what doesn’t, and nudge growth toward something clever, clean, and actually useful.
        </p>
      </div>
    </section>
  );
}
