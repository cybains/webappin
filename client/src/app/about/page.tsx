"use client";

import React from "react";
import { StructuralGridBand } from "@/components/StructuralGridBand";

/**
 * Single-file preview canvas: About Us page layout for Sufoniq
 *
 * Notes about the preview environment:
 * - Some preview runtimes do not support Next.js-specific modules (e.g., next/link) or TypeScript annotations.
 * - To keep this canvas universally previewable, we use plain <a> anchors and avoid TS type syntax.
 */

type SectionProps = {
  eyebrow?: string;
  title: string;
  children: React.ReactNode;
};

function Section({ eyebrow, title, children }: SectionProps) {

  return (
    <section className="mx-auto w-full max-w-4xl px-6 py-6 md:py-8">
      <div className="space-y-2">
        {eyebrow ? (
          <p className="text-[10px] font-semibold tracking-[0.4em] text-muted-foreground/80">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
          {title}
        </h2>
      </div>
      <div className="mt-5 text-base leading-relaxed text-foreground/90 space-y-4">
        {children}
      </div>
    </section>
  );
}

export default function AboutUsCanvas() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <StructuralGridBand>
        <header className="mx-auto w-full max-w-4xl px-6 pt-12 pb-8">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight leading-tight">
          About Sufoniq
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-foreground/85">
          We try to make sense of work, mobility, and hiring without turning it into a shouting match.
          Fewer buzzwords. Better signals. A calmer way to decide.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {["Work", "Mobility", "Hiring", "Europe"].map((label) => (
            <span
              key={label}
              className="rounded-full border border-border/40 bg-foreground/5 px-3 py-1 text-[0.65rem] font-medium text-muted-foreground/70"
            >
              {label}
            </span>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-6 text-sm">
          <a
            href="#who"
            className="inline-flex items-center justify-center rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background shadow-sm shadow-foreground/10"
          >
            Read the essentials
          </a>
          <a
            href="/method-and-trust#overview"
            className="text-sm font-semibold text-muted-foreground/70 hover:text-foreground/90"
          >
            Method &amp; Trust
          </a>
        </div>
      </header>

      <div id="who">
        <Section eyebrow="01" title="Who we are">
          <p>
            Sufoniq works on decision intelligence for work, mobility, and hiring in Europe — but we don’t treat
            decisions like abstract puzzles. We treat them like real-life moves that deserve clarity.
          </p>

          <p>
            The idea started simply: the future of work isn’t a shouting match, it’s a well-organized playlist.
            No static. No buzzwords. Just signals you can actually use.
          </p>

          <p>
            If you imagine a rover roaming Mars, quietly collecting data point by point (not a dog — don’t get
            excited), that’s closer to our mindset. Observe first. Interpret carefully. Act only when it makes sense.
          </p>
        </Section>
      </div>

      <div id="what">
        <Section eyebrow="02" title="What we do">
          <p>
            In practice, this means spending a lot of time listening before saying anything. Signals first, opinions
            later. We try to understand how work and mobility actually behave, not how they’re marketed.
          </p>

          <ul className="space-y-3 text-foreground/80">
            <li className="flex gap-3">
              <span className="text-foreground/60 leading-none">—</span>
              <span>
                We analyse labour and mobility signals across Europe, quietly and continuously — the slow,
                unglamorous work most people skip.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-foreground/60 leading-none">—</span>
              <span>
                We look at constraints before opportunities, because reality has a habit of showing up whether you
                planned for it or not.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-foreground/60 leading-none">—</span>
              <span>
                We support individuals and employers making cross-border decisions without hype, shortcuts, or
                false certainty.
              </span>
            </li>
          </ul>
        </Section>
      </div>

      <div id="operate">
        <Section eyebrow="03" title="How we operate">
          <p>
            Our operating rules exist for one reason: to keep us honest when decisions get complicated. They’re not
            slogans — they’re guardrails.
          </p>

          <ul className="space-y-3 text-foreground/80">
            <li className="flex gap-3">
              <span className="text-foreground/60 leading-none">—</span>
              <span>
                Lawful-only. If something can’t be done properly, we don’t do it — even if it’s faster or more
                exciting.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-foreground/60 leading-none">—</span>
              <span>
                Explainable outputs wherever possible. Important decisions shouldn’t rely on magic tricks or black
                boxes.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-foreground/60 leading-none">—</span>
              <span>
                Humans stay in the loop when stakes, ambiguity, or judgement matter — because context still beats
                automation.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-foreground/60 leading-none">—</span>
              <span>
                No guarantees. We help you see clearly, not decide for you.
              </span>
            </li>
          </ul>
        </Section>
      </div>

      <div id="company">
        <Section eyebrow="04" title="The company">
          <div className="grid grid-cols-1 gap-6 text-sm text-foreground/80 md:grid-cols-2">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground/70">Legal entity</p>
              <p className="font-semibold text-foreground">UAB Skillaxis</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground/70">Jurisdiction</p>
              <p className="font-semibold text-foreground">Lithuania</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground/70">Operated from</p>
              <p className="font-semibold text-foreground">Vienna, Austria</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground/70">Scope</p>
              <p className="font-semibold text-foreground">Europe-wide labour &amp; mobility</p>
            </div>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            If you need a specific legal or compliance statement, place it here.
          </p>
        </Section>
      </div>

      <Section eyebrow="05" title="Who it’s for">
        <div className="grid grid-cols-1 gap-6 text-sm text-foreground/80 md:grid-cols-3">
          <div className="space-y-1">
            <p className="font-semibold text-foreground">Individuals</p>
            <p className="text-muted-foreground">
              Job seekers, digital nomads, entrepreneurs, expat families planning cross-border moves.
            </p>
          </div>
          <div className="space-y-1">
            <p className="font-semibold text-foreground">Employers</p>
            <p className="text-muted-foreground">
              Teams hiring across borders and comparing labour realities across locations.
            </p>
          </div>
          <div className="space-y-1">
            <p className="font-semibold text-foreground">Partners</p>
            <p className="text-muted-foreground">
              Institutions, researchers, and collaborators working with structured mobility and labour data.
            </p>
          </div>
        </div>
        </Section>
      </StructuralGridBand>
    </main>
  );
}
