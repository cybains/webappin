"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

type ChartCarouselProps = {
  slides: ReactNode[];
  intervalMs?: number;
};

export default function ChartCarousel({ slides, intervalMs = 4000 }: ChartCarouselProps) {
  const validSlides = useMemo(() => (slides.length ? slides : [null]), [slides]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || validSlides.length <= 1) return;
    const id = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % validSlides.length);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs, isPaused, validSlides]);

  const dots = useMemo(
    () =>
      validSlides.map((_, idx) => (
        <button
          key={idx}
          type="button"
          aria-label={`Slide ${idx + 1}`}
          onClick={() => setActiveIndex(idx)}
          className={`h-2 w-2 rounded-full transition-opacity ${
            idx === activeIndex ? "opacity-100" : "opacity-40"
          }`}
        />
      )),
    [activeIndex, validSlides]
  );

  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white/80"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative h-full min-h-[200px]">
        {validSlides.map((slide, idx) => (
          <div
            key={idx}
            className="absolute inset-0 h-full w-full transition-opacity duration-700"
            style={{ opacity: idx === activeIndex ? 1 : 0 }}
          >
            <div className="h-full w-full">{slide}</div>
          </div>
        ))}
      </div>
      <div className="relative flex justify-center gap-2 px-4 py-3">
        {dots}
      </div>
    </div>
  );
}
