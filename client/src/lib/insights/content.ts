import type { Insight } from "../insights";

export type BodyBlock =
  | { type: "heading"; text: string }
  | { type: "quote"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] };

export interface InsightContent extends Insight {
  slugParts: string[];
  content: BodyBlock[];
  interpretation: string;
  boundary: string;
  whatThisIsNot: string[];
}

const buildIndex = <T extends InsightContent>(items: T[]): Record<string, T> => {
  return items.reduce((acc, item) => {
    acc[item.slugParts.join("/")] = item;
    return acc;
  }, {} as Record<string, T>);
};

const insightPages: InsightContent[] = [
  {
    slug: "growth",
    slugParts: ["growth"],
    type: "Visual Dissertation",
    title: "Growth is uneven. Your strategy shouldn't be.",
    framing: "A six-chapter visual dissertation on growth, momentum, and regional divergence.",
    readTime: undefined,
    date: "Jan 2026",
    tags: ["EU", "GDP"],
    featured: true,
    content: [],
    interpretation: "Charts show where momentum is real and where prestige doesn't mean growth.",
    boundary: "This narrative is descriptive; it does not scope a plan or offer guarantees.",
    whatThisIsNot: [],
  },
  {
    slug: "signals/correct-but-stuck",
    slugParts: ["signals", "correct-but-stuck"],
    type: "Signals & Patterns",
    title: "Everything can be correct - and still not move",
    framing:
      "This is one of the most common and most frustrating realities in cross-border mobility: everything checks out, and nothing happens. That isn't a contradiction. It's how the system works.",
    readTime: undefined,
    date: "Feb 2026",
    tags: ["throughput"],
    featured: false,
    content: [
      { type: "heading", text: "The sentence we hear most often" },
      { type: "quote", text: "\"Everything was correct, so why is it stuck?\"" },
      { type: "paragraph", text: "On the surface, that sounds reasonable. If all requirements are met, progress should follow." },
      { type: "paragraph", text: "In practice, that assumption breaks down very quickly." },
      {
        type: "paragraph",
        text: "Not because something went wrong - but because correctness and movement are not the same thing.",
      },
      { type: "heading", text: "Correctness answers one question. Movement answers another." },
      {
        type: "paragraph",
        text: "Most people treat mobility systems as linear: Submit -> Check -> Move. That model only works when capacity is abundant and demand is low. That is not the environment we're in anymore.",
      },
      {
        type: "paragraph",
        text: "In reality, cross-border systems operate in two layers:",
      },
      {
        type: "list",
        items: [
          "Eligibility: Are the rules met? Are the documents valid? Is this allowed?",
          "Throughput: Given current workload, staffing, priorities, and checks - does this move now?",
        ],
      },
      { type: "paragraph", text: "Correctness clears the first layer. It says nothing about the second." },
      { type: "heading", text: "Why paperwork feels like a lever (and isn't)" },
      { type: "paragraph", text: "Paperwork is tangible. You can complete it. You can double-check it. You can feel 'done'." },
      { type: "paragraph", text: "Throughput is invisible." },
      {
        type: "paragraph",
        text: "Queues, staffing levels, internal priorities, and verification depth don't show up in a checklist. So people default to the part they can control - and assume it should be enough.",
      },
      { type: "paragraph", text: "It used to be closer to enough. It isn't anymore." },
      { type: "heading", text: "Queues don't behave like timelines" },
      {
        type: "paragraph",
        text: "When systems run close to capacity, waiting stops being proportional. A small increase in demand can create a large increase in delay. Cases don't flow evenly. Some move. Some pause. Some sit quietly.",
      },
      { type: "paragraph", text: "From the outside, that looks broken. From the inside, it's a stable queue under load." },
      { type: "paragraph", text: "'Stuck' is often not a failure state. It's an equilibrium." },
      { type: "heading", text: "Prioritisation happens even when laws don't change" },
      {
        type: "paragraph",
        text: "A common reaction to delays is: 'But the rules didn't change.' That's usually true - and also beside the point.",
      },
      {
        type: "paragraph",
        text: "Prioritisation doesn't require new laws. It happens through staffing allocation, internal focus, risk filtering, and sequencing. None of that is announced. All of it affects movement.",
      },
      {
        type: "paragraph",
        text: "When priorities shift silently, outcomes start to look random. They aren't - but they are no longer predictable from the rules alone.",
      },
      { type: "heading", text: "Cross-system checks create pauses you can't see" },
      {
        type: "paragraph",
        text: "Modern mobility decisions rarely live in one system. Identity checks, security screening, employer validation, tax or registry verification - these systems talk to each other. Sometimes slowly. Sometimes sequentially.",
      },
      {
        type: "paragraph",
        text: "During those handoffs, nothing visibly happens. No update doesn't mean nothing is occurring. It often means the case is waiting on something you were never meant to watch.",
      },
      { type: "heading", text: "Why this feels personal when it isn't" },
      {
        type: "list",
        items: [
          "Humans are very good at filling gaps.",
          "When there's no feedback, we assume: something was missed, someone else is being favoured, a mistake was made.",
        ],
      },
      { type: "paragraph", text: "That's a natural response to opacity - not a diagnosis." },
      { type: "paragraph", text: "Most delays aren't personal. They're structural." },
      { type: "paragraph", text: "The system isn't responding to intent or effort. It's responding to load." },
      { type: "heading", text: "What becomes true in this environment" },
      {
        type: "paragraph",
        text: "Once throughput becomes the limiting factor, the system stops behaving like a schedule and starts behaving like a probability distribution.",
      },
      { type: "paragraph", text: "Things that are fully correct can still pause. Things that look identical can move at different speeds." },
      { type: "paragraph", text: "That isn't intuitive - but it is consistent." },
    ],
    interpretation:
      "Correct submissions can still stall because movement depends on queue load, prioritisation, and cross-system checks - not only on meeting requirements.",
    boundary:
      "This does not explain a specific case, predict timing, or imply wrongdoing. It describes why lawful systems can pause without error.",
    whatThisIsNot: [
      "Not legal advice",
      "Not a timing estimate",
      "Not a guide to speeding things up",
      "Not a claim about fairness or bias",
    ],
  },
  {
    slug: "frameworks/constraint-stacking",
    slugParts: ["frameworks", "constraint-stacking"],
    type: "Framework Note",
    title: "Constraint stacking: why outcomes diverge even under the same rules",
    framing:
      "When two cases look identical but end differently, it's tempting to assume inconsistency. More often, the difference lies in how constraints stack - not in the rules themselves.",
    readTime: undefined,
    date: "Feb 2026",
    tags: ["constraints"],
    featured: false,
    content: [
      { type: "heading", text: "The question behind the frustration" },
      {
        type: "quote",
        text: "\"But we have the same profile - why did they get through and I didn't?\" \"Two hires, same role, same country. Why is one straightforward and the other impossible?\"",
      },
      { type: "paragraph", text: "These questions come up constantly. And they're reasonable." },
      {
        type: "paragraph",
        text: "They're also based on a mental model that doesn't quite match how cross-border decisions are made.",
      },
      { type: "heading", text: "Decisions aren't gates. They're feasibility problems." },
      {
        type: "paragraph",
        text: "Most people imagine decisions as a single checkpoint: Eligible -> Approved, Not eligible -> Rejected. That's not how mobility systems work in practice.",
      },
      {
        type: "paragraph",
        text: "They behave more like feasibility problems with multiple constraints applied at once. A decision isn't made at one gate - it emerges from how many constraints are satisfied at the same time.",
      },
      { type: "paragraph", text: "Change one constraint, and the outcome can flip." },
      { type: "heading", text: "The constraint stack" },
      {
        type: "paragraph",
        text: "Every cross-border decision sits inside a stack of constraints. Some are obvious. Others are not.",
      },
      {
        type: "list",
        items: [
          "Hard constraints: legal eligibility, formal thresholds, statutory limits. If these aren't met, nothing else matters.",
          "Soft constraints: evidence strength, interpretation, risk posture, credibility signals. These aren't written as rules, but they shape how a case is evaluated.",
          "Temporal constraints: quota cycles, seasonal load, internal capacity, and policy focus all shift feasibility over time.",
          "Institutional constraints: offices differ, staffing differs, verification depth differs. Two systems applying the same law can behave very differently.",
        ],
      },
      {
        type: "paragraph",
        text: "Each constraint narrows the feasible space. Stack enough of them, and the window closes.",
      },
      { type: "heading", text: "Why small differences create large divergence" },
      {
        type: "paragraph",
        text: "This is where expectations usually break. People assume outcomes change gradually - that being 'slightly different' produces a 'slightly different' result.",
      },
      {
        type: "paragraph",
        text: "Constraint stacks don't behave that way. They behave more like thresholds. Everything works... until it doesn't.",
      },
      {
        type: "paragraph",
        text: "A minor timing difference. A slightly different contract structure. A change in employer status. A different office handling verification.",
      },
      {
        type: "paragraph",
        text: "Individually, these don't feel decisive. Together, they are.",
      },
      { type: "heading", text: "'Same rules' doesn't mean 'same decision'" },
      {
        type: "paragraph",
        text: "When people say 'the rules are the same,' they're usually right. What changes is how many constraints are active at once - and how tightly they're applied.",
      },
      {
        type: "paragraph",
        text: "Rules define the outer boundary. Constraints determine whether anything fits inside it.",
      },
      {
        type: "paragraph",
        text: "That distinction explains most divergence without requiring inconsistency, bias, or error.",
      },
      { type: "heading", text: "Why this feels unfair" },
      {
        type: "paragraph",
        text: "Constraint stacking is invisible. People only see the inputs they provided - not the constraints that activated downstream. When outcomes diverge, the system feels arbitrary.",
      },
      { type: "paragraph", text: "It isn't random. It's just not narrating itself." },
      { type: "heading", text: "What becomes clear once you see the stack" },
      {
        type: "list",
        items: [
          "Similar cases can diverge without contradiction.",
          "Timing can matter more than profile.",
          "Outcomes can flip suddenly, not gradually.",
        ],
      },
      {
        type: "paragraph",
        text: "None of this makes the system friendly. But it does make it legible.",
      },
    ],
    interpretation:
      "Decisions diverge because feasibility is produced by stacked constraints - not by a single rule. Small differences can flip outcomes entirely.",
    boundary:
      "This does not rank pathways, recommend actions, or predict results. It explains why similar inputs can lead to different outcomes inside lawful systems.",
    whatThisIsNot: [
      "Not a comparison of 'better' or 'worse' paths",
      "Not guidance on how to adjust a case",
      "Not a fairness judgment",
    ],
  },
  {
    slug: "frameworks/lawful-not-random",
    slugParts: ["frameworks", "lawful-not-random"],
    type: "Framework Note",
    title: "Lawful systems can feel arbitrary without being random",
    framing:
      "When outcomes are hard to explain and timelines don't behave, people assume randomness. What's usually missing isn't logic - it's visibility.",
    readTime: undefined,
    date: "Feb 2026",
    tags: ["opacity"],
    featured: false,
    content: [
      { type: "heading", text: "The reaction we hear most often" },
      {
        type: "quote",
        text: "\"This feels random.\" \"They just decide however they want.\" \"No one can tell me what's happening.\"",
      },
      { type: "paragraph", text: "Those reactions are understandable. They're also a response to opacity, not proof of chaos." },
      { type: "heading", text: "Random and opaque are not the same thing" },
      {
        type: "paragraph",
        text: "Random systems have no structure. Opaque systems have structure you can't see.",
      },
      {
        type: "paragraph",
        text: "Cross-border mobility systems are firmly in the second category. They follow internal logic. They apply rules. They prioritise risk. They just don't narrate themselves while doing it.",
      },
      { type: "heading", text: "Why discretion exists at all" },
      {
        type: "paragraph",
        text: "Rules can't encode every situation. They define boundaries, not judgment. Discretion fills the gaps where context matters - evidence quality, credibility, risk signals, edge cases.",
      },
      { type: "paragraph", text: "That discretion introduces variation. Variation looks arbitrary when you're on the outside." },
      { type: "paragraph", text: "Inside the system, it's how complexity is handled." },
      { type: "heading", text: "Risk heuristics quietly shape outcomes" },
      {
        type: "paragraph",
        text: "Modern mobility systems don't treat all cases equally - by design. They allocate attention where perceived risk is higher: background verification, identity consistency, employer credibility, cross-border exposure.",
      },
      { type: "paragraph", text: "This doesn't mean something is wrong. It means scrutiny is uneven." },
      { type: "paragraph", text: "Uneven scrutiny creates uneven timelines - and very little explanation." },
      { type: "heading", text: "Why feedback is limited" },
      {
        type: "paragraph",
        text: "A natural follow-up question is: 'Why don't they just explain what's happening?' There are reasons they don't.",
      },
      {
        type: "list",
        items: [
          "Explaining internal logic in detail can expose systems to gaming.",
          "It can create legal risk.",
          "It can increase administrative load.",
          "It can harden expectations the system can't reliably meet.",
        ],
      },
      {
        type: "paragraph",
        text: "So feedback is minimal by design. From the outside, that silence feels dismissive. From the inside, it's defensive architecture.",
      },
      { type: "heading", text: "How opacity turns into frustration" },
      {
        type: "paragraph",
        text: "Sometimes those stories are true. Often, they're just the mind reacting to uncertainty.",
      },
      { type: "paragraph", text: "Opacity doesn't calm people. But it doesn't imply randomness either." },
      { type: "heading", text: "What can be concluded - and what can't" },
      {
        type: "paragraph",
        text: "What can be said with confidence: decisions follow internal logic, discretion and risk filtering are structural features, timelines vary because scrutiny varies.",
      },
      {
        type: "paragraph",
        text: "What can't be concluded: that outcomes are predictable, that silence means rejection, that every difference implies unfairness.",
      },
      { type: "paragraph", text: "The system is lawful. It is not legible in real time." },
    ],
    interpretation:
      "Perceived arbitrariness usually comes from opaque discretion and risk-based verification - not from randomness.",
    boundary:
      "This does not justify every decision, claim fairness, or explain a specific case. It explains why lawful systems can still feel unreadable from the outside.",
    whatThisIsNot: [
      "Not an apology for bureaucracy",
      "Not a defense of every outcome",
      "Not a promise of transparency",
    ],
  },
  {
    slug: "signals/country-comparisons",
    slugParts: ["signals", "country-comparisons"],
    type: "Signals & Patterns",
    title: "Why country comparisons mislead more than they inform",
    framing:
      "If cross-border decisions were about picking a destination, rankings would help. They aren’t. Outcomes depend on pathways, timing, and constraints — not on country reputations.",
    readTime: undefined,
    date: "Feb 2026",
    tags: ["comparisons"],
    featured: false,
    content: [
      { type: "heading", text: "The question that starts it" },
      {
        type: "quote",
        text: "“Which country is best for this?” “Just tell me the easiest country.”",
      },
      {
        type: "paragraph",
        text: "These questions show up everywhere. Blogs love them. Lists love them. Algorithms love them. Systems don’t.",
      },
      { type: "heading", text: "Countries are not products" },
      {
        type: "paragraph",
        text: "Most comparison lists treat countries like interchangeable options on a shelf: better tax here, easier paperwork there, nicer lifestyle over there. That framing is comforting. It’s also misleading.",
      },
      {
        type: "paragraph",
        text: "Mobility systems don’t evaluate countries. They evaluate pathways inside countries. And pathways don’t behave uniformly.",
      },
      { type: "heading", text: "Country ≠ pathway" },
      {
        type: "paragraph",
        text: "A single country can contain dozens of legal routes, each with its own eligibility thresholds, evidence expectations, verification depth, timelines, and failure modes.",
      },
      {
        type: "paragraph",
        text: "Two people “choosing the same country” may not be choosing the same thing at all. One pathway fits. Another collapses under constraints.",
      },
      { type: "paragraph", text: "The destination didn’t decide that. The pathway did." },
      { type: "heading", text: "Policy surface vs policy texture" },
      {
        type: "paragraph",
        text: "Most country comparisons focus on what’s written: laws, eligibility summaries, official promises. That’s the policy surface.",
      },
      {
        type: "paragraph",
        text: "What actually determines outcomes lives underneath — the policy texture: how verification is applied, how risk is interpreted, how capacity is allocated, how priorities shift.",
      },
      {
        type: "paragraph",
        text: "Texture varies by country, by office, and over time. Lists rarely acknowledge this, because it breaks the format.",
      },
      { type: "heading", text: "“Easiest” is unstable by definition" },
      {
        type: "paragraph",
        text: "Even if a country appears straightforward at one moment, that condition doesn’t hold. Demand changes. Backlogs form. Political focus shifts. Staffing moves.",
      },
      {
        type: "paragraph",
        text: "A list written six months ago already describes a different system. That’s not volatility. That’s normal system behaviour.",
      },
      { type: "heading", text: "Why these lists feel useful anyway" },
      {
        type: "paragraph",
        text: "Country rankings reduce complexity into a single axis. They let people feel oriented quickly.",
      },
      {
        type: "paragraph",
        text: "That feeling doesn’t survive contact with constraints. Once pathway fit, timing, and verification depth enter the picture, the clarity evaporates — often after months of effort.",
      },
      { type: "heading", text: "Why Sufoniq doesn’t publish country rankings" },
      {
        type: "paragraph",
        text: "This isn’t a moral position. It’s a structural one.",
      },
      {
        type: "paragraph",
        text: "Country-first framing produces false certainty. It hides the variables that actually determine feasibility. We’d rather describe the terrain accurately than rank it poorly.",
      },
      { type: "heading", text: "A more accurate mental model" },
      {
        type: "paragraph",
        text: "In practice, decisions flow like this: Constraints → feasible pathways → destination.",
      },
      {
        type: "paragraph",
        text: "Not the other way around. Country is the last variable that stabilises — not the first one to optimise.",
      },
    ],
    interpretation:
      "Country comparisons flatten pathway fit, enforcement texture, and timing — so they over-promise clarity while under-describing constraints.",
    boundary:
      "This does not argue that any country is “better” or “worse,” or that outcomes can be generalised. It explains why rankings misrepresent how mobility systems actually behave.",
    whatThisIsNot: [
      "Not a destination guide",
      "Not a list of “easy” countries",
      "Not a shortcut around analysis",
    ],
  },
  {
    slug: "signals/churn-is-signal",
    slugParts: ["signals", "churn-is-signal"],
    type: "Signals & Patterns",
    title: "When churn is the signal, not the problem",
    framing:
      "In cross-border and remote contexts, churn rarely appears out of nowhere. More often, it shows up after structural friction becomes lived reality — not because intent or performance suddenly changed.",
    readTime: "6 min",
    date: "Feb 2026",
    tags: ["churn"],
    featured: false,
    content: [
      { type: "heading", text: "The pattern people notice too late" },
      { type: "quote", text: "“They were fine — and then they left.”" },
      { type: "paragraph", text: "Churn is usually described as a moment: a resignation, a departure, an exit date." },
      {
        type: "paragraph",
        text: "In reality, it’s the last visible step in a much longer process.",
      },
      {
        type: "paragraph",
        text: "Across cross-border hiring, relocation, and long-term remote work, exits tend to cluster early — often within the first year — and around the same structural moments.",
      },
      { type: "paragraph", text: "That clustering is the signal." },
      { type: "heading", text: "Where churn consistently appears" },
      {
        type: "paragraph",
        text: "Across countries, industries, and employment models, early churn tends to surface after a familiar sequence:",
      },
      {
        type: "list",
        items: [
          "onboarding friction accumulates",
          "payroll, tax, or benefits become unstable or delayed",
          "legal or residency uncertainty stops being theoretical",
          "family or personal adaptation strains daily routines",
          "probation, time-limited remote arrangements, or repatriation decisions arrive",
        ],
      },
      {
        type: "paragraph",
        text: "None of these events are unusual on their own.",
      },
      {
        type: "paragraph",
        text: "What matters is when several of them converge — quietly, and early.",
      },
      { type: "heading", text: "Why churn feels sudden when it isn’t" },
      {
        type: "paragraph",
        text: "From the outside, departures often look abrupt.",
      },
      {
        type: "paragraph",
        text: "From the inside, they usually follow a period where constraints stop being abstract and start affecting day-to-day life:",
      },
      {
        type: "list",
        items: [
          "pay arriving late instead of “eventually”",
          "compliance limits becoming personal exposure",
          "residency timelines colliding with family needs",
          "career uncertainty replacing initial momentum",
        ],
      },
      {
        type: "paragraph",
        text: "By the time churn is visible, the cost of staying has already been calculated.",
      },
      { type: "paragraph", text: "Exit isn’t a reaction. It’s a resolution." },
      { type: "heading", text: "What churn is often mistaken for" },
      {
        type: "paragraph",
        text: "Because exits are personal decisions, churn is often framed as one:",
      },
      {
        type: "list",
        items: [
          "lack of commitment",
          "performance mismatch",
          "generational restlessness",
          "compensation dissatisfaction",
        ],
      },
      {
        type: "paragraph",
        text: "These explanations appear frequently — and fail to explain clustering.",
      },
      {
        type: "paragraph",
        text: "Across contexts, churn rises and falls with system friction far more consistently than with individual traits.",
      },
      { type: "heading", text: "Why early churn clusters instead of spreading out" },
      {
        type: "paragraph",
        text: "Structural thresholds concentrate exits.",
      },
      {
        type: "list",
        items: [
          "Probation periods, capped remote arrangements, relocation checkpoints, and repatriation moments act as decision gates.",
          "They force unresolved friction to surface at the same time.",
        ],
      },
      {
        type: "paragraph",
        text: "The system doesn’t spread pressure evenly. It releases it in bursts.",
      },
      { type: "paragraph", text: "That’s why churn often spikes — not gradually, but suddenly." },
      { type: "heading", text: "The overlooked role of invisibility" },
      {
        type: "paragraph",
        text: "Many of the constraints that precede churn are hard to see early on:",
      },
      {
        type: "list",
        items: [
          "legal limits that only activate after time passes",
          "payroll and tax complexity that emerges after the first cycles",
          "family stress that builds once novelty fades",
          "career ambiguity that becomes clear after initial roles settle",
        ],
      },
      {
        type: "paragraph",
        text: "Because these frictions aren’t fully legible at entry, they’re often discovered too late to absorb.",
      },
      { type: "paragraph", text: "Churn becomes the first visible outcome of that discovery." },
      { type: "heading", text: "What this reframes" },
      {
        type: "paragraph",
        text: "Seen this way, churn is less a verdict and more a trace.",
      },
      {
        type: "paragraph",
        text: "It records where systems failed to stabilise quickly enough — not where people failed to adapt.",
      },
      {
        type: "paragraph",
        text: "That doesn’t make churn predictable. And it doesn’t make it avoidable. It makes it legible.",
      },
    ],
    interpretation:
      "In cross-border and remote contexts, churn usually appears as a lagging indicator of unresolved structural friction — once constraints become lived reality rather than abstract conditions.",
    boundary:
      "This does not predict churn, assign blame, or imply that all exits are structural. It explains why churn clusters early and unevenly without reducing it to individual intent or performance.",
    whatThisIsNot: [
      "Not a retention strategy",
      "Not a diagnostic tool",
      "Not a judgement of employers or workers",
      "Not guidance on how to reduce churn",
    ],
  },
];

const slugMap = buildIndex(insightPages);

export const insightContents = insightPages;

export function listInsights(): InsightContent[] {
  return insightContents;
}

export function getInsightBySlug(slugParts: string[]): InsightContent | null {
  const key = slugParts.join("/");
  return slugMap[key] ?? null;
}
