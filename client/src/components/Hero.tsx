import { ArrowRight } from "lucide-react";


export default function Hero() {
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
          When your company needs people, the hiring route matters. We bring labour-market data, mobility rules and hiring constraints together to help you assess where to source, what needs checking and how to move forward.
        </p>
        <div className="mt-8">
          <a href="#router" className="inline-flex h-12 items-center justify-center rounded-2xl px-8 text-base font-semibold bg-[color:var(--primary)] text-[color:var(--primary-foreground)] transition-colors hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2">
            Explore your hiring route <ArrowRight className="ml-2 h-5 w-5" />
          </a>
        </div>
        <p className="mt-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Built for workforce decisions that need to hold up.
        </p>

      </div>
    </section>
  );
}
