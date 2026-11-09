// Search snippets stay concise while the visible editorial headlines retain their voice.
const snippets: Record<string, { title: string; description: string }> = {
  "frameworks/cross-border-hiring-decisions": {
    title: "Hiring from Abroad: Sourcing, Permits & Skills | Sufoniq",
    description: "Before hiring internationally, assess candidate sourcing, eligibility and qualification requirements together. Three questions for European employers.",
  },
  "frameworks/constraint-stacking": {
    title: "Why Similar Work Applications Get Different Results | Sufoniq",
    description: "Similar candidates can face different outcomes when timing, eligibility and employer requirements interact. Understand the constraints behind a hiring decision.",
  },
  "frameworks/lawful-not-random": {
    title: "Why Immigration Decisions Can Feel Unpredictable | Sufoniq",
    description: "Unclear processes can make lawful immigration decisions feel arbitrary. Explore how timing, discretion and limited visibility affect cross-border moves.",
  },
  growth: {
    title: "European Economic Growth & Hiring Context | Sufoniq",
    description: "Explore European GDP growth, productivity and migration data through visual analysis. Understand the economic context behind recruitment-market comparisons.",
  },
  "signals/correct-but-stuck": {
    title: "Why Complete Immigration Applications Get Delayed | Sufoniq",
    description: "A complete application can still face queues, capacity limits and handoff delays. Understand why eligibility alone does not determine processing speed.",
  },
  "signals/country-comparisons": {
    title: "Easiest Country to Work in Europe? What to Compare | Sufoniq",
    description: "Compare European work destinations by your occupation, eligibility, employer and timing. Why country rankings alone cannot establish your route to work.",
  },
  "signals/churn-is-signal": {
    title: "Employee Turnover After International Recruitment | Sufoniq",
    description: "Why employees leave after relocating: explore how job expectations, practical support and working conditions can shape retention after an international hire.",
  },
  "rules/lithuania-foreign-worker-quota-2026": {
    title: "Lithuania Work Quota 2026: Hiring After the Limit | Sufoniq",
    description: "An overview of Lithuania’s 2026 foreign-worker quota, salary conditions and application routes, with requirements to verify before planning a hire.",
  },
};

export function insightSnippet(slug: string, headline: string, framing: string) {
  return snippets[slug] ?? { title: `${headline} | Sufoniq`, description: framing };
}
