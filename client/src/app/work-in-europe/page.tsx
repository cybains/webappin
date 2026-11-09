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
import IntakeForm from "@/components/IntakeForm";

const services = [
  {
    slug: "job-search-support",
    title: "Job Search Support",
    blurb:
      "Get help presenting your experience, preparing your CV and applications, and approaching suitable employers.",
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
      "Get help planning accommodation and practical setup for your move. We agree the local support with you for your destination.",
    icon: Home,
  },
  {
    slug: "local-orientation",
    title: "Local Orientation",
    blurb:
      "Understand everyday life in your destination, from local customs to getting settled. We discuss the local support you need as part of your move.",
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
    a: "No. Sufoniq does not charge job seekers; our fee model is employer-funded. Separate costs, such as visa, translation or exam fees, may apply through authorities or third-party providers. We discuss what applies before agreeing work.",
  },
  {
    q: "How do I get help finding work?",
    a: "Tell us your occupation, experience and where you want to work. We help with your CV, applications and the practical questions behind a move. This page introduces our support rather than listing vacancies; employer introductions follow when there is a suitable opportunity.",
  },
  {
    q: "Can I enquire before I have a CV or job offer?",
    a: "Yes. Start with your occupation, experience, where you live now and where you want to work. We can help you prepare your CV and work through the next steps. A short message is enough to begin; leave document scans out of your first enquiry.",
  },
  {
    q: "How long until someone replies?",
    a: "Within two business days — a personal reply with an honest assessment of your options and next steps.",
  },
  {
    q: "What happens to my details?",
    a: "We use your enquiry to respond to you. We won’t share your profile with prospective employers or recruitment partners without your permission. See our privacy policy for how enquiry data is handled.",
  },
  {
    q: "Which countries can you help me explore?",
    a: "We support people looking to work across Europe, including Lithuania, the Czech Republic, Germany, Poland, Austria, the Netherlands and Romania. Tell us where you want to go—or ask for help comparing your options. We’ll work through the job search, documents and practical steps with you, with the support agreed for your destination.",
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
    <div className="min-h-screen w-full bg-background [&_p]:leading-relaxed">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-6 py-12 md:px-8 md:py-16">
          <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight leading-tight md:text-5xl">
            Looking for work <span className="text-primary">in Europe?</span>
          </h1>
          <p className="mt-5 max-w-2xl text-muted-foreground text-lg">
            Get help with your CV, job applications and the practical steps of
            working in Europe—from documents and permits to preparing your move.
            Whether you’re applying from abroad or already here, start with your
            experience and where you want to work.
          </p>
          <p className="mt-3 flex max-w-3xl items-center gap-2 text-sm font-medium text-foreground">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
            Sufoniq does not charge job seekers.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button
              size="lg"
              className="rounded-2xl"
              onClick={() => scrollIntoView(bottomFormRef)}
            >
              Get help with your next step <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <p className="mt-5 text-sm"><a href="#services" className="font-semibold text-primary underline underline-offset-4">See how we can help ↓</a></p>


        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-6 py-12 md:px-8 md:py-16">
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
              <CardTitle className="text-base">2. Get a useful first reply</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Advice on your job search, the requirements to prepare for,
              and a suggested next step based on your experience and destination.
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

      <section className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="text-2xl font-semibold tracking-tight">What affects your start date?</h2>
        <p className="mt-3 max-w-3xl text-muted-foreground">
          Start with your target country, occupation and preferred timing.
          We’ll help you work through the steps: finding a suitable employer,
          preparing documents and planning the move. Once there is a specific
          role, we can discuss timing against its requirements and the decisions involved.
        </p>
      </section>

      {/* What we help with */}
      <section id="services" className="mx-auto max-w-6xl px-6 py-12 md:px-8 md:py-16">
        <h2 className="text-2xl font-semibold tracking-tight">What we help with</h2>
        <div className="mt-8 grid grid-cols-1 gap-x-12 gap-y-8 md:grid-cols-2">
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

      {/* High-Demand Jobs */}
      <section className="mx-auto max-w-6xl px-6 py-12 md:px-8 md:py-16">
        <h2 className="text-2xl font-semibold tracking-tight">Occupations you can ask us about</h2>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Bring your experience in one of these occupations. We’ll help you
          prepare your job search and understand the steps for your preferred country.
        </p>
        <div className="mt-8 grid grid-cols-1 gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map((j) => (
            <div key={j.slug} className="flex items-start gap-3 border-t border-border py-5">
              <j.icon className="mt-1 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
              <div><h3 className="text-base font-semibold">{j.title}</h3><p className="mt-1 text-sm text-muted-foreground">{j.blurb}</p></div>
            </div>
          ))}
        </div>
        <p className="mt-4 max-w-3xl text-muted-foreground">
          Our focus includes skilled trades, professional driving, hospitality
          and industrial work. Tell us about your skills and where you want to take them.
        </p>
        <div className="mt-6 max-w-3xl border-l-2 border-primary pl-5">
          <h3 className="text-base font-semibold">Where your skills may be needed</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            The European Labour Authority’s 2024 report identified welders,
            building electricians and cooks among the most widely reported
            shortage occupations. Its newer 2025 report highlights continuing
            shortages in trades and machine-operation roles, while showing that
            the same occupation can be in shortage in one country and surplus
            in another.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            For your search, the useful question is which country and employer
            need your particular skills. These occupations are starting points
            for that conversation, not a list of available jobs.
          </p>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm">
            <SafeLink href="https://www.ela.europa.eu/en/publications/labour-shortages-and-surpluses-europe-2025" target="_blank" rel="noopener noreferrer" className="font-medium text-primary underline underline-offset-4">EURES 2025 findings ↗</SafeLink>
            <SafeLink href="https://www.ela.europa.eu/en/publications/labour-shortages-and-surpluses-europe-2024" target="_blank" rel="noopener noreferrer" className="font-medium text-primary underline underline-offset-4">2024 occupation findings ↗</SafeLink>
          </div>
        </div>
        <p className="mt-4 max-w-3xl text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Countries you can ask us about:</span>{" "}
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

      <section className="border-y border-border bg-muted/40" aria-labelledby="trust-title">
        <div className="mx-auto max-w-6xl px-6 py-12 md:px-8 md:py-16">
          <h2 id="trust-title" className="text-2xl font-semibold tracking-tight">Who you’re talking to</h2>
          <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="space-y-4 text-muted-foreground">
              <p>Sufoniq is operated by UAB Skillaxis, headquartered in Vilnius, with management in Vienna and recruitment and operations in the Czech Republic.</p>
              <SafeLink href="https://www.registrucentras.lt/jar/p_en/index.php?kod=307395574&p=1" target="_blank" rel="noopener noreferrer" className="inline-block text-sm font-semibold text-primary underline underline-offset-4">Check our company registration: 307395574 ↗</SafeLink>
            </div>
            <div className="space-y-4 text-sm text-muted-foreground">
              <p><strong className="font-semibold text-foreground">You choose how to proceed.</strong> Your enquiry starts a conversation. We agree the support and responsibilities in writing before work begins.</p>
              <p><strong className="font-semibold text-foreground">Know the costs first.</strong> Sufoniq does not charge job seekers. Separate authority or third-party costs are discussed before agreeing work.</p>
              <p>We work within the requirements for your destination. Permit decisions remain with the relevant authorities.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-6xl px-6 py-12 md:px-8 md:py-16">
        <h2 className="text-2xl font-semibold tracking-tight">Questions people ask</h2>
        <div className="mt-6 max-w-3xl divide-y divide-border border-y border-border">
          {faqs.map((f) => (
            <details key={f.q} className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-5 rounded-sm py-1 font-semibold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary [&::-webkit-details-marker]:hidden">
                {f.q}<span aria-hidden="true" className="text-xl font-normal text-primary group-open:rotate-45">+</span>
              </summary>
              <p className="max-w-2xl pb-2 pt-3 text-sm text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </section>

      {/* Enquiry: guidance beside the form on desktop, above it on mobile. */}
      <section id="job-seeker-enquiry" ref={bottomFormRef} className="scroll-mt-24 border-t border-border bg-muted/40">
        <div className="mx-auto grid max-w-6xl items-start gap-8 px-6 py-12 md:px-8 md:py-16 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12">
          <div className="space-y-5">
            <h2 className="text-2xl font-semibold tracking-tight">Tell us about your situation</h2>
            <p className="max-w-xl text-muted-foreground">Tell us what you do and where you want to work. Within two business days, our recruitment team replies with advice on your job search, what to prepare and a suggested next step.</p>
            <div className="rounded-2xl border border-border bg-background p-5">
              <h3 className="text-base font-semibold">What to include</h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                <li>Your occupation and experience.</li>
                <li>Where you live now and where you’d like to work.</li>
                <li>The question you most want answered.</li>
              </ul>
              <p className="mt-4 text-sm text-muted-foreground">No documents needed. Leave out passport numbers and sensitive personal information.</p>
            </div>
            <p className="text-sm text-muted-foreground">We won’t share your profile with prospective employers or recruitment partners without your permission.</p>
            <SafeLink href={whatsappHref} className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">Prefer WhatsApp? Message us <ArrowRight className="h-4 w-4" aria-hidden="true" /></SafeLink>
          </div>
          <Card className="rounded-2xl">
            <CardHeader><CardTitle className="text-xl">Start a conversation</CardTitle></CardHeader>
            <CardContent><IntakeForm /></CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
