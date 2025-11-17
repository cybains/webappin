"use client";

// Sufoniq / Skillaxis – Ghana Truck Driver Mobility Page
// Single light-mode page for Ghanaian drivers, Lithuanian employers, and Ghana recruitment agencies.

import React, { useState } from "react";
import { motion } from "framer-motion";

type SectionKey = "drivers" | "agencies" | "employers" | "skillaxis";

type ListEntry = string | { label: string; value: string };

type DriverSubSection = {
  key: string;
  label: string;
  description?: string;
  highlights?: { title: string; detail: string; accent?: string }[];
  dualLists?: { title: string; entries: string[]; accentTitle?: string }[];
  lists?: { title: string; entries: ListEntry[]; footnote?: string }[];
};

type AudienceSection = {
  key: SectionKey;
  label: string;
  title: string;
  description: string;
  highlights: { title: string; detail: string; accent?: string }[];
  dualLists?: { title: string; entries: string[]; accentTitle?: string }[];
  lists?: { title: string; entries: ListEntry[]; footnote?: string }[];
  subSections?: DriverSubSection[];
};

const timelineEntries: ListEntry[] = [
  { label: "Registration & document check", value: "3-7 days" },
  { label: "Employer match & confirmation", value: "1-2 weeks" },
  { label: "Ghana procedures (medicals, police clearance)", value: "1-3 weeks" },
  { label: "Work permit processing (Lithuania)", value: "2-4 weeks" },
  { label: "Visa submission & approval", value: "1-2 weeks" },
  { label: "Flight booking & arrival", value: "Immediately after visa approval" },
];

const costEntries: ListEntry[] = [
  { label: "Medical exam", value: "GHS 400-800" },
  { label: "Police clearance", value: "GHS 100-200" },
  { label: "Passport (new or renewal)", value: "GHS 600-1,000" },
  { label: "Document notarisation / attestation", value: "GHS 300-700" },
  { label: "Translations if needed", value: "GHS 200-500" },
  { label: "Flight to Lithuania", value: "USD 600-900" },
  { label: "Personal travel preparation", value: "GHS 200-600" },
  { label: "Optional Code 95 training (Ghana)", value: "GHS 2,500-4,500" },
];

const driverHighlights = [
  {
    title: "Guaranteed job in Lithuania",
    detail: "Drivers receive a confirmed Lithuanian employer and position outline before any paperwork starts.",
  },
  {
    title: "Work visa + TRP support",
    detail: "Skillaxis manages Lithuanian work permit, TRP, and MIGRIS submissions in partnership with the employer.",
  },
  {
    title: "Code 95 & tachograph guidance",
    detail: "We show you whether to secure your Code 95 and tachograph card in Ghana or after arrival.",
  },
  {
    title: "Relocation & onboarding",
    detail: "Airport pickup, registration, training, and integration are handled so you can focus on the road.",
  },
  {
    title: "No recruitment fees",
    detail: "Drivers only cover legitimate travel and document costs—never charges to secure a job.",
    accent: "text-emerald-600",
  },
];

const driverDualLists = [
  {
    title: "Drivers cover",
    entries: [
      "Medical examination in Ghana",
      "Police clearance",
      "Passport (new or renewal)",
      "Document notarisation / attestation",
      "Translations if needed",
      "Air ticket to Lithuania",
      "Personal travel preparation costs",
      "Optional: Code 95 training (if done in Ghana)",
    ],
  },
  {
    title: "Drivers do NOT pay",
    entries: [
      "Recruitment fees",
      "Visa fees",
      "Work permit fees",
      "Temporary residence permit (TRP) fees",
      "Any fee to secure or reserve the job",
    ],
    accentTitle: "text-green-700",
  },
];

const driverRequirementsList = {
  title: "Requirements for Ghanaian drivers",
  entries: [
    "Valid Ghanaian driving licence - Category C/CE or equivalent",
    "Minimum 2+ years heavy truck / articulated experience",
    "Clean police clearance and medically fit for professional driving",
    "Good verbal English communication skills",
    "Passport valid for at least 18 months",
    "Willingness to complete EU Code 95 and tachograph certification",
  ],
};

const driverProcessList = {
  title: "Step-by-step deployment process",
  entries: [
    "Registration - sign up via our Ghana partner",
    "Document check - passport, licence, and experience verified",
    "Employer match - driver matched to a Lithuanian transport company",
    "Ghana procedures - medicals, police clearance, and travel prep",
    "Visa & permits - Skillaxis manages the Lithuanian legal steps",
    "Visa approval - immigration processing fee is paid and the flight is booked",
    "Arrival & onboarding - training, testing, and integration in Lithuania",
    "Employment start - driver begins full-time work after passing",
  ],
};

const driverTimelineList = {
  title: "Deployment timeline (6-10 weeks)",
  entries: timelineEntries,
  footnote: "*Fastest deployments happen when documents are completed early.",
};

const driverCostList = {
  title: "Approximate driver costs (Ghana side)",
  entries: costEntries,
  footnote: "*These are third-party costs. Skillaxis never charges recruitment fees.",
};

const audienceSections: AudienceSection[] = [
  {
    key: "drivers",
    label: "Drivers",
    title: "For Ghanaian professional drivers",
    description:
      "We focus on Category C/CE truck drivers with real experience who want a legal, stable path to Europe. Everything is built around clarity: confirmed jobs, clean legal processes, and honest expectations.",
    highlights: driverHighlights,
    dualLists: driverDualLists,
    lists: [driverRequirementsList, driverProcessList, driverTimelineList, driverCostList],
    subSections: [
      {
        key: "promises",
        label: "Promises",
        description: "What we guarantee before a single visa form is filed.",
        highlights: driverHighlights,
      },
      {
        key: "expectations",
        label: "Expectations",
        description: "What every Ghanaian driver must prepare and cover.",
        dualLists: driverDualLists,
        lists: [driverRequirementsList],
      },
      {
        key: "moving-parts",
        label: "Moving parts",
        description: "How we choreograph the process, from paperwork to flights.",
        lists: [driverProcessList, driverTimelineList, driverCostList],
      },
    ],
  },
  {
    key: "agencies",
    label: "Agencies",
    title: "For Ghana recruitment agencies",
    description:
      "Our model is built on trust and compliance. We work with one exclusive partner per sending country so that quality and ILO standards are maintained.",
    highlights: [
      {
        title: "Exclusive partnership",
        detail: "We only collaborate with one Ghana partner at a time to protect standards and transparency.",
      },
      {
        title: "Fair recruitment",
        detail: "Partner agencies must fully comply with ILO fair recruitment guidelines and ethical handling.",
      },
      {
        title: "Paid after success",
        detail: "Payments are released only after the driver visa is approved—no upfront driver charges.",
      },
    ],
    lists: [
      {
        title: "Why connect with Skillaxis?",
        entries: [
          "Skillaxis works with one exclusive recruitment partner per country.",
          "Partners must fully comply with ILO fair recruitment guidelines.",
          "We evaluate documentation integrity, ethics, and candidate handling.",
          "Agencies are paid only after driver visa approval (no upfront driver charges).",
          "Introduce yourself via the contact form and mention \"Agency\" in the message.",
        ],
      },
    ],
  },
  {
    key: "employers",
    label: "Employers",
    title: "For Lithuanian transport employers",
    description:
      "We build stable, compliant driver pipelines from Ghana, managed from Europe. Our model is designed to reduce risk and increase retention.",
    highlights: [
      {
        title: "Large pool of drivers",
        detail: "Experienced LT/TTD and heavy truck drivers with regional road discipline are available.",
      },
      {
        title: "Fast documentation",
        detail: "Ghanaian timelines compare favorably with many other sending regions.",
      },
      {
        title: "Retention & ethics",
        detail: "We focus on performance, transparency, and a mutual code of conduct.",
      },
    ],
    lists: [
      {
        title: "Why Ghana?",
        entries: [
          "Large pool of experienced LT/TTD and heavy truck drivers",
          "Strong road discipline, often from GCC experience (KSA, UAE, Qatar)",
          "Fast documentation timelines compared with many other regions",
          "High English proficiency and a compatible work ethic",
          "Higher retention rates compared with some Asian recruitment channels",
        ],
      },
      {
        title: "Why Skillaxis?",
        entries: [
          "European-managed company based in Lithuania and Austria",
          "End-to-end mobility partner, not just a CV forwarding agency",
          "Structured, transparent processes and documentation",
          "ILO-compliant, zero recruitment fees for drivers",
          "Low risk for employers with a focus on performance and retention",
          "Exclusive Ghana partnership keeps standards and integrity aligned",
        ],
      },
    ],
  },
  {
    key: "skillaxis",
    label: "Skillaxis",
    title: "About Skillaxis",
    description:
      "For drivers and employers we keep the model simple: recruitment is free for drivers and legal mobility work is covered on the European side.",
    highlights: [
      {
        title: "Permit support",
        detail: "Work permit, TRP, and MIGRIS handling is managed directly from Lithuania.",
      },
      {
        title: "Clear communication",
        detail: "Structured documentation and timeline updates keep everyone aligned.",
      },
      {
        title: "Fair service fee",
        detail: "A small immigration processing fee is invoiced only after visa approval.",
      },
    ],
    lists: [
      {
        title: "Skillaxis covers",
        entries: [
          "Work permit fee in Lithuania",
          "Temporary residence permit (TRP) fee",
          "MIGRIS and other Lithuanian processing fees",
          "Employer coordination and documentation",
          "Relocation administration on the European side",
        ],
      },
    ],
  },
];

export default function Page() {
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<SectionKey>("drivers");
  const [activeDriverSubSection, setActiveDriverSubSection] = useState("promises");
  const currentIndex = audienceSections.findIndex((section) => section.key === activeSection);
  const normalizedIndex = currentIndex === -1 ? 0 : currentIndex;
  const tabWidth = 100 / audienceSections.length;
  const slidePercent = tabWidth * normalizedIndex;
  const driverSubSections = audienceSections.find((section) => section.key === "drivers")?.subSections ?? [];
  const activeDriverTab =
    driverSubSections.find((subSection) => subSection.key === activeDriverSubSection) ?? driverSubSections[0];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const name = String(data.get("name") || "");
    const email = String(data.get("email") || "");
    const role = String(data.get("role") || "");
    const phone = String(data.get("phone") || "");
    const message = String(data.get("message") || "");

    const subject = `Ghana TDE inquiry — ${role || "General"}`;
    const composedMessage = [
      `Role: ${role}`,
      phone ? `Phone / WhatsApp: ${phone}` : undefined,
      message ? `Message:\n${message}` : undefined,
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
          name,
          email,
          subject,
          message: composedMessage || "Ghana TDE inquiry",
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload?.error || `Request failed (${response.status})`);
      }

      form.reset();
      setStatus("success");
    } catch (err) {
      console.error(err);
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Top bar / brand */}
      <header className="w-full border-b border-slate-200 bg-white/90 backdrop-blur sticky top-0 z-20 shadow-[0_2px_16px_rgba(15,23,42,0.05)]">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 md:px-6">
          <span className="hidden text-xs text-slate-500 md:inline">
            Ghana · Lithuania · Truck Driver Mobility
          </span>
        </div>
      </header>

      {/* Ghana color bar (subtle identity) */}
      <div className="w-full h-1 flex">
        <div className="flex-1 bg-red-600" />
        <div className="flex-1 bg-yellow-400" />
        <div className="flex-1 bg-green-600" />
      </div>

      {/* Hero – shared positioning */}
      <section className="flex-1 bg-gradient-to-b from-slate-50 via-white to-slate-100">
        <div className="mx-auto flex max-w-5xl flex-col gap-10 px-4 py-10 md:flex-row md:items-center md:justify-between md:px-6 md:py-14">
          {/* Left: core message */}
          <div className="max-w-xl space-y-6">
            <p className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-medium text-slate-700 shadow-sm">
              For Ghanaian drivers · Lithuanian employers · Ghana recruitment partners
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
              Legal, ILO‑compliant mobility for Ghanaian truck drivers to Europe.
            </h1>
            <p className="text-sm leading-relaxed text-slate-700 md:text-base">
              Skillaxis helps Ghanaian professional truck drivers relocate to Europe, starting with Lithuania. We work
              with one vetted recruitment partner in Ghana and follow ILO guidelines: drivers are never charged
              recruitment fees.
            </p>

            {/* Key value props */}
            <div className="grid gap-3 text-xs text-slate-800 sm:grid-cols-3 md:text-sm">
              <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                <p className="font-medium">Guaranteed employer</p>
                <p className="mt-1 text-[11px] text-slate-600 md:text-xs">
                  Drivers are matched with a Lithuanian employer before any visa or permit process begins.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                <p className="font-medium">No recruitment fees</p>
                <p className="mt-1 text-[11px] text-slate-600 md:text-xs">
                  Fully aligned with ILO guidelines – drivers never pay to access a job.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                <p className="font-medium">End‑to‑end support</p>
                <p className="mt-1 text-[11px] text-slate-600 md:text-xs">
                  From document checks and permits to arrival, onboarding, and integration in Lithuania.
                </p>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:gap-4">
              <a
                href="#callback"
                className="inline-flex items-center justify-center rounded-full border border-green-600 bg-green-600 px-5 py-2 text-sm font-semibold text-white shadow-sm shadow-green-600/30 transition hover:bg-yellow-400 hover:border-yellow-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50"
              >
                Talk to us
              </a>

              <p className="text-[11px] text-slate-600 sm:ml-1 max-w-xs">
                Whether you are a Ghanaian driver, a Lithuanian employer, or a Ghana agency, use the form below and we
                will respond with the next steps.
              </p>
            </div>
          </div>

          {/* Right: high‑level process card */}
          <div className="mt-6 w-full max-w-md rounded-3xl border border-slate-200 bg-white p-5 shadow-md md:mt-0">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              At a glance
            </p>
            <h2 className="mt-1 text-lg font-semibold text-slate-900">From Ghana to Lithuania in clear steps</h2>

            <ol className="mt-4 space-y-3 text-sm text-slate-800">
              <li className="flex gap-3">
                <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full border border-green-600 bg-white text-xs font-semibold text-green-700">
                  1
                </span>
                <div>
                  <p className="font-medium">Registration</p>
                  <p className="text-xs text-slate-600">Driver signs up through our exclusive Ghana recruitment partner.</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full border border-green-600 bg-white text-xs font-semibold text-green-700">
                  2
                </span>
                <div>
                  <p className="font-medium">Document & experience check</p>
                  <p className="text-xs text-slate-600">We review licence, passport, truck experience, and basic eligibility.</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full border border-green-600 bg-white text-xs font-semibold text-green-700">
                  3
                </span>
                <div>
                  <p className="font-medium">Employer match</p>
                  <p className="text-xs text-slate-600">Driver is matched with a Lithuanian employer before permits start.</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full border border-green-600 bg-white text-xs font-semibold text-green-700">
                  4
                </span>
                <div>
                  <p className="font-medium">Visa & permit processing</p>
                  <p className="text-xs text-slate-600">Skillaxis handles Lithuanian‑side work permit, TRP, and MIGRIS steps.</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full border border-green-600 bg-white text-xs font-semibold text-green-700">
                  5
                </span>
                <div>
                  <p className="font-medium">Arrival & onboarding</p>
                  <p className="text-xs text-slate-600">Airport pickup, registration, training, and integration into the company.</p>
                </div>
              </li>
            </ol>

            <p className="mt-4 text-[11px] text-slate-500">
              Our goal is fair, transparent, and safe mobility – aligned with ILO standards for responsible recruitment.
            </p>
          </div>
        </div>
      </section>

      {/* Section – What we offer Ghanaian drivers */}
      {/* Audience sections slider */}
      <section className="border-t border-slate-200 bg-slate-50 py-12 md:py-16">
        <div className="mx-auto max-w-5xl px-4 md:px-6 space-y-8">
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold text-slate-900 md:text-3xl">
              The promises, the expectations, and the smallest moving parts we keep under control.
            </h2>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap gap-2">
              {audienceSections.map((section) => (
                <button
                  key={section.key}
                  type="button"
                  onClick={() => setActiveSection(section.key)}
                  aria-pressed={activeSection === section.key}
                  className={`rounded-full px-4 py-1 text-xs font-semibold transition ${
                    activeSection === section.key
                      ? "bg-green-600 text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {section.label}
                </button>
              ))}
            </div>
            <div className="relative mt-3 h-1 rounded-full bg-slate-100">
              <motion.span
                className="absolute top-0 h-full rounded-full bg-gradient-to-r from-emerald-400 to-lime-500"
                style={{ width: `${tabWidth}%` }}
                animate={{ left: `${slidePercent}%` }}
                transition={{ type: "spring", stiffness: 140, damping: 25 }}
              />
            </div>
            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-100 bg-slate-50">
              <motion.div
                className="flex"
                style={{ width: `${audienceSections.length * 100}%` }}
                animate={{ x: `-${slidePercent}%` }}
                transition={{ type: "spring", stiffness: 120, damping: 25 }}
              >
                {audienceSections.map((section) => (
                  <article
                    key={section.key}
                    aria-hidden={activeSection !== section.key}
                    className="w-full shrink-0"
                    style={{ width: `${100 / audienceSections.length}%` }}
                  >
                    <div className="p-6 md:p-8">
                      <h3 className="text-lg font-semibold text-slate-900">{section.title}</h3>
                      <p className="mt-2 text-sm text-slate-700">{section.description}</p>
                      {section.subSections ? (
                        <div className="mt-5 space-y-5">
                          <div className="flex flex-wrap gap-2">
                            {section.subSections.map((subSection) => (
                              <button
                                key={subSection.key}
                                type="button"
                                onClick={() => setActiveDriverSubSection(subSection.key)}
                                aria-pressed={activeDriverSubSection === subSection.key}
                                className={`rounded-full px-4 py-1 text-xs font-semibold transition ${
                                  activeDriverSubSection === subSection.key
                                    ? "bg-emerald-600 text-white shadow-sm"
                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                }`}
                              >
                                {subSection.label}
                              </button>
                            ))}
                          </div>
                          {activeDriverTab && (
                            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                              {activeDriverTab.description && (
                                <p className="text-xs text-slate-600">{activeDriverTab.description}</p>
                              )}
                              {activeDriverTab.highlights && (
                                <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                  {activeDriverTab.highlights.map((highlight) => (
                                    <div
                                      key={highlight.title}
                                      className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-700"
                                    >
                                      <p className="font-semibold text-slate-900">{highlight.title}</p>
                                      <p
                                        className={`mt-1 leading-relaxed ${
                                          highlight.accent ?? "text-slate-700"
                                        }`}
                                      >
                                        {highlight.detail}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              )}
                              {activeDriverTab.dualLists && (
                                <div className="mt-6 grid gap-4 md:grid-cols-2">
                                  {activeDriverTab.dualLists.map((list) => (
                                    <div
                                      key={list.title}
                                      className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-700"
                                    >
                                      <p className={`font-semibold ${list.accentTitle ?? "text-slate-900"}`}>
                                        {list.title}
                                      </p>
                                      <ul className="mt-2 space-y-1 list-disc pl-4">
                                        {list.entries.map((entry) => (
                                          <li key={entry}>{entry}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  ))}
                                </div>
                              )}
                              {activeDriverTab.lists?.map((list) => (
                                <div key={list.title} className="mt-6 space-y-2">
                                  <p className="text-sm font-semibold text-slate-900">{list.title}</p>
                                  <ul className="space-y-1 text-xs text-slate-700">
                                    {list.entries.map((entry, index) => (
                                      <li
                                        key={`${list.title}-${index}`}
                                        className="flex justify-between gap-3"
                                      >
                                        {typeof entry === "string" ? (
                                          <span className="block flex-1">{entry}</span>
                                        ) : (
                                          <>
                                            <span className="text-slate-700">{entry.label}</span>
                                            <span className="font-semibold text-slate-900">{entry.value}</span>
                                          </>
                                        )}
                                      </li>
                                    ))}
                                  </ul>
                                  {list.footnote && (
                                    <p className="text-[11px] text-slate-500">{list.footnote}</p>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <>
                          <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {section.highlights.map((highlight) => (
                              <div
                                key={highlight.title}
                                className="rounded-2xl border border-slate-200 bg-white p-4 text-xs text-slate-700 shadow-sm"
                              >
                                <p className="font-semibold text-slate-900">{highlight.title}</p>
                                <p
                                  className={`mt-1 leading-relaxed ${
                                    highlight.accent ?? "text-slate-700"
                                  }`}
                                >
                                  {highlight.detail}
                                </p>
                              </div>
                            ))}
                          </div>
                          {section.dualLists && (
                            <div className="mt-6 grid gap-4 md:grid-cols-2">
                              {section.dualLists.map((list) => (
                                <div
                                  key={list.title}
                                  className="rounded-2xl border border-slate-200 bg-white p-4 text-xs text-slate-700 shadow-sm"
                                >
                                  <p className={`font-semibold ${list.accentTitle ?? "text-slate-900"}`}>
                                    {list.title}
                                  </p>
                                  <ul className="mt-2 space-y-1 list-disc pl-4">
                                    {list.entries.map((entry) => (
                                      <li key={entry}>{entry}</li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                            </div>
                          )}
                          {section.lists?.map((list) => (
                            <div key={list.title} className="mt-6 space-y-2">
                              <p className="text-sm font-semibold text-slate-900">{list.title}</p>
                              <ul className="space-y-1 text-xs text-slate-700">
                                {list.entries.map((entry, index) => (
                                  <li
                                    key={`${list.title}-${index}`}
                                    className="flex justify-between gap-3"
                                  >
                                    {typeof entry === "string" ? (
                                      <span className="block flex-1">{entry}</span>
                                    ) : (
                                      <>
                                        <span className="text-slate-700">{entry.label}</span>
                                        <span className="font-semibold text-slate-900">{entry.value}</span>
                                      </>
                                    )}
                                  </li>
                                ))}
                              </ul>
                              {list.footnote && (
                                <p className="text-[11px] text-slate-500">{list.footnote}</p>
                              )}
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  </article>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      <section
        id="callback"
        className="border-t border-slate-200 bg-white py-10 md:py-12"
      >
        <div className="mx-auto max-w-5xl px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:items-start">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 md:text-2xl">
                Request a calm, honest conversation.
              </h2>
              <p className="mt-2 text-sm text-slate-700">
                Ghanaian driver, Lithuanian employer, or Ghana agency – tell us who you are and what you&apos;re looking
                for. We&apos;ll respond with realistic options and next steps.
              </p>
              <p className="mt-3 text-xs text-slate-500">
                Adults 18+ only. By submitting, you agree that we may contact you about mobility, recruitment, and
                relocation services. No spam, ever.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm shadow-sm">
              {status === "success" && (
                <div
                  role="status"
                  aria-live="polite"
                  className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900"
                >
                  Your message has been sent! We&apos;ll respond within 24 hours.
                </div>
              )}
              {status === "error" && error && (
                <div
                  role="alert"
                  className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900"
                >
                  {error}
                </div>
              )}
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-800" htmlFor="name">
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Your full name"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-800" htmlFor="email">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-800" htmlFor="role">
                  Who are you?
                </label>
                <select
                  id="role"
                  name="role"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select one
                  </option>
                  <option value="driver">Ghanaian truck driver</option>
                  <option value="employer">Lithuanian transport employer</option>
                  <option value="agency">Ghana recruitment agency</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-800" htmlFor="phone">
                  Phone / WhatsApp
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Include country code"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-800" htmlFor="message">
                  Tell us a bit about your situation
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  placeholder="Example: I am a Ghanaian C/CE driver with 4 years experience and GCC background... / We are a Lithuanian transport company looking for 10 drivers..."
                  className="w-full resize-none rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="mt-1 inline-flex w-full items-center justify-center rounded-full border border-green-600 bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-green-600/30 transition hover:bg-yellow-400 hover:border-yellow-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Sending..." : "Send my request"}
              </button>
            </form>
          </div>
        </div>
      </section>

    </main>
  );
}
