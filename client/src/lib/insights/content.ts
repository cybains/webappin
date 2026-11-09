import type { Insight } from "../insights";

export type BodyBlock =
  | { type: "heading"; text: string }
  | { type: "quote"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | { type: "table"; columns: string[]; rows: string[][] }
  | { type: "faq"; items: { q: string; a: string }[] }
  | { type: "link"; href: string; text: string }
  | { type: "source"; href: string; text: string };

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
    slug: "frameworks/cross-border-hiring-decisions",
    slugParts: ["frameworks", "cross-border-hiring-decisions"],
    type: "Framework Note",
    title: "Hiring from abroad: a candidate pool is not a hiring pipeline",
    framing: "Hiring from abroad? Sourcing, eligibility and qualification requirements have to hold together before a cross-border hire — three questions decide whether a candidate pool becomes a route.",
    readTime: "4 min",
    date: "Oct 2026",
    tags: ["hiring", "sourcing", "mobility", "qualifications"],
    featured: false,
    content: [
      { type: "paragraph", text: "A role remains open, the local search produces no suitable applicants, and someone suggests looking abroad. The first visible question is about supply: where are the people? Even a good answer does not establish whether those people could take this particular job, in this destination, within the proposed window." },
      { type: "paragraph", text: "Three questions help explain the gap between a reachable candidate pool and a workable hiring route: whether the market fits the role, whether the individual meets the applicable eligibility requirements, and whether their qualifications meet the requirements of the work. These questions inform each other; they rarely close in sequence." },
      { type: "heading", text: "1. Sourcing: reachable is not the same as hireable" },
      { type: "paragraph", text: "A large pool can contain people who are experienced, interested and available to speak, while important questions about their route to work remain unanswered. Pool size measures contact. Candidate fit, acceptance of the employment terms, and readiness to start are separate questions." },
      { type: "paragraph", text: "The role matters as much as the market. Skills, experience, language, pay, shifts and location affect who may be suitable and interested. Wider sourcing may expose a supply gap, but it can also expose a mismatch between the employment offer and the people the employer hopes to attract." },
      { type: "paragraph", text: "A sourcing option becomes more useful when its evidence and open questions travel with it: what is known about relevant skills, which requirements could limit the route, what the offer needs to support, and which assumptions still need testing. A shortlist of countries without that context can create confidence before it creates a plan." },
      { type: "heading", text: "2. Eligibility: the role and the person belong in the same assessment" },
      { type: "paragraph", text: "A sourcing market alone does not determine a candidate’s route. The person’s circumstances and the destination’s requirements also matter. Two candidates considered for the same role may have different documents, outstanding checks or timing dependencies." },
      { type: "paragraph", text: "Illustrative example — the specifics vary case to case." },
      { type: "paragraph", text: "Two drivers apply for the same role in the same destination. One holds a Code 95 licence that matches the job, the language level the employer asks for, and every document in order. The other has the same experience — but one document is still being verified, one check is outstanding, and their start date waits on a decision neither of them controls." },
      { type: "paragraph", text: "Same role. Same market. One route is ready to file; the other is three dependencies deep." },
      { type: "paragraph", text: "An identified route, a prepared application, a submitted application and a decision are four different states of readiness. Describing all of them as ‘the paperwork is underway’ hides information that the hiring plan needs." },
      { type: "paragraph", text: "A useful assessment separates what has been checked, what is being assumed and what remains for a decision-maker to determine. Giving an unresolved question an owner makes it actionable, but it does not turn it into a confirmed answer." },
      { type: "heading", text: "3. Qualifications: experience and readiness answer different questions" },
      { type: "paragraph", text: "A candidate may be experienced and hold documentary evidence of that experience, while the destination’s requirements for the role still need to be established. The relevant questions can involve recognition, registration, licensing or additional training. Which of these applies depends on the particular role, destination and qualification." },
      { type: "paragraph", text: "Healthcare shows the order best: language requirements, credential recognition and permits are confirmed first. A complete experience record answers none of those three." },
      { type: "paragraph", text: "This assessment belongs early enough to influence the sourcing decision. If a qualification-related step changes the time, cost or feasibility of the route, leaving it until after candidate selection can turn an avoidable assumption into a difficult handoff." },
      { type: "paragraph", text: "Different qualifications follow different procedures, and not every gap blocks a hire. An experience record, a qualification document and readiness for a particular job stay three different forms of evidence." },
      { type: "heading", text: "The checks connect in both directions" },
      { type: "paragraph", text: "Sourcing, eligibility and qualifications provide a useful reading order. The work itself may move between them. A qualification requirement can narrow the sourcing options. A candidate-specific eligibility issue can change the route. A revised start window can change which options are practical." },
      { type: "list", items: ["A market assessment raises candidate and destination requirements to investigate.", "Candidate screening adds evidence that may support or change the original market assumptions.", "Qualification and licensing checks can send the assessment back to the role criteria, sourcing options or planning window."] },
      { type: "paragraph", text: "The framework exposes those dependencies before commitments become difficult to change. Its value is an explanation of why the plan currently looks workable — and what could still change that view." },
      { type: "heading", text: "A planned start date needs visible dependencies" },
      { type: "paragraph", text: "An employer and candidate can agree a target date. That agreement does not settle the outstanding requirements behind it. Authorities decide the applications within their remit; employers and candidates plan the employment start around the required decisions and readiness checks." },
      { type: "paragraph", text: "A date is easier to assess when the plan distinguishes completed steps from unresolved ones, identifies who can act next, and records which steps depend on another decision. Where an external decision remains open, the date remains a planning assumption rather than a confirmed milestone." },
      { type: "paragraph", text: "The practical distinction is between a date attached to a candidate and a date supported by a route. A credible route makes its uncertainties visible. It does not need to pretend they have disappeared." },
      { type: "paragraph", text: "Put the role you need to fill, the destination and your main question into the intake form — and start with whichever of the three questions is still open for you." },
      { type: "link", href: "/employers#employer-enquiry", text: "Tell us the role →" },
    ],
    interpretation: "A candidate pool becomes relevant to a hiring plan when role fit, eligibility and qualification requirements are assessed together. Each new piece of evidence can change the route and the proposed timing.",
    boundary: "This is a framework for understanding dependencies. It does not establish the requirements for a particular country, confirm a candidate’s eligibility or replace checks with the relevant authorities and competent bodies.",
    whatThisIsNot: ["A prescribed sequence for every hire", "A country-specific legal or immigration assessment", "Confirmation that a qualification is sufficient for a role", "A guarantee of candidate availability, an application outcome or a start date"],
  },
  {
    slug: "growth",
    slugParts: ["growth"],
    type: "Visual Dissertation",
    title: "Growth is uneven. Your strategy shouldn't be.",
    framing: "A five-chapter visual dissertation on GDP growth across Europe: where momentum is real, where prestige doesn't mean growth, and why uneven growth needs a strategy that follows it.",
    readTime: "4 min",
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
    title: "Everything correct, still stuck: why mobility queues don't move",
    framing:
      "Everything checks out and nothing happens: why a correct application can still get stuck — throughput, not eligibility, decides movement. That's how the system works.",
    readTime: "4 min",
    date: "Feb 2026",
    tags: ["throughput"],
    featured: false,
    content: [
      { type: "heading", text: "The sentence we hear most often" },
      { type: "quote", text: "\"Everything was correct, so why is it stuck?\"" },
      { type: "paragraph", text: "On the surface, that sounds reasonable. If all requirements are met, progress should follow." },
      { type: "paragraph", text: "In practice, it breaks down quickly. Correctness and movement are simply two different things." },
      { type: "heading", text: "Correctness answers one question. Movement answers another." },
      {
        type: "paragraph",
        text: "Most people treat mobility systems as linear: Submit → Check → Move. A linear model assumes abundant capacity and low demand — the environment we're in has neither.",
      },
      {
        type: "paragraph",
        text: "In reality, cross-border systems operate in two layers:",
      },
      {
        type: "list",
        items: [
          "Eligibility: Are the rules met? Are the documents valid? Is this allowed?",
          "Throughput: Given current workload, staffing, priorities, and checks — does this move now?",
        ],
      },
      { type: "paragraph", text: "Correctness clears the first layer. It says nothing about the second." },
      { type: "paragraph", text: "Illustrative example — the specifics vary case to case." },
      {
        type: "paragraph",
        text: "Two applications reach the same office in the same week. Both are correct on paper. One is checked in sequence and moves. The other waits while an identity check talks to a registry in another system. Nothing either applicant did differently — no checklist shows an error.",
      },
      { type: "heading", text: "Why paperwork feels like a lever (and isn't)" },
      { type: "paragraph", text: "Paperwork is tangible. You can complete it, double-check it, feel 'done' with it." },
      { type: "paragraph", text: "Throughput is invisible." },
      {
        type: "paragraph",
        text: "Queues, staffing levels, internal priorities, and verification depth don't show up in a checklist. So people default to the part they can control — and assume it should be enough.",
      },
      { type: "paragraph", text: "It used to be closer to enough. Not anymore." },
      { type: "heading", text: "Queues don't behave like timelines" },
      {
        type: "paragraph",
        text: "When systems run close to capacity, waiting stops being proportional. A small increase in demand can create a large increase in delay. Cases don't flow evenly: some move, some pause, and others sit idle.",
      },
      { type: "paragraph", text: "From the outside, that looks broken. From the inside, it's a stable queue under load." },
      { type: "paragraph", text: "'Stuck' usually means the queue has found an equilibrium." },
      { type: "heading", text: "Prioritisation happens even when laws don't change" },
      {
        type: "paragraph",
        text: "A common reaction to delays is: 'But the rules didn't change.' That's usually true — and also beside the point.",
      },
      {
        type: "paragraph",
        text: "Prioritisation doesn't require new laws. It happens through staffing allocation, internal focus, risk filtering, and sequencing. None of that is announced. All of it affects movement.",
      },
      {
        type: "paragraph",
        text: "When priorities shift silently, outcomes stop being predictable from the rules alone — without becoming random.",
      },
      { type: "heading", text: "Cross-system checks create pauses you can't see" },
      {
        type: "paragraph",
        text: "Modern mobility decisions rarely live in one system. Identity checks, security screening, employer validation, tax or registry verification — these systems talk to each other. Sometimes slowly. Sometimes sequentially.",
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
      { type: "paragraph", text: "That's a natural response to opacity, not a diagnosis." },
      { type: "paragraph", text: "Most delays are structural, not personal." },
      { type: "paragraph", text: "The system responds to load, not to intent or effort." },
      { type: "heading", text: "What becomes true in this environment" },
      {
        type: "paragraph",
        text: "Once throughput becomes the limiting factor, the system stops behaving like a schedule and starts behaving like a probability distribution.",
      },
      { type: "paragraph", text: "Things that are fully correct can still pause. Things that look identical can move at different speeds." },
      { type: "paragraph", text: "It feels counterintuitive, yet it holds." },
      {
        type: "paragraph",
        text: "Tell us your trade and country, and we'll tell you approximately what you can apply for right now — even if everything already looks correct on paper.",
      },
      { type: "link", href: "/work-in-europe", text: "Tell us your trade →" },
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
    title: "Same profile, different decision: why outcomes diverge under the same rules",
    framing:
      "When two cases end differently, the difference usually lies in how constraints stack — not in the rules themselves.",
    readTime: "5 min",
    date: "Feb 2026",
    tags: ["constraints"],
    featured: false,
    content: [
      { type: "heading", text: "The question behind the frustration" },
      {
        type: "quote",
        text: "\"But we have the same profile — why did they get through and I didn't?\" \"Two hires, same role, same country. Why is one straightforward and the other impossible?\"",
      },
      { type: "paragraph", text: "These questions come up constantly. And they're reasonable." },
      {
        type: "paragraph",
        text: "They're also based on a mental model that doesn't quite match how cross-border decisions are made.",
      },
      { type: "heading", text: "Decisions aren't gates. They're feasibility problems." },
      {
        type: "paragraph",
        text: "Most people imagine decisions as a single checkpoint: Eligible → Approved, Not eligible → Rejected. That's not how mobility systems work in practice.",
      },
      {
        type: "paragraph",
        text: "They behave more like feasibility problems with multiple constraints applied at once: the decision emerges from how many constraints are satisfied together, not from a single gate.",
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
      { type: "paragraph", text: "Illustrative example — the specifics vary case to case." },
      {
        type: "paragraph",
        text: "Two candidates, same role, same country, same written requirements met. One starts on schedule. The other's start window hits a seasonal capacity peak, the newly registered employer triggers deeper verification, and one document is still under review. Eligibility never differed — the stack did.",
      },
      { type: "heading", text: "Why small differences create large divergence" },
      {
        type: "paragraph",
        text: "Expectations usually break here. People assume outcomes change gradually — that being 'slightly different' produces a 'slightly different' result.",
      },
      {
        type: "paragraph",
        text: "Constraint stacks behave like thresholds: everything works… until it doesn't.",
      },
      {
        type: "paragraph",
        text: "The differences look small on paper — a timing difference, a slightly different contract structure, a change in employer status, a different office handling verification.",
      },
      {
        type: "paragraph",
        text: "Individually they seem minor; together they decide.",
      },
      { type: "heading", text: "'Same rules' doesn't mean 'same decision'" },
      {
        type: "paragraph",
        text: "When people say 'the rules are the same,' they're usually right. What changes is how many constraints are active at once — and how tightly they're applied.",
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
        text: "Constraint stacking is invisible. People only see the inputs they provided — not the constraints that activated downstream. When outcomes diverge, the system feels arbitrary.",
      },
      { type: "paragraph", text: "The system isn't random; it just doesn't narrate itself." },
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
        text: "It makes the system legible, if not friendly.",
      },
      {
        type: "paragraph",
        text: "Put your role or trade, the destination and your main question into the intake form — whichever constraint is binding, it belongs in the message field.",
      },
      { type: "link", href: "/work-in-europe", text: "Tell us your situation →" },
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
    title: "Why it feels random: lawful systems can feel arbitrary without being random",
    framing:
      "Why does it feel random? When outcomes are hard to explain and timelines don't behave, people assume randomness — what's usually missing isn't logic, it's visibility.",
    readTime: "4 min",
    date: "Feb 2026",
    tags: ["opacity"],
    featured: false,
    content: [
      { type: "heading", text: "The reaction we hear most often" },
      {
        type: "quote",
        text: "\"It feels random.\" \"They just decide however they want.\" \"No one can tell me what's happening.\"",
      },
      { type: "paragraph", text: "The reactions are understandable. They're also a response to opacity, not proof of chaos." },
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
        text: "Rules can't encode every situation. They define boundaries, not judgment. Discretion fills the gaps where context matters — evidence quality, credibility, risk signals, edge cases.",
      },
      { type: "paragraph", text: "That discretion introduces variation. Variation looks arbitrary when you're on the outside." },
      { type: "paragraph", text: "Inside the system, it's how complexity is handled." },
      { type: "heading", text: "Risk heuristics quietly shape outcomes" },
      {
        type: "paragraph",
        text: "Modern mobility systems don't treat all cases equally — by design. They allocate attention where perceived risk is higher: background verification, identity consistency, employer credibility, cross-border exposure.",
      },
      {
        type: "paragraph",
        text: "Uneven scrutiny follows where the system perceives risk, and it creates uneven timelines with very little explanation to show for it.",
      },
      { type: "paragraph", text: "Illustrative example — the specifics vary case to case." },
      {
        type: "paragraph",
        text: "Two candidates submit equally complete applications. One's employer is long-established and has been verified before; the other's employer is newly registered. The second application is read more carefully: scrutiny follows perceived risk, and the applicant's own file played no part in that difference.",
      },
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
        text: "Feedback stays minimal by design: from the outside the silence feels dismissive, while from the inside it serves as defensive architecture.",
      },
      { type: "heading", text: "How opacity turns into frustration" },
      {
        type: "paragraph",
        text: "When a case moves without explanation, people tell themselves stories: the file was skipped, someone else was favoured, a mistake was made somewhere.",
      },
      {
        type: "paragraph",
        text: "Sometimes those stories are true. Often, they're just the mind reacting to uncertainty.",
      },
      { type: "paragraph", text: "Opacity doesn't calm people. But it doesn't imply randomness either." },
      { type: "heading", text: "What can be concluded — and what can't" },
      {
        type: "paragraph",
        text: "What can be said with confidence: decisions follow internal logic, discretion and risk filtering are structural features, timelines vary because scrutiny varies.",
      },
      {
        type: "paragraph",
        text: "What can't be concluded: that outcomes are predictable, that silence means rejection, that every difference implies unfairness.",
      },
      { type: "paragraph", text: "The system is lawful. It is not legible in real time." },
      {
        type: "paragraph",
        text: "If you want to know where your case actually stands, tell us your trade and country — the first reply tells you approximately what you can apply for right now.",
      },
      { type: "link", href: "/work-in-europe", text: "Tell us your trade →" },
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
    title: "Easiest country to work in Europe? Why country comparisons mislead more than they inform",
    framing:
      "Looking for the easiest European country to work in? Lists mislead: outcomes are decided by pathway, timing and constraints — not country reputations. Here’s what to ask instead.",
    readTime: "4 min",
    date: "Feb 2026",
    tags: ["comparisons", "pathways", "visas"],
    featured: false,
    content: [
      { type: "heading", text: "The question that starts it" },
      {
        type: "quote",
        text: "“Which country is best for this?” “Just tell me the easiest country.”",
      },
      {
        type: "paragraph",
        text: "These questions show up everywhere. Blogs love them. Lists love them. Algorithms love them. Systems don’t. Lists feel useful because they reduce a messy decision to one axis — but that feeling doesn’t survive contact with real constraints.",
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
      { type: "heading", text: "Two people, one country" },
      {
        type: "paragraph",
        text: "Illustrative example — the specifics vary case to case.",
      },
      {
        type: "paragraph",
        text: "Take two welders. One has an EN ISO 9606-1 certificate that matches the job, the A2 language level the employer asks for, and every document in order. The other wants the same job — but their certificate has to be recognised first, nobody mentioned that A2 requirement, and the flights were already booked.",
      },
      {
        type: "paragraph",
        text: "Same country. Same trade. One pathway opens; the other stalls on a piece of paper.",
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
        text: "A list written six months ago already describes a different system.",
      },
      { type: "heading", text: "Why Sufoniq doesn’t publish country rankings" },
      {
        type: "paragraph",
        text: "This isn’t a moral position. It’s a structural one.",
      },
      {
        type: "paragraph",
        text: "Country-first framing produces false certainty. It hides the variables that determine feasibility. We’d rather describe the terrain accurately than rank it poorly.",
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
      { type: "heading", text: "What to do instead" },
      {
        type: "paragraph",
        text: "Don’t start with countries. Start with your constraints: trade, certificates, language, documents, timing. Ask which pathways those allow — the destination falls out of that.",
      },
      {
        type: "paragraph",
        text: "That’s exactly what the first reply does on our job-seeker page. Tell us your trade and country, and we’ll tell you approximately what you can apply for right now.",
      },
      { type: "link", href: "/work-in-europe", text: "Tell us your trade →" },
    ],
    interpretation:
      "Country comparisons flatten pathway fit, enforcement texture, and timing — so they over-promise clarity while under-describing constraints.",
    boundary:
      "This does not argue that any country is “better” or “worse,” or that outcomes can be generalised. It explains why rankings misrepresent how mobility systems behave.",
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
    title: "Employee turnover after relocation: when churn is the signal, not the problem",
    framing:
      "Churn after cross-border hires rarely comes out of nowhere — it shows up after structural friction becomes lived reality, not because intent or performance suddenly changed.",
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
      { type: "paragraph", text: "The clustering is the signal." },
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
      { type: "paragraph", text: "Exit is a resolution, not a reaction." },
      { type: "paragraph", text: "Illustrative example — the specifics vary case to case." },
      {
        type: "paragraph",
        text: "An employer hires across borders. The role is filled, the person relocates, the documents are handled. Then payroll slips once, a residency question stays open, and family routines strain. Nothing dramatic happens — and the resignation arrives with no warning anyone can point to.",
      },
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
        text: "The system concentrates pressure and releases it in bursts.",
      },
      { type: "paragraph", text: "That’s why churn arrives in spikes, not gradual drift." },
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
        text: "It buys legibility, not prediction or avoidance.",
      },
      {
        type: "paragraph",
        text: "The friction on these lists often starts before day one — with the mobility requirements a hire needs to start. Read how those requirements shape a cross-border hire:",
      },
      { type: "link", href: "/insights/frameworks/cross-border-hiring-decisions", text: "Hiring from abroad →" },
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
  {
    slug: "rules/lithuania-foreign-worker-quota-2026",
    "slugParts": [
      "rules",
      "lithuania-foreign-worker-quota-2026"
    ],
    "type": "Country Rules",
    "title": "Lithuania’s 2026 worker quota is full. What can employers do next?",
    "framing": "The quota is used, but not every hire follows the same route. Check salary conditions, candidate status and November filing rules before planning a start.",
    "readTime": "6 min",
    "date": "Nov 2026",
    "tags": [
      "hiring",
      "mobility",
      "permits",
      "lithuania",
      "visas"
    ],
    "featured": false,
    "content": [
      {
        "type": "paragraph",
        "text": "You have a role to fill in Lithuania and a candidate outside the EU. The annual quota is full. Before abandoning the hire—or promising a start date—check which rules apply to this candidate and this employment offer."
      },
      {
        "type": "paragraph",
        "text": "Lithuania set its 2026 foreign-worker employment quota at 24,706. The Ministry of the Interior confirmed on 7 October that it had been fully used. That affects quota-based applications; it does not close every route to employment."
      },
      {
        "type": "source",
        "href": "https://vrm.lrv.lt/lt/naujienos/ministras-m-katelynas-migracijos-politika-turi-atitikti-valstybes-saugumo-interesus-Pwvb/",
        "text": "Ministry of the Interior: 2026 quota status (7 October, Lithuanian)"
      },
      {
        "type": "heading",
        "text": "First, check whether this hire uses the quota"
      },
      {
        "type": "paragraph",
        "text": "The quota concerns temporary residence permits issued on the employment basis to which it applies. The Migration Department distinguishes new permits from qualifying renewals and approved changes of employer or job function. Its guidance also identifies specific exemptions, including certain people already entitled to live in Lithuania."
      },
      {
        "type": "paragraph",
        "text": "For an employer, the first useful check is the candidate’s current status and the legal basis of the proposed application. A first application from abroad and a qualifying renewal should not be treated as the same case."
      },
      {
        "type": "source",
        "href": "https://migracija.lrv.lt/lt/naujienos/migracijos-departamentas-paaiskina-kas-yra-uzsienieciu-kvota-ir-kaip-ji-skaiciuojama-HYn/",
        "text": "Migration Department: how the quota applies and its exceptions (Lithuanian)"
      },
      {
        "type": "heading",
        "text": "After the quota: check the salary and exact occupation"
      },
      {
        "type": "paragraph",
        "text": "For the ordinary employment route covered by its notice, the Migration Department states a post-quota requirement of at least 1.2 times the last published annual average monthly gross earnings (BDU). The threshold is 1 BDU where the occupation is on the specified high-value-added shortage list."
      },
      {
        "type": "list",
        "items": [
          "The Department’s notice, updated on 14 September 2026, gives 1.2 BDU as €2,893.68 gross per month and 1 BDU as €2,411.40. These are the figures in that dated notice; confirm the applicable benchmark before making an offer.",
          "The required salary commitment must be reflected in the employer’s mediation letter and maintained for the permit’s validity.",
          "Match the actual occupation to the official list. A general shortage of drivers, construction workers or other staff does not by itself establish eligibility for the lower threshold."
        ]
      },
      {
        "type": "source",
        "href": "https://migracija.lrv.lt/lt/naujienos/keiciasi-tarpininkavimo-rastu-ir-prasymu-kuriems-taikoma-uzsienieciu-idarbinimo-kvota-teikimo-proceduros-r7j/",
        "text": "Migration Department: post-quota salary conditions and mediation letters (Lithuanian; includes the official occupation-list link)"
      },
      {
        "type": "heading",
        "text": "From 1 November: lawful presence alone is not enough"
      },
      {
        "type": "paragraph",
        "text": "For the ordinary work-based application covered by the November change, a person lawfully in Lithuania can apply at the Migration Department if they have one of the following:"
      },
      {
        "type": "list",
        "items": [
          "A valid Lithuanian temporary residence permit.",
          "A Lithuanian national visa.",
          "A residence permit issued by another Schengen or EU member state.",
          "The right to be in Lithuania under a visa-free regime."
        ]
      },
      {
        "type": "paragraph",
        "text": "A Schengen visa issued by Lithuania or another Schengen state, or another country’s national visa, no longer qualifies on its own for this in-country filing route. The notice directs those cases to VFS Global abroad. Highly qualified employment and qualifying renewals have their own treatment; check the route before booking an appointment."
      },
      {
        "type": "source",
        "href": "https://migracija.lrv.lt/lt/naujienos/keiciasi-prasymu-isduoti-leidima-laikinai-gyventi-darbo-ir-studiju-pagrindais-priemimo-tvarka-QJL/",
        "text": "Migration Department: November filing rules and status-by-status comparison (Lithuanian)"
      },
      {
        "type": "heading",
        "text": "Other routes have their own conditions"
      },
      {
        "type": "paragraph",
        "text": "There is no universal replacement permit when the ordinary route does not fit. Seasonal work, highly qualified employment and other grounds must match the real job and the person’s circumstances."
      },
      {
        "type": "table",
        "columns": [
          "Situation",
          "What to establish"
        ],
        "rows": [
          [
            "Ordinary employment after quota exhaustion",
            "The applicable salary commitment, exact occupation and candidate’s filing route."
          ],
          [
            "Genuine seasonal work",
            "A job on the seasonal-work list, the employer’s seasonal work-permit application and the required visa or stay permission."
          ],
          [
            "Highly qualified employment / EU Blue Card",
            "The separate qualification, salary and residence-permit conditions for highly qualified work."
          ]
        ]
      },
      {
        "type": "paragraph",
        "text": "For Lithuania’s seasonal work-permit route, the Employment Service specifies a maximum of six months within twelve months, either continuously or in shorter periods. The employer applies for the work permit. It is not a route for relabelling an ordinary year-round vacancy."
      },
      {
        "type": "source",
        "href": "https://uzt.lt/lt/darbo-ieskantiems/esu-uzsienietis-ir-noriu-dirbti-lietuvoje",
        "text": "Employment Service: seasonal work, employer applications and the six-month limit (Lithuanian)"
      },
      {
        "type": "paragraph",
        "text": "The EU Blue Card is a separate residence-permit route for highly qualified employment. It is not an extra permit that every employer or candidate can choose instead of the ordinary employment route."
      },
      {
        "type": "source",
        "href": "https://home-affairs.ec.europa.eu/policies/migration-and-asylum/eu-immigration-portal/highly-qualified-worker-lithuania_en",
        "text": "European Commission: highly qualified worker route in Lithuania"
      },
      {
        "type": "heading",
        "text": "What to settle before planning the start"
      },
      {
        "type": "list",
        "items": [
          "The real duties, work location, employment terms and proposed gross salary.",
          "The candidate’s nationality, current residence status and the proposed application basis.",
          "The applicable occupation code and any qualification or licensing requirements.",
          "Where the candidate can file, which documents are needed and who prepares each step.",
          "The authority’s current procedure, appointment availability and the permissions needed before work begins."
        ]
      },
      {
        "type": "paragraph",
        "text": "Application processing is one part of the hiring timeline. Document preparation, appointments and any qualification steps also need to fit. Use the authority’s current timings for the actual route; do not turn a processing estimate into a promised arrival date."
      },
      {
        "type": "heading",
        "text": "Questions employers ask"
      },
      {
        "type": "faq",
        "items": [
          {
            "q": "Does a full quota stop all non-EU recruitment?",
            "a": "No. First establish whether the proposed application is subject to the quota. Post-quota salary conditions, qualifying renewals and specific exemptions need to be considered separately."
          },
          {
            "q": "Does a shortage occupation automatically qualify for the lower salary threshold?",
            "a": "No. The relevant test is whether the exact occupation is on the specified high-value-added shortage list. General recruitment difficulty is not the same test."
          },
          {
            "q": "Can anyone legally in Lithuania apply there after 1 November?",
            "a": "No. For the ordinary work-based route covered by the change, the applicant’s specific residence or visa-free status matters. A Schengen visa alone no longer qualifies for that in-country filing route."
          },
          {
            "q": "Can seasonal work last nine months in Lithuania?",
            "a": "Not under the seasonal work-permit rule described here. The Employment Service specifies up to six months within a twelve-month period."
          },
          {
            "q": "Can you confirm a start date from the salary figure alone?",
            "a": "No. The application basis, documents, filing arrangements and required approvals still need to be established for the individual hire."
          }
        ]
      },
      {
        "type": "paragraph",
        "text": "Planning a hire in Lithuania? Tell us the role, location, proposed salary and target timing. We can discuss the recruitment and preparation work your team needs, then set out the scope and responsibilities in a proposal. Leave candidate documents out of the first enquiry."
      },
      {
        "type": "link",
        "href": "/employers#employer-enquiry",
        "text": "Discuss a hire in Lithuania →"
      }
    ],
    "interpretation": "For employers, the useful question is which route fits the actual job and candidate. Establish that before committing to recruitment costs or a start date.",
    "boundary": "Official guidance checked 9 November 2026. Dated salary figures are attributed to the Migration Department notice, not presented as a permanent rate. Authorities decide individual applications; current rules must be checked for the proposed hire.",
    "whatThisIsNot": [
      "Individual legal or immigration advice",
      "Confirmation of a particular candidate’s eligibility",
      "A guarantee of permission or a start date"
    ]
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
