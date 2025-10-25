"use client";

import React from "react";
import { motion } from "framer-motion";
import { Brain, Factory, Leaf, LineChart, Map, Users } from "lucide-react";
import {
  LineChart as RLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  ReferenceLine,
  ReferenceArea,
  Legend,
  AreaChart,
  Area,
} from "recharts";

// ------------------------------------------------------------
// Better Growth — Homepage Dissertation (React)
// Light theme (black on white), witty/dry tone
// Uses mock data placeholders — swap with World Bank API later.
// Includes simple runtime smoke tests for data shape.
// ------------------------------------------------------------

const gdpPerCapitaEU = [
  { year: 2000, AT: 28000, DE: 25500, PL: 12500, RO: 8000 },
  { year: 2005, AT: 34000, DE: 31000, PL: 16000, RO: 10500 },
  { year: 2010, AT: 42000, DE: 39500, PL: 22000, RO: 14500 },
  { year: 2015, AT: 47000, DE: 44000, PL: 27000, RO: 19500 },
  { year: 2020, AT: 52000, DE: 50000, PL: 31500, RO: 24500 },
  { year: 2024, AT: 56000, DE: 54000, PL: 35500, RO: 28500 },
];

const rndVsGrowth = [
  { country: "AT", rnd: 3.2, gdp: 1.7 },
  { country: "DE", rnd: 3.1, gdp: 1.5 },
  { country: "NL", rnd: 2.4, gdp: 1.9 },
  { country: "PL", rnd: 1.4, gdp: 3.0 },
  { country: "RO", rnd: 0.5, gdp: 3.2 },
  { country: "EE", rnd: 1.8, gdp: 2.5 },
];

const gdpVsCO2 = [
  { year: 2000, gdp: 100, co2: 100 },
  { year: 2005, gdp: 115, co2: 105 },
  { year: 2010, gdp: 125, co2: 98 },
  { year: 2015, gdp: 135, co2: 90 },
  { year: 2020, gdp: 140, co2: 82 },
  { year: 2024, gdp: 150, co2: 78 },
];

const migrationBalance = [
  { route: "IN → AT", people: 3.2 },
  { route: "IN → DE", people: 7.8 },
  { route: "AE → AT", people: 1.1 },
  { route: "QA → DE", people: 0.9 },
  { route: "IN → NL", people: 2.0 },
];

const growthVsInequality = [
  { country: "AT", growth: 1.6, gini: 30 },
  { country: "DE", growth: 1.4, gini: 32 },
  { country: "NL", growth: 1.8, gini: 28 },
  { country: "PL", growth: 3.1, gini: 31 },
  { country: "RO", growth: 3.0, gini: 35 },
  { country: "ES", growth: 2.0, gini: 34 },
];

// --- Runtime smoke tests ("test cases") ----------------------
function runSmokeTests() {
  try {
    console.assert(Array.isArray(gdpPerCapitaEU) && gdpPerCapitaEU.length > 0, "gdpPerCapitaEU missing");
    console.assert(gdpPerCapitaEU[0] && typeof gdpPerCapitaEU[0].year === "number", "gdpPerCapitaEU.year missing");
    console.assert(Array.isArray(rndVsGrowth) && rndVsGrowth.every(d => "rnd" in d && "gdp" in d), "rndVsGrowth shape");
    console.assert(Array.isArray(gdpVsCO2) && gdpVsCO2.every(d => "year" in d && "gdp" in d && "co2" in d), "gdpVsCO2 shape");
    console.assert(Array.isArray(migrationBalance) && migrationBalance.every(d => "route" in d && "people" in d), "migrationBalance shape");
    console.assert(Array.isArray(growthVsInequality) && growthVsInequality.every(d => "growth" in d && "gini" in d), "growthVsInequality shape");
  } catch (e) {
    // Non-fatal; diagnostics only
    console.warn("Smoke tests failed:", e);
  }
}
runSmokeTests();

type SectionProps = {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  kicker: string;
  children: React.ReactNode;
};

type CardProps = {
  children: React.ReactNode;
};

// --- UI primitives -------------------------------------------
const Section = ({ id, icon: Icon, title, kicker, children }: SectionProps) => (
  <section id={id} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <div className="flex items-center gap-3 mb-6">
      <Icon className="w-5 h-5" />
      <p className="uppercase tracking-widest text-xs opacity-70">{kicker}</p>
    </div>
    <h2 className="text-2xl md:text-4xl font-semibold mb-4">{title}</h2>
    <div className="prose prose-slate max-w-none mb-8">{children}</div>
  </section>
);

const Card = ({ children }: CardProps) => (
  <div className="rounded-2xl border border-slate-200 p-4 md:p-6 shadow-sm bg-white">
    {children}
  </div>
);

// --- Sections -------------------------------------------------
const Hero = () => (
  <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 bg-white text-black">
    <motion.h1
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-4xl md:text-6xl font-semibold leading-tight"
    >
      Better Growth.
      <span className="block text-slate-500 text-xl md:text-2xl mt-3">
        Data in a suit, with a smirk.
      </span>
    </motion.h1>
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="mt-6 text-lg md:text-xl text-slate-700 max-w-3xl"
    >
      Europe’s economy, without the drama. We measure what matters, ignore what doesn’t, and nudge
      growth toward something clever, clean, and actually useful.
    </motion.p>
  </section>
);

const UnevenGrowth = () => (
  <Section id="uneven" icon={Factory} kicker="Chapter 1" title="Growth is uneven. Your strategy shouldn’t be.">
    <p>
      Some regions sprint. Others tie their shoes for twenty years. We chart divergence so you can
      make convergence happen — profitably.
    </p>
    <div className="grid md:grid-cols-2 gap-6 mt-8">
      <Card>
        <h3 className="text-lg font-medium mb-2">GDP per capita — selected EU economies</h3>
        <div className="h-64">
          <ResponsiveContainer>
            <RLineChart data={gdpPerCapitaEU} margin={{ left: 10, right: 10, top: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis tickFormatter={(v)=>`€${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={(v)=>`€${Number(v).toLocaleString()}`} />
              <Legend />
              <Line type="monotone" dataKey="AT" name="Austria" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="DE" name="Germany" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="PL" name="Poland" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="RO" name="Romania" strokeWidth={2} dot={false} />
            </RLineChart>
          </ResponsiveContainer>
        </div>
      </Card>
      <Card>
        <h3 className="text-lg font-medium mb-2">Takeaway</h3>
        <p className="text-slate-700">
          Convergence is real — and incomplete. Strategy tip: aim hiring pipelines where the slope is
          steepest, not where the skyline is tallest.
        </p>
      </Card>
    </div>
  </Section>
);

const BrainsNotBrawn = () => (
  <Section id="brains" icon={Brain} kicker="Chapter 2" title="Growth needs brains. (And decent Wi‑Fi)">
    <p>
      Ideas scale. Smokestacks don’t. We map R&D to growth to find places where cleverness
      compounds.
    </p>
    <div className="grid md:grid-cols-2 gap-6 mt-8">
      <Card>
        <h3 className="text-lg font-medium mb-2">R&D (% GDP) vs Real GDP growth</h3>
        <div className="h-64">
          <ResponsiveContainer>
            <ScatterChart margin={{ left: 10, right: 10, top: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="rnd" name="R&D % GDP" />
              <YAxis dataKey="gdp" name="GDP growth %" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} formatter={(v)=>`${v}%`} labelFormatter={()=>'Country'} />
              <Scatter name="EU Countries" data={rndVsGrowth} fill="currentColor" />
              <ReferenceLine x={2.0} strokeDasharray="3 3" label="R&D = 2%" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </Card>
      <Card>
        <h3 className="text-lg font-medium mb-2">Takeaway</h3>
        <p className="text-slate-700">
          Put talent where the ideas budget isn’t just a press release. High R&D ecosystems amplify
          skilled people — and margins.
        </p>
      </Card>
    </div>
  </Section>
);

const Limits = () => (
  <Section id="limits" icon={Leaf} kicker="Chapter 3" title="Growth has limits. Math says hi.">
    <p>
      Infinite curves are cute until the planet disagrees. We look for decoupling — more value, less
      damage — and build hiring that supports it.
    </p>
    <div className="grid md:grid-cols-2 gap-6 mt-8">
      <Card>
        <h3 className="text-lg font-medium mb-2">Index: GDP vs CO₂ (2000 = 100)</h3>
        <div className="h-64">
          <ResponsiveContainer>
            <AreaChart data={gdpVsCO2} margin={{ left: 10, right: 10, top: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="gdp" name="GDP Index" strokeWidth={2} fillOpacity={0.2} />
              <Area type="monotone" dataKey="co2" name="CO₂ Index" strokeWidth={2} fillOpacity={0.2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
      <Card>
        <h3 className="text-lg font-medium mb-2">Takeaway</h3>
        <p className="text-slate-700">
          Decoupling isn’t magic; it’s policy + technology + better choices. We prioritise sectors
          where output rises and footprints drop.
        </p>
      </Card>
    </div>
  </Section>
);

const PeopleFlows = () => (
  <Section id="people" icon={Users} kicker="Chapter 4" title="Growth is people. Borders are paperwork.">
    <p>
      Europe runs on human movement. We make it ethical, legal, and pleasantly uneventful.
    </p>
    <div className="grid md:grid-cols-2 gap-6 mt-8">
      <Card>
        <h3 className="text-lg font-medium mb-2">Indicative mobility routes (scaled)</h3>
        <div className="h-64">
          <ResponsiveContainer>
            <BarChart data={migrationBalance} margin={{ left: 10, right: 10, top: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="route" />
              <YAxis tickFormatter={(v)=>`${v}k`} />
              <Tooltip formatter={(v)=>`${v}k people`} />
              <Bar dataKey="people" name="People (k)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
      <Card>
        <h3 className="text-lg font-medium mb-2">Takeaway</h3>
        <p className="text-slate-700">
          The shortest path between talent and demand is paperwork done right. We handle the dull
          bits so Europe keeps moving.
        </p>
      </Card>
    </div>
  </Section>
);

const Balanced = () => (
  <Section id="balanced" icon={LineChart} kicker="Chapter 5" title="Better growth is balanced. (Yes, like a budget)">
    <p>
      More GDP with less inequality is a thing. Rare, but a thing. We aim hiring where the balance is
      feasible — and help make it feasible where it isn’t.
    </p>
    <div className="grid md:grid-cols-2 gap-6 mt-8">
      <Card>
        <h3 className="text-lg font-medium mb-2">GDP growth vs Gini (lower is fairer)</h3>
        <div className="h-64">
          <ResponsiveContainer>
            <ScatterChart margin={{ left: 10, right: 10, top: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="growth" name="GDP growth %" />
              <YAxis dataKey="gini" name="Gini" reversed />
              <Tooltip formatter={(v, n)=> n === 'gini' ? `${v}` : `${v}%`} />
              <Scatter data={growthVsInequality} name="EU Countries" />
              <ReferenceArea x1={1.5} x2={3.5} y1={26} y2={32} label="Sweet spot" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </Card>
      <Card>
        <h3 className="text-lg font-medium mb-2">Takeaway</h3>
        <p className="text-slate-700">
          Growth that actually lands in people’s lives is the only kind that lasts. We optimise for
          durable demand — not quarterly applause.
        </p>
      </Card>
    </div>
  </Section>
);

const Services = () => (
  <Section id="services" icon={Map} kicker="Chapter 6" title="What we actually do (apart from tidy charts)">
    <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 list-none p-0">
      <li>
        <Card>
          <div className="flex items-center gap-3 mb-2"><Brain className="w-5 h-5" /><h4 className="font-medium">Market Intelligence</h4></div>
          <p className="text-slate-700">World‑Bank‑powered dashboards that find where talent meets demand — without the guesswork.</p>
        </Card>
      </li>
      <li>
        <Card>
          <div className="flex items-center gap-3 mb-2"><Users className="w-5 h-5" /><h4 className="font-medium">Ethical Mobility</h4></div>
          <p className="text-slate-700">Recruitment, compliance, visas. Legal, boring, effective — the holy trinity.</p>
        </Card>
      </li>
      <li>
        <Card>
          <div className="flex items-center gap-3 mb-2"><Factory className="w-5 h-5" /><h4 className="font-medium">Sector Pipelines</h4></div>
          <p className="text-slate-700">Building repeatable hiring for logistics, seasonal, and clean‑industry roles.</p>
        </Card>
      </li>
      <li>
        <Card>
          <div className="flex items-center gap-3 mb-2"><Leaf className="w-5 h-5" /><h4 className="font-medium">Sustainability by Design</h4></div>
          <p className="text-slate-700">Prioritising decoupling sectors: more output, less footprint, fewer headaches.</p>
        </Card>
      </li>
      <li>
        <Card>
          <div className="flex items-center gap-3 mb-2"><LineChart className="w-5 h-5" /><h4 className="font-medium">Custom Visual Essays</h4></div>
          <p className="text-slate-700">We’ll tailor this dissertation to your boardroom. Bring questions; we’ll bring receipts.</p>
        </Card>
      </li>
      <li>
        <Card>
          <div className="flex items-center gap-3 mb-2"><Map className="w-5 h-5" /><h4 className="font-medium">Partner Programs</h4></div>
          <p className="text-slate-700">Licensed local partners for leasing; direct placements where it’s simpler. Sensible beats flashy.</p>
        </Card>
      </li>
    </ul>
  </Section>
);

// --- Page shell ----------------------------------------------
export default function BetterGrowthHomepage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Hero />
      <UnevenGrowth />
      <BrainsNotBrawn />
      <Limits />
      <PeopleFlows />
      <Balanced />
      <Services />
      <footer className="border-t border-slate-200 mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-sm text-slate-700">
          <p>© 2025 UAB Skillaxis — Better Growth, by design.</p>
          <p className="mt-1">A visual dissertation of better growth in Europe — built on data, delivered with taste.</p>
        </div>
      </footer>
    </div>
  );
}
