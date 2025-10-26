"use client";

import React, { useMemo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

import PromiseOfGrowth from "@/components/growth-atlas/PromiseOfGrowth";
import { LineChartSvg, ScatterChartSvg } from "@/components/growth-atlas/ChartPrimitives";

/**
 * Growth Atlas — visual dissertation scaffold
 * Stack: React + Framer Motion + Recharts + Tailwind (assumes Tailwind present)
 *
 * What you get:
 * 1) A storyboarded, scroll-driven homepage with five sections reflecting Susskind's thesis
 * 2) Reusable motion + layout primitives
 * 3) Data loader stubs for World Bank API & Maddison placeholder
 * 4) Example charts per section rendered with lightweight SVG helpers (with fake data seed + clear TODOs to wire live endpoints)
 *
 * How to use:
 * - Drop this file into your Next.js app (e.g., app/(marketing)/page.tsx or components/GrowthAtlas.tsx)
 * - Ensure Tailwind is configured. Optionally wrap with a container shell matching your design system.
 * - Replace FAKE_* data builders with real fetchers in the Data layer below.
 */

// -----------------------------
// Motion & UI primitives
// -----------------------------

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const Section: React.FC<{
  id: string;
  eyebrow: string;
  title: string;
  kicker?: string;
  children: React.ReactNode;
  bg?: string;
}> = ({ id, eyebrow, title, kicker, children, bg = "bg-white" }) => (
  <section id={id} className={`${bg} py-24 px-6 md:px-10`}>
    <div className="mx-auto max-w-6xl">
      <motion.p
        className="text-sm uppercase tracking-widest text-gray-500"
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
      >
        {eyebrow}
      </motion.p>
      <motion.h2
        className="mt-2 text-3xl md:text-5xl font-semibold tracking-tight"
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
      >
        {title}
      </motion.h2>
      {kicker && (
        <motion.p
          className="mt-3 text-base md:text-lg text-gray-600 max-w-3xl"
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {kicker}
        </motion.p>
      )}
      <div className="mt-8">{children}</div>
    </div>
  </section>
);

// -----------------------------
// Data layer placeholder
// -----------------------------

// Data loading hooks will live alongside the visual components once the Chapter 1 pack is wired in.

// -----------------------------
// Section Components
// -----------------------------

// 2) Uneven Growth — Inequality choropleth placeholder + migration scatter (stub visuals)
const UnevenGrowth: React.FC = () => {
  // For now: a scatter approximating "origin vs destination" pressure
  const data = useMemo(() => {
    const arr: Array<{ x: number; y: number; z: number; name: string }> = [];
    for (let i = 0; i < 30; i++) {
      arr.push({ x: 3 + Math.random() * 8, y: 50 + Math.random() * 40, z: 1 + Math.random() * 20, name: `C${i}` });
    }
    return arr;
  }, []);
  const scatterPoints = useMemo(
    () => data.map((point) => ({ x: point.x, y: point.y, r: point.z })),
    [data],
  );

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} className="rounded-2xl border p-4">
        <h3 className="mb-1 font-medium">Migration pressure proxy</h3>
        <p className="mb-4 text-sm text-gray-600">x: unemployment (origin), y: job vacancies (destination), size: population (fake data).</p>
        <div className="h-72">
          <ScatterChartSvg
            data={scatterPoints}
            xLabel="Origin unemployment %"
            yLabel="Destination vacancies index"
          />
        </div>
      </motion.div>

      <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} className="rounded-2xl border p-4">
        <h3 className="mb-1 font-medium">Inequality (choropleth placeholder)</h3>
        <p className="mb-4 text-sm text-gray-600">Integrate a map lib (e.g., react-simple-maps) to render Gini by country.</p>
        <div className="h-72 grid place-items-center text-gray-500">[ Map placeholder ]</div>
      </motion.div>
    </div>
  );
};

// 3) Change the Nature — Decoupling quadrant (ΔGDPpc vs ΔCO2pc)
const DecouplingQuadrant: React.FC = () => {
  const data = useMemo(() => {
    // Fake country deltas 2010→2023
    const mk = (name: string) => ({ name, dGDP: -1 + Math.random() * 4, dCO2: -2 + Math.random() * 3 });
    return [mk("AUT"), mk("DEU"), mk("NLD"), mk("IND"), mk("POL"), mk("ESP")];
  }, []);
  const points = useMemo(
    () => data.map((entry) => ({ x: entry.dGDP, y: entry.dCO2, label: entry.name, r: 10 })),
    [data],
  );

  return (
    <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} className="rounded-2xl border p-4">
      <h3 className="mb-1 font-medium">Decoupling quadrant (2010→latest)</h3>
      <p className="mb-4 text-sm text-gray-600">x: ΔGDP per capita (pp), y: ΔCO₂ per capita (t/person). Goal: top-left quadrant (↑GDP, ↓CO₂).</p>
      <div className="h-80">
        <ScatterChartSvg
          data={points}
          color="#f97316"
          referenceLines={{ x: 0, y: 0 }}
          xLabel="ΔGDP per capita (pp)"
          yLabel="ΔCO₂ per capita (t/person)"
        />
      </div>
      <div className="mt-3 text-sm text-gray-600">
        <p>TODO: compute true deltas from WB series (2010 vs latest) per country.</p>
        <p>Optional: animate trails (2010→2023) using multi-point segments per country.</p>
      </div>
    </motion.div>
  );
};

// 4) Diffusion (S-curve) — Internet users with logistic overlay (overlay stub)
const DiffusionSCurve: React.FC = () => {
  // Fake adoption curve ~ logistic
  const series = useMemo(() => {
    const arr: Array<{ year: number; usersPct: number }> = [];
    for (let t = 1990; t <= 2024; t++) {
      const L = 95,
        k = 0.22,
        t0 = 2005;
      const f = L / (1 + Math.exp(-k * (t - t0)));
      arr.push({ year: t, usersPct: Number(f.toFixed(2)) });
    }
    return arr;
  }, []);
  const line = useMemo(() => series.map((point) => ({ x: point.year, y: point.usersPct })), [series]);

  return (
    <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} className="rounded-2xl border p-4">
      <h3 className="mb-1 font-medium">Technology diffusion (Internet users % of population)</h3>
      <p className="mb-4 text-sm text-gray-600">Overlay logistic fit parameters (L, k, t₀) once you fetch real series.</p>
      <div className="h-72">
        <LineChartSvg data={line} color="#6366f1" formatter={(value) => `${value.toFixed(0)}%`} />
      </div>
    </motion.div>
  );
};

// 5) Human Capital — R&D % GDP vs GDP growth (bivariate)
const HumanCapitalIdeas: React.FC = () => {
  const pts = useMemo(() => {
    const mk = (name: string, rd: number, g: number) => ({ name, rd, g });
    return [
      mk("AUT", 3.2, 1.5),
      mk("DEU", 3.1, 1.2),
      mk("NLD", 2.3, 1.7),
      mk("SWE", 3.4, 1.8),
      mk("KOR", 4.9, 2.5),
      mk("ISR", 5.4, 2.2),
    ];
  }, []);
  const scatter = useMemo(
    () => pts.map((entry) => ({ x: entry.rd, y: entry.g, label: entry.name, r: 12 })),
    [pts],
  );

  return (
    <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} className="rounded-2xl border p-4">
      <h3 className="mb-1 font-medium">Idea intensity vs growth</h3>
      <p className="mb-4 text-sm text-gray-600">x: R&D expenditure (% GDP), y: avg GDP pc growth (pp). Use WB + compute 5–10y CAGR.</p>
      <div className="h-72">
        <ScatterChartSvg
          data={scatter}
          color="#14b8a6"
          xLabel="R&D % GDP"
          yLabel="GDP pc growth (pp)"
        />
      </div>
    </motion.div>
  );
};

// CTA panel tying back to Skillaxis value prop
const ValueProp: React.FC = () => (
  <div className="grid md:grid-cols-3 gap-6">
    {[
      {
        title: "Connect surplus skills to shortages",
        body: "We map origin-country supply to destination demand—ethically and compliantly.",
      },
      { title: "Operate where growth is better", body: "We prioritize sectors and partners aligned with decoupling and fair pay." },
      { title: "Move ideas, not just people", body: "Language, credentials, and training pathways built-in." },
    ].map((c, i) => (
      <motion.div
        key={i}
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="rounded-2xl border p-5"
      >
        <h4 className="font-medium text-lg">{c.title}</h4>
        <p className="mt-2 text-gray-600 text-sm">{c.body}</p>
        <button className="mt-4 inline-flex items-center rounded-xl border px-3 py-2 text-sm hover:bg-gray-50">Talk to us →</button>
      </motion.div>
    ))}
  </div>
);

// -----------------------------
// Page shell
// -----------------------------

const Hero: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.92]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.6]);

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-white to-gray-50">
      <motion.div style={{ scale, opacity }} className="mx-auto max-w-6xl px-6 md:px-10 pt-28 pb-16">
        <motion.h1 className="text-4xl md:text-6xl font-semibold tracking-tight" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          Growth, Reimagined
        </motion.h1>
        <motion.p className="mt-4 max-w-3xl text-gray-600" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>
          A visual dissertation inspired by Daniel Susskind: not just more growth—but better growth. Built with open data.
        </motion.p>
        <div className="mt-8 flex gap-3">
          <a href="#promise" className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-50">
            Start the story
          </a>
          <a href="#value" className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-50">
            Work with us
          </a>
        </div>
      </motion.div>
    </div>
  );
};

const Footer: React.FC = () => (
  <footer className="py-10 text-center text-sm text-gray-500">
    © {new Date().getFullYear()} UAB Skillaxis · Data from the World Bank and public sources.
  </footer>
);

const GrowthAtlasPage: React.FC = () => {
  return (
    <main className="min-h-screen">
      <Hero />

      <Section id="promise" eyebrow="Chapter 1" title="The Promise of Growth" kicker="Modern sustained growth is historically recent—and it bought longer lives.">
        <PromiseOfGrowth />
      </Section>

      <Section id="uneven" eyebrow="Chapter 2" title="The Uneven Growth" kicker="Benefits are real but uneven—people move to where opportunity lives." bg="bg-gray-50">
        <UnevenGrowth />
      </Section>

      <Section id="nature" eyebrow="Chapter 3" title="Change the Nature of Growth" kicker="Richer with fewer tons and joules: decoupling in practice.">
        <DecouplingQuadrant />
      </Section>

      <Section id="diffusion" eyebrow="Chapter 4" title="Diffusion & S‑Curves" kicker="Transformation is nonlinear—slow, then fast, then done." bg="bg-gray-50">
        <DiffusionSCurve />
      </Section>

      <Section id="ideas" eyebrow="Chapter 5" title="Human Capital & Ideas" kicker="Enduring growth is idea‑intensive—ultimately about people.">
        <HumanCapitalIdeas />
      </Section>

      <Section id="value" eyebrow="Apply" title="What this means for employers & partners" kicker="We turn this thesis into hiring and mobility outcomes." bg="bg-gray-50">
        <ValueProp />
      </Section>

      <Footer />
    </main>
  );
};

export default GrowthAtlasPage;
