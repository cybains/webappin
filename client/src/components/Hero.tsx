"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Hero() {
  const handleCta = () => {
    const router = document.getElementById("router");
    if (router) {
      router.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section
      className="hero relative h-[75vh] flex flex-col justify-start items-start text-left px-8 pt-16 overflow-hidden"
      style={{ backgroundColor: "transparent" }}
    >
      <div className="relative z-10 space-y-4">
        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl text-gray-950 tracking-tight text-balance relative leading-[0.95]">
          Cross-border decisions
          <span className="block">
            Minus the guesswork.
          </span>
        </h1>
        <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-2xl">
          We describe the terrain before you leap — using economic data, mobility rules, and hiring constraints to turn cross-border moves into defensible decisions.
        </p>
        <div className="mt-8">
          <Button
            size="lg"
            className="rounded-2xl px-8 text-base font-semibold"
            onClick={handleCta}
          >
            Choose a track <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
        <p className="mt-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Not for casual browsing. Built for real decisions.
        </p>
      </div>
    </section>
  );
}
