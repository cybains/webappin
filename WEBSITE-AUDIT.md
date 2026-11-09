# Sufoniq — Full Website Buyer Audit

**Date:** 6 Nov 2026 · **Scope:** all 17 public pages, rendered text + source · **Read as:** a European employer with a hard-to-fill role, arriving cold (from a link, an email, or a Google check)
**Status: DIAGNOSIS ONLY — no changes have been made. Nothing here is applied until you approve it.**

---

## 1. The verdict — would I contact you?

**From the site alone today: no.** Not because it's bad — because it never gives me a *reason* to choose you over the agency I already know.

What the site earns today:

| Trust question a buyer asks | Score | Why |
|---|---|---|
| "Is this a real company?" | **8/10** | Registered entity, address, email, WhatsApp, legal pages, honest method |
| "Do they know what they're doing?" | **7/10** | Method & Trust, data sourcing, process transparency — genuinely above average |
| "Have they done this before?" | **1/10** | Zero proof: no clients, no numbers, no cases, no people |
| "What does it cost / how do we engage?" | **0/10** | Never stated anywhere |
| "Who am I actually talking to?" | **2/10** | No name, no face, no LinkedIn anywhere on the site |
| "Is this one coherent company?" | **4/10** | Four different product identities (see §2) |

The site is very good at saying what you **won't** promise. It has never once said what you **have done**. Trust needs both.

**What tips the verdict to yes:** four things — one real proof fact, one sentence of commercial model, one human identity, one unified voice. Everything else below is refinement.

---

## 2. Root diagnosis: four companies in one website

This is the single biggest structural problem. A buyer cannot form one mental model of who you are:

| # | Identity presented | Pages | Sample voice |
|---|---|---|---|
| **A** | Serious B2B cross-border recruitment agency | `/`, `/hiring-in-practice`, `/employers`, `/ghana-tde` | "Bring us one role. Scope agreed before work begins." |
| **B** | Consumer relocation concierge | `/core-services` | "Editorial therapy for your professional life" · "tantrums optional, patience included" · "digital nomad dreams made livable" |
| **C** | AI / decision-intelligence platform with governance | `/method-trust`, parts of `/privacy-policy`, `/terms-conditions` | "heuristics", "outputs", "audit how conclusions were reached", "Safety posture", "Subscriptions renew automatically" |
| **D** | Jokey editorial magazine | `/insights/growth` article | "Some regions sprint. Others tie their shoes for twenty years… profitably." |

**The first click decides:** nav label **"Services" → `/core-services`** (identity B). An employer clicks "Services" expecting your recruitment offer and lands on consumer relocation humour. That's the identity wound — every other issue is downstream of it.

Identities A + parts of D are excellent and consistent. The audit's central recommendation is: **make A the spine, label B honestly as job-seeker content, rewrite C in recruitment voice (keep the substance), neutralise D's punchlines.**

---

## 3. Page-by-page audit

### 3.1 Homepage — `src/app/page.tsx` · **A · strongest page**
**Works:** hero says exactly what you do in one line; intent router splits employers/job-seekers; 3-pillar "what we actually do"; "chain behind a hire" is a proper inline toggle (not a dead link); 5-step planning accordion; Method & Trust 4 pillars; evidence example line (India→Germany 47,904); "Bring us one role" low-friction CTA; contact form with visible email, WhatsApp, registered address; "what happens after you enquire"; map data collapsed behind `<details>` (correct — opt-in, not a wall of data).

**Issues:**
| Sev | Issue | Where |
|---|---|---|
| P1 | **Back-to-back duplicated reassurance:** "You retain the hiring decision. If the route does not hold up…" appears at the end of planning (step 05) *and again* in Method & Trust pillars within one scroll — wording nearly identical | `HowItWorks.tsx:330` → `page.tsx:254` |
| P1 | **No proof block** anywhere between "Who you are dealing with" and the CTA (see §5) | page structure |
| P1 | **No commercial model signal** — one honest sentence would remove the "unknown-cost call" objection | needs your facts |
| P2 | Two labels for one action: buttons say "Discuss a role", form submit says "Send enquiry" | `Contact.tsx` |
| P2 | Job-seeker link ("See job-seeker support") → `/core-services#job-search-support` — lands in identity B | `Hero.tsx:30` |

### 3.2 Services → `/core-services` — **B · the identity wound**
**Works:** real service coverage; the bottom "Compliance & Ethics" section is properly on-brand ("No fees charged to job-seekers. Employers and partners foot the bill."); title tag promises "Recruitment & Mobility Services".

**Issues:**
| Sev | Issue | Where |
|---|---|---|
| P1 | Nav label **"Services"** sends employers into consumer content | `navbar.tsx:11` |
| P1 | Consumer voice throughout: "From paperwork to paychecks… Europe's work, visa, and relocation maze" · "Editorial therapy…" · "tantrums optional" · "We handle the letters so you can handle the miles" · "Book a sensible chat" | `core-services/page.tsx` |
| P1 | CTA labels off-system: "Book a consultation" / "Talk to a human" vs site-wide "Discuss a role" | `page.tsx:133, 386` |
| P2 | "Europe-wide support via **verified** partners" + 8-country list — "verified" is a claim; your own compliance section says "partners **where required**" — the two statements disagree | same page |
| — | Title/body mismatch: tagline says B2B recruitment, body is B2C relocation | — |

**Fix directions (choose one in §7):** (i) keep as job-seeker hub but *rename nav* to "For job seekers" and rewrite hero to say so; (ii) rewrite to employer voice; (iii) split into two pages. **Recommendation: (i)** — it's already the job-seeker destination for hero + router links.

### 3.3 Hiring in Practice — `/hiring-in-practice` — **A · best sales page after home**
**Works:** "Three decisions before you commit" structure; per-decision pattern (situation → what we assess → how Sufoniq helps → what you receive → takeaway); honest takeaways; per-section CTAs ("Discuss a hard-to-fill role →"); links to the Ghana route and EU recognition guidance; scope disclaimers consistent.

**Issues:** minor — dense paragraphs (could use a scan layer of bullets, but content is right); nothing misleading. **This is the page to send employers to in outreach** (not the homepage, not a "book a call" link).

### 3.4 Employers — `/employers` — **A with product fiction**
**Works:** genuine diagnosis content (false availability, late eligibility checks, documentation drift, handoff gaps); auditable pipeline model; explicit speed-vs-risk trade-off; clean "Sufoniq is / is not" boundary list; intake form asks for minimal, non-sensitive data.

**Issues:**
| Sev | Issue | Where |
|---|---|---|
| **P0** | **"What happens next" shows three different steps with the *same* sentence** — "Clear expectations and boundaries before anything operational." ×3. Reads as unfinished template | `employers/page.tsx:723-727` |
| **P0** | Internal product note visible to buyers: **"Note: Individual job-seeker content is intentionally separated."** | `page.tsx:338` |
| P1 | **"Request access" ×4 + "exploring the employer view"** implies a gated portal that doesn't exist. A buyer clicks expecting a login and gets a contact form — a small trust betrayal | `page.tsx:249, 333, 614, 622` |
| P1 | Product-speak: "Sufoniq serves individuals and employers through **separate surfaces**" | `page.tsx:630` |
| P1 | The page sets its own standard and misses it: *"Employers are… a different customer with… a different standard of proof"* — then provides zero proof | page copy |
| P2 | Meta-labels leaking design rationale ("This page is employer capability and engagement") | end of page |

### 3.5 Method & Trust — `/method-trust` — **C · right substance, wrong voice**
**Works:** substance is genuinely strong — refusal lines, no-guarantees, human review triggers, data minimisation, appeal path. This is the honest core of the brand.

**Issues:**
| Sev | Issue | Where |
|---|---|---|
| P1 | Reads like an **AI-policy/regulatory document**, not a recruitment trust page: "mobility and labour-market intelligence platform" · "scaffold all Sufoniq outputs" · "heuristics" · "Safety & misuse prevention" · "Change log" · "Auditability" · "Explainability" | `method-trust/page.tsx` (whole page + TOC) |
| P1 | Homepage's Method & Trust preview (4 warm pillars) sets an expectation the destination page doesn't match — buyer clicks through and lands in a different company | `page.tsx:216-260` vs page |
| P2 | Internal taxonomy visible: "Quiet cross-link… This page is governance" | page end |

**Fix direction:** keep every constraint/refusal, rewrite framing in recruitment language (what we check, when; what we refuse; what happens if something goes wrong; how data is handled). Demote "heuristics/outputs/audit" to plain words. This page should *sound like the homepage*.

### 3.6 About — `/about` — **A/B mix · one P0**
**Works:** legal-facts block (entity, jurisdiction, Vienna, scope); honest operating rules; audience split.

**Issues:**
| Sev | Issue | Where |
|---|---|---|
| **P0** | **Leftover editor placeholder in production:** "If you need a specific legal or compliance statement, place it here." | `about/page.tsx:193` |
| P1 | **No humans.** No founder name, no role, no photo, no LinkedIn — the "who am I emailing" question stays unanswered site-wide | page |
| P2 | No closing CTA — page ends and drops into the footer | page |
| P2 | Voice: "rover on Mars… not a dog — don't get excited" · "well-organized playlist" — charming but a fourth tone; acceptable if lightened to match home | page |

### 3.7 Insights — `/insights` + articles — **D · calm promise, jokey delivery**
**Works:** landing voice is right ("Calm analysis, grounded in signals. No advice. No promises."); operating-notes block; seven genuinely good titles ("A candidate pool is not a hiring pipeline", "Everything can be correct — and still not move"); sources visible; featured card fixed (title link + "Read the dissertation", no more nested-anchor error).

**Issues:**
| Sev | Issue | Where |
|---|---|---|
| P1 | **The featured article contradicts the landing promise.** Landing: "no marketing gloss, no service pitch." Article: "Some regions sprint. Others tie their shoes for twenty years. We chart divergence so you can make convergence happen — **profitably**." · "Growth needs brains. (And decent Wi-Fi)" · "**Math says hi.**" · "We **make** it ethical, legal, and pleasantly uneventful." — that last one is a claim/promise inside content that claims to make none; chapters also self-pitch ("build hiring that supports it", "We aim hiring where the balance is feasible") | `BetterGrowthHomepage.tsx:564-565` + chapter copy |
| P2 | No author/date person on articles; no path from insight → conversation (no CTA anywhere in content) | — |
| P2 | Featured piece is macro-economics — fine as thought leadership, but zero recruitment relevance; consider a recruitment-featured piece once you have a real case | — |

### 3.8 Ghana–Lithuania — `/ghana-tde` — **A · the strongest offer page, invisible**
**Works:** this is the only page that behaves like a *productised offer*: three audiences (drivers / agencies / employers), a **who-pays-what table** (the exact transparency a buyer wants), 5-step process, written cost allocation, anti-fraud checklist ("A process you can check before you commit"), employer CTA "Discuss your driver requirement", audience-select form, real external links (Regitra, migration services), disclaimers everywhere. **If every page worked like this, the verdict in §1 would flip.**

**Issues:**
| Sev | Issue | Where |
|---|---|---|
| P1 | **Linked from exactly one place** (one line inside `/hiring-in-practice`), absent from nav and homepage. Sitemap includes it, so it's indexable but orphaned for humans | `HiringInPracticeContent.tsx:119` |
| P2 | Own CTA dialect: "Send my request" vs site "Discuss a role"/"Send enquiry" | form |
| — | **Strategic question (§7):** is Ghana your actual campaign corridor? If yes, this page's isolation is wrong. If it's an experiment, that's fine. | — |

### 3.9 Contact (homepage section) — **A**
**Works:** minimal fields, "Name (optional)", visible `support@sufoniq.com`, WhatsApp (unified to +420 778 604 430 in the last batch), registered address line, "what happens after you enquire" — genuinely good.
**Issues:** P2 — no phone number (WhatsApp only); label mismatch noted in §3.1.

### 3.10 Privacy Policy — **C · dev-speak in a legal document**
**Works:** real controller details (UAB Skillaxis, company code 307395574, DPO email, processor/client clause, CPRA/GDPR structure).

**Issues:**
| Sev | Issue | Where |
|---|---|---|
| **P0** | **Developer instructions in production legal text:** "Unsure whether your current **build** sets any cookies? **Open DevTools → Application/Storage → Cookies.**" (also "your current build" in the Security section) | `privacy-policy/page.tsx:272`, also ~:59 |
| P1 | Marketing voice + unverifiable claims in a policy: title "Modern Data Practices for Global Talent" · "tech-forward platform" · "leverage data" · "**AI-powered workflows**" — if there are no AI workflows, don't claim them; if there are, that contradicts identity A | page head |
| P2 | "Last updated: October 2, 2025" — predates the current site (fine if true; verify) | page head |

### 3.11 Terms & Conditions — **C · describes a SaaS that doesn't exist**
**Works:** real entity details, B2C/B2B labelling, sanctions clause, liability structure.

**Issues:**
| Sev | Issue | Where |
|---|---|---|
| **P0** | **Fictional product mechanics:** "By **creating an account** or using our site…" — there are no accounts. "**Pricing, plan limits, and included features are shown at checkout** or in your account. **Subscriptions renew automatically**… cancel in your account anytime." — there is no checkout, no pricing, no subscription. "immediate **platform/AI access**" withdrawal clause | `terms-conditions/page.tsx:3` , `:129` , ~:27 |
| P1 | A B2B buyer who reads Terms sees a company describing a product it doesn't have — at best confusing, at worst a credibility/legal mismatch | — |
| P2 | Still no DPA (§Terms references data processing; DPA page was unlinked earlier as a known gap) | — |

### 3.12 Footer + nav (sitewide)
**Works:** "Data & Sources" column, tagline ("Cross-border recruitment and mobility, scoped before work begins."), copyright identity, visible email, sr-only AMUI credit — all fixed in previous batches.

**Issues:**
| Sev | Issue | Where |
|---|---|---|
| P1 | **Follow Us → Facebook (raw `profile.php?id=…` URL) + TikTok.** For a B2B recruitment buyer, the absence of **LinkedIn** is the signal; TikTok actively signals consumer | `Footer.tsx:50, 59` |
| P2 | Facebook URL is the ugly form (works, but untidy) | `Footer.tsx:50` |
| P2 | Nav has no route to the Ghana campaign page (see §3.8) | `navbar.tsx:10-17` |

---

## 4. Cross-cutting issue register

| ID | Issue | Sev |
|---|---|---|
| C1 | Four product identities (A/B/C/D) — no single company in a buyer's head | P1 |
| C2 | **Proof void:** zero clients, numbers, cases, testimonials, logos — while `/employers` explicitly invokes "a different proof standard" | P0 (needs your facts) |
| C3 | **Commercial silence:** no engagement/fee model stated anywhere | P0 (needs your facts) |
| C4 | **People void:** no name/face/LinkedIn anywhere; About has no humans | P0 (needs your facts) |
| C5 | Product fiction: "Request access", "employer view", "separate surfaces", accounts/checkout/subscriptions | P0–P1 |
| C6 | Visible internals: About placeholder, employers "intentionally separated", privacy DevTools, "This page is governance" labels | P0 |
| C7 | Repetition: reassurance duplicated on homepage (adjacent sections); "what happens next" ×3 identical | P0–P1 |
| C8 | CTA dialects: "Discuss a role" / "Send enquiry" / "Send my request" / "Book a consultation" / "Talk to a human" / "Request access" — six labels for roughly two intents | P1 |
| C9 | Wrong social proof channels (Facebook/TikTok, no LinkedIn) | P1 |
| C10 | Unbacked claims to soften: "verified partners", "profitably", "We make it ethical, legal", "AI-powered workflows" | P1 |
| C11 | Insights content → no path to contact; About → no CTA | P2 |

---

## 5. The trust math (why the verdict is "no")

You are asking an employer to pick an unknown entity over local agencies with logos, names, and price lists. Today the site answers three of their six questions and is silent or fictional on the other three:

```
proof:   0    people: 0    price: 0    voice: 4 identities    honesty: genuine (your biggest asset)
```

Honesty without evidence reads as *inexperience*. Evidence without honesty reads as *slick*. You already have the second half — the fixes below only supply the first.

---

## 6. Proposed fix plan — NOTHING IS APPLIED YET

### P0 — must be fixed before any outreach (hours, no facts needed)
1. **About `:193`** — delete the placeholder sentence.
2. **Privacy `:272` (+ Security section)** — remove DevTools/build instructions; retitle in plain language.
3. **Terms `:3, :129, ~:27`** — remove account/checkout/subscription/platform fiction; describe the actual engagement model *(structure I can draft; wording needs §7-Q2; recommend a legal skim before publishing)*.
4. **Employers `:723-727`** — write three *different* "what happens next" descriptions; **`:338`** — delete the internal note.

### P1 — identity & conversion (needs a few decisions from you)
5. **Nav identity fix** — "Services" label vs consumer content: rename nav item (e.g. "For job seekers") + add an audience banner to `/core-services` hero *(recommended)* — or rewrite the page to employer voice.
6. **Method & Trust voice rewrite** — same substance, recruitment language; match the homepage preview.
7. **Employers honesty pass** — "Request access" → an honest label (e.g. "Discuss your pipeline" / "Start an employer enquiry"), remove "employer view" and "separate surfaces".
8. **Growth article tone pass** — neutralise punchlines and claims ("profitably", "Math says hi", "We make it ethical, legal…"); keep chapters' structure and data.
9. **Repetition cleanup** — homepage reassurance stated once; employers "what happens next" differentiated (if not done in P0-4).
10. **CTA label unification** — collapse six labels to two ("Discuss a role" primary, audience-specific secondaries allowed but consistent per page).
11. **Commercial model sentence** — one honest line, homepage + employers *(needs §7-Q2)*.
12. **Identity block on About** — name, role, one line, LinkedIn *(needs §7-Q4)*.
13. **LinkedIn in footer** (+ decide on Facebook/TikTok) *(needs §7-Q5)*.

### P2 — polish
14. About closing CTA · Insights → conversation path · Ghana route discoverability *(needs §7-Q1)* · Facebook URL tidy · DPA page (parked) · "verified partners" wording alignment.

---

## 7. Questions only you can answer (I will not invent answers)

| # | Question | Blocks |
|---|---|---|
| **Q1** | **Which corridor is the real play — Ghana (your only offer page), India (your biggest data corridor + your home advantage), or general Europe?** This decides nav, homepage emphasis, and whether `/ghana-tde` gets promoted or parked. | P2, outreach strategy |
| **Q2** | **How do you actually charge?** (e.g. "scoped, fixed-fee planning engagements; recruitment within agreed scope only" — your real terms, even rough) | P0-3, P1-11 |
| **Q3** | **Any real proof fact at all** — founded year, first routes in progress, prior career scale ("10 years placing X in Y"), sectors, languages, anything true. Even one sentence beats zero forever. | C2 |
| **Q4** | **Your name, role, and LinkedIn** (photo optional) for About + footer. | P1-12 |
| **Q5** | Facebook + TikTok: keep, remove, or replace with LinkedIn? | P1-13 |
| **Q6** | Is a real "employer portal" ever planned? (If no — all "access" language goes. If yes — it can stay with an honest "in development" note.) | P1-7 |

---

## 8. What happens after you approve

1. I apply **P0** as one batch (pure deletions/fixes — you review the diff).
2. You answer **Q1–Q6** (even partially) → I draft **P1** as a written plan with proposed copy for each item → you approve → diffs.
3. **P2** last.
4. Each batch: build + lint + link crawl verified before you commit.

*Audit basis: rendered text of all 11 top-level pages + 6 indexed articles, source cross-referenced at the cited line numbers. Previous batches (legacy redirects, footer, evidence placement, CTA/contact/identity fixes, insights nested-anchor fix, Tailwind 4.3.3, robots dedup) are committed and verified as of `29b469f`.*
