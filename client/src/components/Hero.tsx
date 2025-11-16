"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Hero() {
  const handleCta = () => {
    const contact = document.getElementById("contact");
    if (contact) {
      contact.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

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
        <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-2xl">
          We pair grown-up diligence with a dry wit and ship hiring intel that moves markets—and
          people—the right way.
        </p>
        <div className="mt-8">
          <Button
            size="lg"
            className="rounded-2xl px-8 text-base font-semibold"
            onClick={handleCta}
          >
            Book a sensible chat <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}
