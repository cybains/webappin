"use client";

import React, { useMemo, useRef, useState } from "react";
// NOTE: We purposely avoid next/link here because some sandboxed builds lack the Next runtime.
// You can switch back to next/link later for client-side navigation.

type SafeLinkProps = React.PropsWithChildren<{ href: string; className?: string }>;
const SafeLink = ({ href, className, children }: SafeLinkProps) => (
  <a href={href} className={className}>
    {children}
  </a>
);

import {
  ArrowRight,
  CheckCircle2,
  Globe2,
  ShieldCheck,
  Landmark,
  Building2,
  Users2,
  Truck,
  Hammer,
  Home,
  Briefcase,
  FileText,
  MapPin,
  Wifi,
  MessagesSquare,
  GraduationCap,
  X,
} from "lucide-react";

// If you're using shadcn/ui in your project, these imports will work.
// If not, swap them for basic wrappers.
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";

const services = [
  {
    slug: "job-search-support",
    title: "Job Search Support",
    blurb:
      "We turn your career story into something employers actually want to read. Editorial therapy for your professional life — minus the couch.",
    icon: Briefcase,
    href: "/services/job-search",
  },
  {
    slug: "visa-immigration",
    title: "Visa & Immigration Guidance",
    blurb:
      "Permits, forms, and inexplicable delays — all gently wrestled into order by people who’ve lived to tell the tale.",
    icon: FileText,
    href: "/services/visa-immigration",
  },
  {
    slug: "work-with-startups",
    title: "Work with Startups & Firms",
    blurb:
      "We’re always open to hearing from startups and ambitious firms. Let’s chat, plot, and build something delightfully disruptive.",
    icon: Building2,
    href: "/services/for-employers",
  },
  {
    slug: "education-student-support",
    title: "Education & Student Support",
    blurb:
      "Admissions, visas, housing, and the awkward bit in between. From universities to short courses to career upskilling — we help learners at every stage.",
    icon: GraduationCap,
    href: "/services/education",
  },
  {
    slug: "family-relocation",
    title: "Family Relocation",
    blurb:
      "From schools to supermarkets, we help you and your crew land softly — tantrums optional, patience included.",
    icon: Users2,
    href: "/services/family-relocation",
  },
  {
    slug: "housing-bureaucracy",
    title: "Housing & Bureaucracy",
    blurb:
      "Rental contracts, tax numbers, utility setup — we decipher the fine print and chase the missing stamp so you don’t have to.",
    icon: Home,
    href: "/services/housing-bureaucracy",
  },
  {
    slug: "local-orientation",
    title: "Local Orientation",
    blurb:
      "Not just 'where’s the supermarket?' but decoding customs, avoiding faux pas, and navigating like a seasoned expat.",
    icon: MapPin,
    href: "/services/local-orientation",
  },
  {
    slug: "remote-work-setup",
    title: "Remote Work Setup",
    blurb:
      "Digital nomad dreams made livable — with the right visa, the right gear, and a Wi‑Fi plan that doesn’t weep under pressure.",
    icon: Wifi,
    href: "/services/remote-work",
  },
  {
    slug: "personalized-consultations",
    title: "Personalized Consultations",
    blurb:
      "Not sure where to start? Let’s sort things out over a sensible chat — no jargon, no pressure, just helpful plotting.",
    icon: MessagesSquare,
    href: "/consultations",
  },
] as const;

const countryBadges = [
  { code: "AT", name: "Austria" },
  { code: "DE", name: "Germany" },
  { code: "NL", name: "Netherlands" },
  { code: "LT", name: "Lithuania" },
  { code: "PT", name: "Portugal" },
  { code: "PL", name: "Poland" },
  { code: "ES", name: "Spain" },
  { code: "FR", name: "France" },
] as const;

// --- Contact / Intake Form component (innovative, friendly) ---
const REASONS = [
  "Find a job",
  "Hire talent",
  "Student support",
  "Upskill / Reskill",
  "Relocation help",
  "Housing",
  "Partnership / Collaboration",
  "Other",
] as const;

const STAGES = [
  "Just exploring",
  "Ready to start",
  "In progress & stuck",
  "Need a second opinion",
] as const;

interface IntakeFormValues {
  name: string;
  email: string;
  phone?: string;
  reasons: string[];
  stage?: string;
  location?: string; // optional & open text (friendlier than current/target country)
  message?: string;
}

function ToggleChip({
  label,
  selected,
  onToggle,
}: { label: string; selected: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={selected}
      className={`rounded-full border px-3 py-1 text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${selected ? "border-transparent bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm" : "border-border bg-background text-foreground hover:bg-muted"}`}
    >
      {label}
    </button>
  );
}

function IntakeForm({ onSubmitted }: { onSubmitted?: () => void }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [reasons, setReasons] = useState<string[]>([]);
  const [stage, setStage] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const toggleReason = (r: string) =>
    setReasons((prev) => (prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]));

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const form = formRef.current!;
    const data = new FormData(form);
    const values: IntakeFormValues = {
      name: String(data.get("name") || ""),
      email: String(data.get("email") || ""),
      phone: String(data.get("phone") || ""),
      reasons,
      stage,
      location: String(data.get("location") || ""),
      message: String(data.get("message") || ""),
    };

    const subject = `Core services inquiry${values.reasons.length ? ` — ${values.reasons[0]}` : ""}`;
    const composedMessage = [
      values.phone ? `Phone / WhatsApp: ${values.phone}` : undefined,
      values.reasons.length ? `Reason(s): ${values.reasons.join(", ")}` : undefined,
      values.stage ? `Current stage: ${values.stage}` : undefined,
      values.location ? `Preferred location: ${values.location}` : undefined,
      values.message ? `Notes:\n${values.message}` : undefined,
    ]
      .filter(Boolean)
      .join("\n\n");

    setSubmitting(true);
    setError(null);
    setStatus("idle");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          subject,
          message: composedMessage || "Core services inquiry",
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload?.error || `Request failed (${response.status})`);
      }

      form.reset();
      setReasons([]);
      setStage("");
      setStatus("success");
      onSubmitted?.();
    } catch (err) {
      console.error(err);
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form ref={formRef} className="grid grid-cols-1 gap-4" onSubmit={handleSubmit}>
      {status === "success" && (
        <div
          role="status"
          aria-live="polite"
          className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900"
        >
          Your message has landed safely at Mission Control! Our team will review it and get back to you within 24 hours —
          usually sooner.
        </div>
      )}
      {status === "error" && error && (
        <div
          role="alert"
          className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {error}
        </div>
      )}
      <div className="grid gap-2 md:grid-cols-2">
        <div className="grid gap-2">
          <label htmlFor="name" className="text-sm font-medium">Name</label>
          <input id="name" name="name" type="text" required className="h-10 rounded-md border bg-background px-3" />
        </div>
        <div className="grid gap-2">
          <label htmlFor="email" className="text-sm font-medium">Email</label>
          <input id="email" name="email" type="email" required className="h-10 rounded-md border bg-background px-3" />
        </div>
        <div className="grid gap-2">
          <label htmlFor="phone" className="text-sm font-medium">Phone / WhatsApp (optional)</label>
          <input id="phone" name="phone" type="tel" className="h-10 rounded-md border bg-background px-3" />
        </div>
        <div className="grid gap-2">
          <label htmlFor="location" className="text-sm font-medium">Preferred location (optional)</label>
          <input id="location" name="location" type="text" placeholder="City or country — if you have one in mind" className="h-10 rounded-md border bg-background px-3" />
        </div>
      </div>

      <div className="grid gap-2">
        <span className="text-sm font-medium">What brings you here? (pick any)</span>
        <div className="flex flex-wrap gap-2">
          {REASONS.map((r) => (
            <ToggleChip key={r} label={r} selected={reasons.includes(r)} onToggle={() => toggleReason(r)} />
          ))}
        </div>
      </div>

      <div className="grid gap-2">
        <span className="text-sm font-medium">Where are you in the process?</span>
        <div className="flex flex-wrap gap-2">
          {STAGES.map((s) => (
            <ToggleChip key={s} label={s} selected={stage === s} onToggle={() => setStage(stage === s ? "" : s)} />
          ))}
        </div>
      </div>

      <div className="grid gap-2">
        <label htmlFor="message" className="text-sm font-medium">Anything we should know?</label>
        <textarea id="message" name="message" rows={4} placeholder="Give us the short version: goals, constraints, timelines, special requests." className="rounded-md border bg-background px-3 py-2" />
      </div>

      <div className="flex flex-wrap gap-3">
        <Button type="submit" className="rounded-2xl" disabled={submitting}>
          {submitting ? "Sending..." : "Submit"}
        </Button>
      </div>
    </form>
  );
}

// --- lightweight runtime checks ("test cases") ---
const TOP_CTA = [
  { label: "Book a sensible chat" },
] as const;

const BOTTOM_CTAS = [
  { label: "Book a consultation" },
  { label: "Talk to a human", href: "https://wa.me/37064112439?text=Hi%20Sufoniq%2C%20I%27d%20like%20to%20talk." },
] as const;

function devSelfTests() {
  if (process.env.NODE_ENV !== "production") {
    console.assert(Array.isArray(services) && services.length >= 9, "services list should have 9+ entries including Education");
    console.assert(services.some((s) => s.slug === "education-student-support"), "Education & Student Support card must exist");
    console.assert(typeof SafeLink === "function", "SafeLink component should exist");
    console.assert(TOP_CTA.length === 1, "Top CTA must contain exactly one action");
    console.assert(BOTTOM_CTAS.length === 2, "Bottom CTAs must contain exactly two actions");
    console.assert(BOTTOM_CTAS[1].href?.startsWith("https://wa.me/37064112439"), "WhatsApp CTA must use wa.me with the provided number");
    console.assert(REASONS.includes("Student support"), "Form reasons must include Student support");
    console.assert(STAGES.length >= 3, "Form stages should provide multiple choices");
  }
}

devSelfTests();

export default function CoreServicesPage() {
  const [showTopForm, setShowTopForm] = useState(false);
  const [showBottomForm, setShowBottomForm] = useState(false);
  const topFormRef = useRef<HTMLDivElement | null>(null);
  const bottomFormRef = useRef<HTMLDivElement | null>(null);

  const scrollIntoView = (ref: React.MutableRefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const whatsappHref = useMemo(
    () => "https://wa.me/37064112439?text=Hi%20Sufoniq%2C%20I%27d%20like%20to%20talk.",
    []
  );

  return (
    <div className="min-h-screen w-full bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
            Our Core Services — <span className="text-primary">Your Bridge to Europe</span>
          </h1>
          <p className="mt-4 max-w-3xl text-muted-foreground text-lg">
            From paperwork to paychecks — Sufoniq helps people and companies navigate Europe’s work, visa, and relocation maze the <em>right</em> way. Smart, compliant, and calm under the kinds of queues that test everyone’s patience.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button
              size="lg"
              className="rounded-2xl transition-transform hover:translate-x-0.5"
              onClick={() => {
                setShowTopForm((v) => !v);
                setTimeout(() => scrollIntoView(topFormRef), 50);
              }}
            >
              Book a sensible chat <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {/* Inline Top Form (toggles under the CTA) */}
          <div ref={topFormRef} className="mt-8">
            {showTopForm && (
              <Card className="rounded-2xl">
                <CardHeader className="flex items-start justify-between">
                  <CardTitle className="text-xl">Tell us what you need — we’ll map the path</CardTitle>
                  <button
                    aria-label="Close form"
                    className="rounded-full p-2 hover:bg-muted"
                    onClick={() => setShowTopForm(false)}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </CardHeader>
                <CardContent>
                  <IntakeForm />
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* EU Scope / Countries */}
      <section className="border-y bg-muted/40">
        <div className="mx-auto max-w-6xl px-4 py-8 md:py-10">
          <div className="flex items-center gap-3">
            <Globe2 className="h-5 w-5" />
            <p className="text-sm text-muted-foreground">
              Europe‑wide support via verified partners — Schengen and beyond.
            </p>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {countryBadges.map((c) => (
              <span
                key={c.code}
                className="rounded-full border bg-background px-3 py-1 text-xs"
              >
                {c.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section id="services" className="mx-auto max-w-6xl px-4 py-16 md:py-20">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <div
              key={s.slug}
              className="transform-gpu transition duration-200 ease-out hover:-translate-y-0.5"
              style={{ transitionDelay: `${i * 20}ms` }}
            >
              <Card className="h-full rounded-2xl shadow-sm transition-shadow hover:shadow-md">
                <CardHeader className="flex flex-row items-center gap-3">
                  <div className="rounded-2xl bg-primary/10 p-2">
                    <s.icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{s.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{s.blurb}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </section>

      {/* Education Focus Block */}
      <section className="mx-auto max-w-6xl px-4 pb-8">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-xl">How we help students & lifelong learners</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <ul className="list-disc pl-5 space-y-1">
              <li>University & college admissions support (program match, documents, deadlines).</li>
              <li>Student visas & residence permits, including health insurance and registration.</li>
              <li>Housing guidance close to campus: contracts explained, scams avoided.</li>
              <li>Scholarships, grants & fee‑waiver navigation (where available).</li>
              <li>Short courses, bootcamps & micro‑credentials for upskilling/reskilling.</li>
              <li>Internships & part‑time work basics: what’s legal, what’s sensible, what’s next.</li>
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* Quick Sector Signals (optional, fun + useful) */}
      <section className="mx-auto max-w-6xl px-4 pb-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card className="rounded-2xl">
            <CardHeader className="flex flex-row items-center gap-2">
              <Truck className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">Logistics & Drivers</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              High demand, high paperwork. We handle the letters so you can handle
              the miles.
            </CardContent>
          </Card>
          <Card className="rounded-2xl">
            <CardHeader className="flex flex-row items-center gap-2">
              <Hammer className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">Construction & Trades</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Solid work, solid rules. We keep the contracts as sturdy as the
              scaffolding.
            </CardContent>
          </Card>
          <Card className="rounded-2xl">
            <CardHeader className="flex flex-row items-center gap-2">
              <Landmark className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">Seasonal & Hospitality</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Short seasons, zero drama. Permits queued, expectations aligned,
              arrivals smooth.
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Compliance & Ethics */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <Card className="rounded-2xl border-2">
          <CardHeader className="flex flex-row items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <CardTitle className="text-2xl">
              Compliance & Ethics (aka: doing it properly)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-relaxed">
            <p>
              Sufoniq operates from Lithuania and follows national Employment Law
              requirements for labour intermediation. Translation: we recruit the
              clean way.
            </p>
            <ul className="grid gap-2 md:grid-cols-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" /> No
                fees charged to job‑seekers. Employers and partners foot the bill.
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                Europe‑wide operations via verified, licensed partners where
                required.
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" /> Respect
                for local labour law, collective agreements, and equal‑treatment
                rules.
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                Transparent contracts for candidates and employers. No
                fine‑print traps.
              </li>
            </ul>
            <div className="pt-2 text-muted-foreground">
              <p className="text-xs">
                Note: Country‑specific licensing (e.g., temporary
                agency/worker‑leasing permits) are handled directly by Sufoniq or
                through licensed local partners, depending on the project scope.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* CTA band */}
      <section className="border-t bg-muted/40">
        <div className="mx-auto max-w-6xl px-4 py-12 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Ready when you are.</h2>
            <p className="text-muted-foreground">
              Tell us where you’re headed — we’ll plot the course and pack the
              paperwork.
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              size="lg"
              className="rounded-2xl"
              onClick={() => {
                setShowBottomForm((v) => !v);
                setTimeout(() => scrollIntoView(bottomFormRef), 50);
              }}
            >
              Book a consultation
            </Button>
            <SafeLink href={whatsappHref}>
              <Button variant="outline" size="lg" className="rounded-2xl">
                Talk to a human
              </Button>
            </SafeLink>
          </div>
        </div>

        {/* Inline Bottom Form (toggles under the CTA band) */}
        <div ref={bottomFormRef} className="mx-auto max-w-6xl px-4 pb-12">
          {showBottomForm && (
            <Card className="rounded-2xl">
              <CardHeader className="flex items-start justify-between">
                <CardTitle className="text-xl">Tell us what you need — we’ll map the path</CardTitle>
                <button
                  aria-label="Close form"
                  className="rounded-full p-2 hover:bg-muted"
                  onClick={() => setShowBottomForm(false)}
                >
                  <X className="h-4 w-4" />
                </button>
              </CardHeader>
              <CardContent>
                <IntakeForm />
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
