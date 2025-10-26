"use client";

import dynamic from "next/dynamic";
import Hero from "@/components/Hero";
// import SearchMe from "@/components/SearchMe"; // removed
import HowItWorks from "@/components/HowItWorks";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import EcosystemSection from "@/components/EcosystemSection";
import PromiseOfGrowth from "@/components/growth-atlas/PromiseOfGrowth";

// Dynamically import WorldMap for client-side only
const WorldMap = dynamic(() => import("@/components/WorldMap"), { ssr: false });

export default function Home() {
  return (
    <>
      <main className="min-h-screen bg-backgroundLight text-textLight dark:bg-backgroundDark dark:text-textDark relative">
        {/* Map Background for Hero */}
        <div className="absolute top-0 left-0 w-full h-screen -z-10 opacity-40 pointer-events-none">
          <WorldMap />
        </div>

        {/* Hero Section */}
        <section id="hero" className="h-[70vh] relative z-10 bg-transparent">
          <Hero />
        </section>

        {/* Search Me Section — removed */}
        {/* <section id="search-me">
          <SearchMe />
        </section> */}

        {/* Promise of Growth Chapter 1 visuals */}
        <section
          id="chapter-one"
          className="relative z-10 bg-white/80 py-24 backdrop-blur dark:bg-slate-950/80"
        >
          <div
            className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-100/60 via-white/80 to-white dark:from-slate-950/90 dark:via-slate-950/80 dark:to-slate-900/90"
            aria-hidden="true"
          />
          <div className="mx-auto max-w-6xl px-6 md:px-10">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-500">
                Chapter 1 · Promise of Growth
              </p>
              <h2 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white md:text-5xl">
                Visualising Europe&apos;s uneven convergence
              </h2>
              <p className="mt-4 text-base text-slate-600 dark:text-slate-300">
                The skyline, slope, convergence band, and &ldquo;your view&rdquo; panels from the Growth Atlas now live on the
                homepage so you can explore how European economies close the gap before we wire them to live data.
              </p>
            </div>
            <div className="mt-12">
              <PromiseOfGrowth />
            </div>
          </div>
        </section>

        {/* Ecosystem visualisation */}
        <EcosystemSection />

        {/* How It Works Section */}
        <section id="how-it-works">
          <HowItWorks />
        </section>

        {/* Contact Section */}
        <section id="contact">
          <Contact />
        </section>
      </main>
      <Footer />
    </>
  );
}
