"use client";

import dynamic from "next/dynamic";
import Hero from "@/components/Hero";
import SearchMe from "@/components/SearchMe";
import HowItWorks from "@/components/HowItWorks";
import Contact from "@/components/Contact";
import CoreServices from "@/components/CoreServices";

// Dynamically import WorldMap for client-side only
const WorldMap = dynamic(() => import("@/components/WorldMap"), { ssr: false });

export default function Home() {
  return (
    <main className="min-h-screen bg-backgroundLight text-textLight dark:bg-backgroundDark dark:text-textDark relative">
      
      {/* Map Background for Hero */}
      <div className="absolute top-0 left-0 w-full h-screen -z-10 opacity-40 pointer-events-none">
        <WorldMap />
      </div>

      {/* Hero Section */}
      <section id="hero" className="h-[70vh] relative z-10 bg-transparent">
        <Hero />
      </section>

      {/* Search Me Section */}
      <section id="search-me">
        <SearchMe />
      </section>

      {/* How It Works Section */}
      <section id="how-it-works">
        <HowItWorks />
      </section>
      
      {/* Core Services Section */}
      <section id="services">
        <CoreServices />
      </section>
    
      {/* Contact Section */}{/* How It Works Section */}
      <section id="Contact">
        <Contact />
      </section>

    </main>
  );
}
