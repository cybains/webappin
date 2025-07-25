"use client";

export default function Hero() {
  return (
    <section
      className="hero relative h-[75vh] flex flex-col justify-start items-start text-left px-8 pt-16 overflow-hidden"
      style={{ backgroundColor: "transparent" }}
    >
      <div>
        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl text-gray-950 tracking-tighter text-balance z-10 relative leading-tight">
          Stop the noise. The future of work isn’t loud, it’s aligned.
        </h1>
      </div>
    </section>
  );
}
