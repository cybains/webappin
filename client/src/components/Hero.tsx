"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

const images = [
  "/job-seeker.jpg",
  "/digital-nomad.jpg",
  "/entrepreneur.jpg",
  "/expat-family.jpg",
];

export default function Hero() {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scroll = scrollRef.current;
    let animationFrameId: number;

    const animateScroll = () => {
      if (scroll) {
        scroll.scrollLeft += 1;
        if (scroll.scrollLeft >= scroll.scrollWidth / 2) {
          scroll.scrollLeft = 0;
        }
      }
      animationFrameId = requestAnimationFrame(animateScroll);
    };

    animationFrameId = requestAnimationFrame(animateScroll);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <section
      className="relative h-[75vh] flex flex-col justify-center items-center overflow-hidden"
      style={{ backgroundColor: "var(--background)" }}
    >
      {/* Horizontal scrolling image strip */}
      <div
        ref={scrollRef}
        className="absolute top-0 left-0 w-full h-full whitespace-nowrap overflow-hidden"
      >
        <div className="inline-flex">
          {[...images, ...images].map((img, i) => (
            <div key={i} className="relative h-full w-auto" style={{ aspectRatio: '16/9' }}>
              <Image
                src={img}
                alt={`bg-${i}`}
                fill
                style={{ objectFit: "cover" }}
                priority={i < images.length} // prioritize first set for faster load
              />
            </div>
          ))}
        </div>
      </div>

      {/* Overlay content */}
      <div
        className="absolute bottom-0 right-0 z-10 p-6 rounded-xl text-center"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          color: "var(--foreground)",
        }}
      >
        <h1 className="text-4xl md:text-6xl font-bold" style={{ color: "var(--foreground)" }}>
          A World of Opportunities
        </h1>
        <p className="mt-4 text-lg md:text-2xl" style={{ color: "var(--foreground)" }}>
          I get the data, you make the decisions.
        </p>
      </div>
    </section>
  );
}
