"use client";

import React, { useMemo, useRef } from "react";

type SafeLinkProps = React.PropsWithChildren<{
  href: string;
  className?: string;
  target?: string;
  rel?: string;
}>;
const SafeLink = ({ href, className, target, rel, children }: SafeLinkProps) => (
  <a href={href} className={className} target={target} rel={rel}>
    {children}
  </a>
);

import {
  ArrowRight,
  CheckCircle2,
  Truck,
  Hammer,
  Home,
  Briefcase,
  FileText,
  MapPin,
  MessagesSquare,
  HardHat,
  Zap,
  ChefHat,
  Bus,
  ConciergeBell,
  Package,
  Sprout,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import IntakeForm, { REASONS, STAGES } from "@/components/IntakeForm";

const services = [
  {
    slug: "job-search-support",
    title: "Job Search Support",
    blurb:
      "CV, application and employer-introduction support — putting your experience in front of employers who are hiring.",
    icon: Briefcase,
  },
  {
    slug: "visa-immigration",
    title: "Visa & Immigration Guidance",
    blurb:
      "Permits, forms and appointments, explained and tracked with honest timelines.",
    icon: FileText,
  },
  {
    slug: "housing-bureaucracy",
    title: "Housing & Bureaucracy",
    blurb:
      "Rental contracts, tax numbers, utility setup. The fine print explained and the paperwork chased.",
    icon: Home,
  },
  {
    slug: "local-orientation",
    title: "Local Orientation",
    blurb:
      "Practical orientation: customs, etiquette and how everyday things really work.",
    icon: MapPin,
  },
  {
    slug: "personalized-consultations",
    title: "Personalized Consultations",
    blurb:
      "Not sure where to start? Tell us your situation. We’ll outline the realistic options with no jargon and no pressure.",
    icon: MessagesSquare,
  },
] as const;

const jobs = [
  {
    slug: "welders",
    title: "Welders",
    blurb: "Fabrication, construction and industrial maintenance roles.",
    icon: HardHat,
  },
  {
    slug: "electricians",
    title: "Electricians",
    blurb: "Installation, maintenance and industrial electrical work.",
    icon: Zap,
  },
  {
    slug: "truck-drivers",
    title: "Truck Drivers",
    blurb: "Long-haul, logistics and distribution driving.",
    icon: Truck,
  },
  {
    slug: "cooks-chefs",
    title: "Cooks & Chefs",
    blurb: "Restaurant, hotel and catering kitchens.",
    icon: ChefHat,
  },
  {
    slug: "skilled-trades",
    title: "Skilled Trades",
    blurb: "Carpentry, plumbing and general building trades.",
    icon: Hammer,
  },
  {
    slug: "bus-drivers",
    title: "Bus Drivers",
    blurb: "City, coach and passenger transport driving.",
    icon: Bus,
  },
  {
    slug: "hotel-restaurant-staff",
    title: "Hotel & Restaurant Staff",
    blurb: "Front desk, service and kitchen support roles.",
    icon: ConciergeBell,
  },
  {
    slug: "warehouse-workers",
    title: "Warehouse Workers",
    blurb: "Picking, packing, loading and inventory roles.",
    icon: Package,
  },
  {
    slug: "seasonal-farm-workers",
    title: "Seasonal Farm Workers",
    blurb: "Greenhouse, harvest and food-production work.",
    icon: Sprout,
  },
] as const;

const faqs = [
  {
    q: "Do I pay anything to Sufoniq?",
    a: "No. No fees charged to you — employers and partners pay us. Visa, translation and exam fees are set by authorities and third parties, not by us.",
  },
  {
    q: "Are there open jobs listed on this page?",
    a: "No — this isn't a job board. Sufoniq gets clients and matches them with the right open jobs and employers. Tell us your trade and country and we'll tell you approximately what you can apply for right now.",
  },
  {
    q: "What do employers typically require?",
    a: "It varies by trade and country: recognized qualifications (commonly EN ISO 9606-1 for welders), local language at about A2–B1, and a valid passport with the right visa or work permit. Job shortages do not guarantee employment or visa approval.",
  },
  {
    q: "How long until someone replies?",
    a: "Within two business days — a personal reply with an honest assessment of your options and next steps.",
  },
  {
    q: "What happens to my details?",
    a: "They are used only to respond to you. Nothing goes to any employer or partner before you say yes.",
  },
  {
    q: "Do you work with partners?",
    a: "Not yet — the plan is to perfect the website first, then go for partners. Where a country's process requires local licensing or a partner, we confirm that before we engage.",
  },
] as const;

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

// --- lightweight runtime checks ("test cases") ---
const TOP_CTA = [
  { label: "Talk to us" },
] as const;

const BOTTOM_CTAS = [
  { label: "WhatsApp us", href: "https://wa.me/420778604430?text=Hi%20Sufoniq%2C%20I%27d%20like%20to%20talk." },
] as const;

function devSelfTests() {
  if (process.env.NODE_ENV !== "production") {
    console.assert(Array.isArray(services) && services.length === 5, "services list should have exactly 5 entries after the rev-10 trim");
    console.assert(services.some((s) => s.slug === "job-search-support") && !services.some((s) => s.slug === "family-relocation"), "only job-seeker-relevant services remain");
    console.assert(typeof SafeLink === "function", "SafeLink component should exist");
    console.assert(TOP_CTA.length === 1, "Top CTA must contain exactly one action");
    console.assert(BOTTOM_CTAS.length === 1, "Bottom CTA must be WhatsApp only (form is always open)");
    console.assert(faqs.length === 6, "FAQ should have 6 entries");
    console.assert(BOTTOM_CTAS.some((cta) => cta.href?.startsWith("https://wa.me/420778604430")), "WhatsApp CTA must use wa.me with the provided number");
    console.assert(REASONS.includes("Find work"), "Form reasons must include Find work");
    console.assert(STAGES.length >= 3, "Form stages should provide multiple choices");
  console.assert(jobs.length === 9, "high-demand jobs list should have 9 entries");
  }
}

devSelfTests();

export default function CoreServicesPage() {
  const bottomFormRef = useRef<HTMLDivElement | null>(null);

  const scrollIntoView = (ref: React.MutableRefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const whatsappHref = useMemo(
    () => "https://wa.me/420778604430?text=Hi%20Sufoniq%2C%20I%27d%20like%20to%20talk.",
    []
  );

  return (
    <div className="min-h-screen w-full bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
            Looking for work <span className="text-primary">in Europe?</span>
          </h1>
          <p className="mt-4 max-w-3xl text-muted-foreground text-lg">
            Whether you’re applying from abroad or already living in Europe,
            Sufoniq helps with the practical steps: job search, visas, permits,
            housing and settling in, with requirements and timelines stated
            honestly.
          </p>
          <p className="mt-3 flex max-w-3xl items-center gap-2 text-sm font-medium text-foreground">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
            No fees charged to you — employers and partners pay us.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button
              size="lg"
              className="rounded-2xl transition-transform hover:translate-x-0.5"
              onClick={() => scrollIntoView(bottomFormRef)}
            >
              Talk to us <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            Hiring across borders?{" "}
            <SafeLink href="/employers" className="font-semibold text-primary underline underline-offset-4">
              See employer services →
            </SafeLink>
          </p>

        </div>
      </section>

      {/* Straight talk */}
      <section className="border-y border-border bg-muted/40">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="text-2xl font-semibold tracking-tight">Straight talk</h2>
          <div className="mt-8 max-w-3xl space-y-4 text-muted-foreground">
            <p>
              You’ve seen the other version of this: ads that ask for money before
              you’ve seen a contract, “guaranteed visas”, agents who go quiet the
              day after they’re paid. If you’ve paid someone before and got nothing
              back, you weren’t naive — in an industry where the candidate pays,
              the money arrives at signup, not at placement.
            </p>
            <p>
              The fear underneath is specific: the dates that don’t line up, the
              requirement you didn’t know about until you’d already quit, sold or
              flown, the refusal nobody explains.
            </p>
            <p>
              Here’s how we work instead. Employers and partners pay us; job
              seekers don’t. Visa, translation and exam fees are set by
              authorities and third parties, not by us.
            </p>
            <p>
              Scope and responsibilities are agreed in writing before substantive
              work begins. If your profile doesn’t fit a requirement, we say so
              before you spend anything on it.
            </p>
            <p>
              We’re a registered Lithuanian company (UAB
              Skillaxis, company code{" "}
              <SafeLink
                href="https://www.registrucentras.lt/jar/p_en/index.php?kod=307395574&p=1"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary underline underline-offset-4"
              >
                307395574
              </SafeLink>
              ), headquartered in Vilnius, operating from Vienna, with
              recruitment and operations in the Czech Republic, working across
              Europe through partners where required, with local licensing
              confirmed before we engage.
            </p>
            <p className="font-medium text-foreground">
              The dream is yours: the job, the visa, the first payslip that lands.
              Ours is the paperwork, the checks and the honest answers between here
              and there.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-2xl font-semibold tracking-tight">How it works</h2>
        <p className="mt-2 text-muted-foreground">Three steps, no jargon.</p>
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-base">1. Tell us your situation</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Use the form or WhatsApp: your background, the role or country
              you’re aiming at.
            </CardContent>
          </Card>
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-base">2. We lay out the realistic options</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Language, documents, experience and permits — what applies to your
              job, before anything starts.
            </CardContent>
          </Card>
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-base">3. You decide</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              If it fits both sides, nothing starts until it’s in writing.
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How long does it take? */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-2xl font-semibold tracking-tight">How long does it take?</h2>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          The reply time is fixed: within two business days, a personal reply
          with an honest assessment of your options and next steps. After that,
          three honest stages:
        </p>
        <p className="mt-4 max-w-3xl text-muted-foreground">
          First we map what applies to your job — language, documents,
          experience and permits — with the exact requirements confirmed before
          anything starts. You decide: nothing starts until the scope is agreed
          in writing. Then the paperwork moves — documents, contract and permits
          checked against the actual job before you sign.
        </p>
        <p className="mt-4 max-w-3xl text-muted-foreground">
          How long each stage takes depends on the country, the employer and the
          permit type, and checks like language and credential recognition.
          Eligibility depends on your experience, qualifications, destination
          country, employer requirements and immigration rules.
        </p>
        <p className="mt-4 max-w-3xl text-sm text-muted-foreground">
          One honest limit: permit decisions rest with the relevant authorities.
          What we control, we time honestly; what we don’t, we say so plainly.
        </p>
      </section>

      {/* High-Demand Jobs */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-2xl font-semibold tracking-tight">High-Demand Jobs Across Europe</h2>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          This isn’t a job board: Sufoniq gets clients and matches them with the
          right open jobs and employers. Tell us your trade and country and
          we’ll tell you approximately what you can apply for right now.
        </p>
        <p className="mt-4 max-w-3xl text-muted-foreground">
          We focus on occupations where employers face recruitment challenges:
          skilled trades, professional driving, hospitality and industrial work.
          We map the requirements, documentation and realistic pathways before
          you commit.
        </p>
        <p className="mt-4 max-w-3xl text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Where we work right now:</span>{" "}
          Lithuania, Czech Republic, Germany, Poland, Austria, the Netherlands
          and Romania.
        </p>
        <p className="mt-4 max-w-3xl text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Healthcare:</span>{" "}
          registered nurses, nursing assistants, elderly care workers and
          healthcare support staff. We move only where language requirements,
          credential recognition and permits are confirmed first.{" "}
          <span className="font-medium text-foreground">Manufacturing:</span>{" "}
          CNC operators, machinists, industrial maintenance technicians,
          production and assembly staff. Machine skills, contract and permits
          are checked against the actual job before you sign.
        </p>
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          {jobs.map((j) => (
            <Card key={j.slug} className="rounded-2xl">
              <CardHeader className="flex flex-row items-center gap-2">
                <j.icon className="h-5 w-5 text-primary" />
                <CardTitle className="text-base">{j.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                {j.blurb}
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-8 max-w-3xl rounded-2xl border border-border bg-muted/40 p-5">
          <h3 className="text-lg font-semibold tracking-tight">What employers typically require</h3>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
            <li>
              <span className="font-medium text-foreground">Welders:</span> a
              completed welding apprenticeship or certificate (commonly EN ISO
              9606-1), plus the local language at about A2–B1.
            </li>
            <li>
              <span className="font-medium text-foreground">Truck drivers:</span>{" "}
              the correct heavy-vehicle licence plus the EU CPC (“Code 95”)
              qualification, plus the local language at about A2–B1.
            </li>
            <li>
              <span className="font-medium text-foreground">Cooks & chefs:</span>{" "}
              a culinary diploma or apprenticeship — or proven kitchen
              experience — plus the local language at about A2–B1.
            </li>
            <li>
              <span className="font-medium text-foreground">Every trade:</span> a
              valid passport, the right visa or work permit, and an employer
              declaration. Exact requirements vary by country and employer — we
              confirm them with you before anything starts.
            </li>
          </ul>
        </div>
        <p className="mt-6 max-w-3xl text-sm text-muted-foreground">
          Not every role is available in every country.{" "}
          <strong className="font-semibold text-foreground">
            Job shortages do not guarantee employment or visa approval.
          </strong>{" "}
          Eligibility depends on your experience, qualifications, destination
          country, employer requirements and immigration rules.
        </p>
        <div className="mt-6">
          <Button
            className="rounded-2xl"
            onClick={() => scrollIntoView(bottomFormRef)}
          >
            Talk to us about your options <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* What we help with */}
      <section id="services" className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-2xl font-semibold tracking-tight">What we help with</h2>
        <div className="mt-8 grid grid-cols-1 gap-x-10 gap-y-6 md:grid-cols-2">
          {services.map((s) => (
            <div
              key={s.slug}
              id={s.slug}
              className="flex scroll-mt-24 items-start gap-3"
            >
              <s.icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <div>
                <p className="font-semibold">{s.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{s.blurb}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Compliance & Ethics */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-2xl font-semibold tracking-tight">Compliance & Ethics</h2>
        <div className="mt-8 max-w-3xl space-y-4 text-sm leading-relaxed">
          <p>
            Sufoniq supports the recruitment and mobility side of cross-border
            hiring: sourcing, screening and practical coordination. Every
            project’s scope and responsibilities are defined up front, for
            employers, candidates and relevant partners.
          </p>
          <ul className="grid gap-2 md:grid-cols-2">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> No
              fees charged to job‑seekers. Employers and partners foot the bill.
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              Europe‑wide operations through partners where required, with
              local licensing and requirements confirmed before engagement.
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> Respect
              for local labour law, collective agreements, and equal‑treatment
              rules.
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              Transparent contracts for candidates and employers.
            </li>
          </ul>
          <p className="text-xs text-muted-foreground">
            The service scope, delivery responsibilities and any country-specific
            licensing or local partner requirements are clarified before an
            engagement. Mobility support does not replace legal counsel or
            decisions by the relevant authorities.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-2xl font-semibold tracking-tight">Questions people ask</h2>
        <div className="mt-8 max-w-3xl space-y-5">
          {faqs.map((f) => (
            <div key={f.q}>
              <h3 className="font-semibold">{f.q}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.a}</p>
            </div>
          ))}
        </div>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </section>

      {/* CTA band + always-open form */}
      <section className="border-t border-border bg-muted/40">
        <div className="mx-auto max-w-6xl px-4 pt-14 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Ready when you are.</h2>
            <p className="mt-2 text-muted-foreground">
              No jargon, no pressure: tell us where you want to work and what’s
              blocking you, and we’ll outline the realistic steps.
            </p>
            <p className="mt-2 text-muted-foreground">
              You’ll get a personal reply with an honest assessment of your
              options and next steps.
            </p>
          </div>
          <div>
            <SafeLink href={whatsappHref}>
              <Button variant="outline" size="lg" className="rounded-2xl">
                WhatsApp us
              </Button>
            </SafeLink>
          </div>
        </div>

        {/* The form — always open, no toggle, no close */}
        <div ref={bottomFormRef} className="mx-auto max-w-6xl px-4 pb-14 pt-8">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-xl">Tell us what you need — we’ll map the path</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-3 text-sm text-muted-foreground">
                No documents needed. Our recruitment team replies within two
                business days. Nothing goes to any employer or partner before
                you say yes — your details are used only to respond, no spam.
              </p>
              <IntakeForm />
            </CardContent>
          </Card>
        </div>
      </section>

    </div>
  );
}
