import { ArrowRight } from "lucide-react";


export default function Hero() {
  return (
    <section
      className="hero relative min-h-[70vh] flex flex-col justify-start items-start text-left px-6 md:px-8 pt-12 md:pt-16 pb-10"
      style={{ backgroundColor: "transparent" }}
    >
      <div className="relative z-10 w-full space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-700">Cross-border recruitment &amp; mobility · Europe</p>
        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl text-gray-950 tracking-tight text-balance relative leading-[0.95]">
          Find the people you need.
          <span className="block">
            Know what it takes to start.
          </span>
        </h1>
        <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-2xl">
          Sufoniq helps European employers fill roles that are hard to fill locally. We connect sourcing and screening with the eligibility, permits, documents and timing a hire needs to start — within an agreed scope.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <a href="#contact" className="inline-flex min-h-12 w-full sm:w-auto items-center justify-center rounded-2xl px-5 sm:px-8 py-3 text-sm sm:text-base font-semibold bg-[color:var(--primary)] text-[color:var(--primary-foreground)] transition-colors hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2">
            Discuss a role <ArrowRight className="ml-2 h-5 w-5" />
          </a>
          <a href="#how-it-works" className="text-sm font-semibold text-slate-800 underline underline-offset-4 decoration-slate-400 hover:decoration-slate-800 focus-visible:outline-2 focus-visible:outline-offset-4">See how we work</a>
        </div>
        <p className="mt-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">
          UAB Skillaxis · registered in Lithuania · operated from Vienna
        </p>
        <p className="text-sm text-slate-700">Looking for work? <a href="/core-services#job-search-support" className="font-semibold underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4">See job-seeker support</a></p>
      </div>
    </section>
  );
}
