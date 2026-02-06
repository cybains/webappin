export type InsightType = "Visual Dissertation" | "Signals & Patterns" | "Framework Note";

export interface Insight {
  slug: string;
  type: InsightType;
  title: string;
  framing: string;
  readTime?: string;
  date?: string;
  tags?: string[];
  featured?: boolean;
}

export const INSIGHTS: Insight[] = [
  {
    slug: "growth",
    type: "Visual Dissertation",
    title: "Growth is uneven. Your strategy shouldn’t be.",
    framing: "A six-chapter visual dissertation on growth, momentum, and regional divergence.",
    readTime: "6 min",
    date: "Jan 2026",
    tags: ["EU", "GDP"],
    featured: true,
  },
  {
    slug: "signals/patterns",
    type: "Signals & Patterns",
    title: "Signals from the soft goods corridor",
    framing:
      "Demand ripples through edges before it appears in top-line summaries. We trace the quiet variables that matter.",
    readTime: "4 min",
    date: "Dec 2025",
    tags: ["labor"],
  },
  {
    slug: "frameworks/systematic-triangulation",
    type: "Framework Note",
    title: "Systematic triangulation of constraints",
    framing:
      "When policy, payroll, and talent pulses all act as constraints, the frameworks that survive map the limits first.",
    readTime: "3 min",
    tags: ["constraints"],
  },
  {
    slug: "visuals/decoupling",
    type: "Visual Dissertation",
    title: "Decoupling pathways that actually curve",
    framing:
      "Where output keeps climbing while emissions plateau—an increasingly rare corridor, drawn to scale.",
    readTime: "5 min",
    date: "Nov 2025",
    tags: ["decoupling"],
  },
  {
    slug: "signals/labor-market",
    type: "Signals & Patterns",
    title: "Labor-market signals that precede policy",
    framing:
      "Hiring demand spikes before governments signal moves; we track those precursors to avoid surprises.",
    readTime: "3 min",
  },
];
