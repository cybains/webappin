"use client";

export default function Hero() {
  return (
    <section
      className="hero relative h-[75vh] flex flex-col justify-start items-start text-left px-8 pt-16 overflow-hidden"
      style={{ backgroundColor: "transparent" }}
    >
      <div>
        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl text-gray-950 tracking-tighter text-balance z-10 relative leading-tight">
          Better Growth.
          <span className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-gray-700 mt-6 leading-relaxed">
            Data in a suit, with a smirk.
          </span>
        </h1>
      </div>
    </section>
  );
}
