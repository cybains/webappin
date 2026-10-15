"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { audienceSections, paymentResponsibilities, type SectionKey } from "./content";

export default function Page() {
  const reduceMotion = useReducedMotion();
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<SectionKey>("drivers");
  const [activeDriverSubSection, setActiveDriverSubSection] = useState("support");
  const currentIndex = audienceSections.findIndex((section) => section.key === activeSection);
  const normalizedIndex = currentIndex === -1 ? 0 : currentIndex;
  const tabWidth = 100 / audienceSections.length;
  const slidePercent = tabWidth * normalizedIndex;
  const driverSubSections = audienceSections.find((section) => section.key === "drivers")?.subSections ?? [];
  const activeDriverTab =
    driverSubSections.find((subSection) => subSection.key === activeDriverSubSection) ?? driverSubSections[0];

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;
    const form = e.currentTarget;
    const data = new FormData(form);

    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const role = String(data.get("role") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const message = String(data.get("message") || "").trim();

    if (!name || !email || !role || !phone || !message) {
      setError("Please fill out every field before sending your request.");
      setStatus("error");
      return;
    }

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      setStatus("error");
      return;
    }

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
          to: "support@sufoniq.com",
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload?.error || `Request failed (${response.status})`);
      }

      form.reset();
      setStatus("success");
      setError(null);
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
        <div className="flex-1 bg-green-700" />
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
              Professional driving opportunities in Lithuania. A clear route from Ghana.
            </h1>
            <p className="text-sm leading-relaxed text-slate-700 md:text-base">
              Sufoniq coordinates recruitment and mobility support for experienced Ghanaian truck drivers. The employer decides the hire; authorities decide applications. Drivers pay Sufoniq no fees, and payment responsibilities are set out before you commit.
            </p>

            {/* Key value props */}
            <div className="grid gap-3 text-xs text-slate-800 sm:grid-cols-3 md:text-sm">
              <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                <p className="font-medium">Employer confirmation</p>
                <p className="mt-1 text-[11px] text-slate-600 md:text-xs">
                  The employer confirms the role and terms before the application route proceeds.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                <p className="font-medium">No recruitment fees</p>
                <p className="mt-1 text-[11px] text-slate-600 md:text-xs">
                  The employer pays Sufoniq, and Sufoniq pays the Ghana agency. Drivers pay neither for recruitment.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                <p className="font-medium">Employer-funded flight and Code 95</p>
                <p className="mt-1 text-[11px] text-slate-600 md:text-xs">
                  Your employer pays for the flight and Code 95 training. Preparation costs are listed below.
                </p>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:gap-4">
              <a
                href="#callback"
                className="inline-flex items-center justify-center rounded-full border border-green-600 bg-green-700 px-5 py-2 text-sm font-semibold text-white shadow-sm shadow-green-600/30 transition hover:bg-green-800 hover:border-green-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50"
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
            <h2 className="mt-1 text-lg font-semibold text-slate-900">The route and who decides each step</h2>

            <ol className="mt-4 space-y-3 text-sm text-slate-800">
              <li className="flex gap-3">
                <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full border border-green-600 bg-white text-xs font-semibold text-green-700">
                  1
                </span>
                <div>
                  <p className="font-medium">Registration</p>
                  <p className="text-xs text-slate-600">You provide your information; Sufoniq and the Ghana partner review the initial requirement.</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full border border-green-600 bg-white text-xs font-semibold text-green-700">
                  2
                </span>
                <div>
                  <p className="font-medium">Document & experience check</p>
                  <p className="text-xs text-slate-600">Sufoniq reviews documents and experience; licensing and eligibility questions still need verification.</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full border border-green-600 bg-white text-xs font-semibold text-green-700">
                  3
                </span>
                <div>
                  <p className="font-medium">Employer match</p>
                  <p className="text-xs text-slate-600">The employer makes the hiring decision and confirms the role and terms in writing.</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full border border-green-600 bg-white text-xs font-semibold text-green-700">
                  4
                </span>
                <div>
                  <p className="font-medium">Applications and decisions</p>
                  <p className="text-xs text-slate-600">Sufoniq coordinates preparation; the employer and driver complete their required actions. Authorities decide applications.</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full border border-green-600 bg-white text-xs font-semibold text-green-700">
                  5
                </span>
                <div>
                  <p className="font-medium">Arrival & onboarding</p>
                  <p className="text-xs text-slate-600">Employer-funded flight and Code 95 training, with any licensing and work-readiness checks completed before driving.</p>
                </div>
              </li>
            </ol>

            <p className="mt-4 text-[11px] text-slate-500">
              Sufoniq cannot guarantee a hire, permit or start date. The written route identifies the relevant decisions, appointments, responsibilities and costs.
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="payment-policy-title" className="border-t border-slate-200 bg-white py-10 md:py-12">
        <div className="mx-auto max-w-5xl space-y-5 px-4 md:px-6">
          <div className="max-w-3xl space-y-3">
            <h2 id="payment-policy-title" className="text-2xl font-semibold text-slate-900 md:text-3xl">Who pays what</h2>
            <p className="text-sm leading-relaxed text-slate-700">Drivers pay no fees to Sufoniq, before or after approval. The employer pays Sufoniq, and Sufoniq pays the Ghana recruitment agency. Your flight and Code 95 training are employer-funded.</p>
            <p className="text-sm leading-relaxed text-slate-700">PCC, medicals and translations are paid by the driver unless the employer explicitly agrees to cover them. Any such agreement is recorded in the written cost allocation.</p>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full table-fixed text-left text-sm">
              <caption className="sr-only">Payment responsibilities for the Ghana–Lithuania driver route</caption>
              <thead className="bg-slate-100 text-slate-900"><tr><th scope="col" className="w-2/5 px-4 py-3 font-semibold">Item</th><th scope="col" className="px-4 py-3 font-semibold">Who pays</th></tr></thead>
              <tbody>{paymentResponsibilities.map(row => <tr key={row.item} className="border-t border-slate-200 align-top"><th scope="row" className="break-words px-4 py-3 font-medium text-slate-900">{row.item}</th><td className="break-words px-4 py-3 text-slate-700">{row.payer}</td></tr>)}</tbody>
            </table>
          </div>
          <p className="max-w-3xl text-xs leading-relaxed text-slate-600">The written route budget also identifies any passport, attestation, official application, appointment, card or other required charges and who pays them. Supplier prices and official charges are confirmed for the individual route before spending is agreed.</p>
        </div>
      </section>

      {/* Section – What we offer Ghanaian drivers */}
      {/* Audience sections slider */}
      <section className="border-t border-slate-200 bg-slate-50 py-12 md:py-16">
        <div className="mx-auto max-w-5xl px-4 md:px-6 space-y-8">
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold text-slate-900 md:text-3xl">
              What we do, what you pay, and who owns each step.
            </h2>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap gap-2">
              {audienceSections.map((section) => (
                <button
                  key={section.key}
                  id={"audience-" + section.key}
                  aria-controls={"panel-" + section.key}
                  type="button"
                  onClick={() => setActiveSection(section.key)}
                  aria-pressed={activeSection === section.key}
                  className={`rounded-full px-4 py-1 text-xs font-semibold transition ${
                    activeSection === section.key
                      ? "bg-green-700 text-white shadow-sm"
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
                transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 140, damping: 25 }}
              />
            </div>
            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-100 bg-slate-50">
              <motion.div
                className="flex"
                style={{ width: `${audienceSections.length * 100}%` }}
                animate={{ x: `-${slidePercent}%` }}
                transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 120, damping: 25 }}
              >
                {audienceSections.map((section) => (
                  <article
                    key={section.key}
                    id={"panel-" + section.key}
                    aria-labelledby={"audience-" + section.key}
                    inert={activeSection !== section.key}
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
                                    ? "bg-emerald-700 text-white shadow-sm"
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
                                        className="grid grid-cols-1 gap-1 sm:grid-cols-2 sm:gap-4"
                                      >
                                        {typeof entry === "string" ? (
                                          <span className="block sm:col-span-2">{entry}</span>
                                        ) : (
                                          <>
                                            <span className="text-slate-700">{entry.label}</span>
                                            <span className="font-semibold text-slate-900 sm:text-right">{entry.value}</span>
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
                                    className="grid grid-cols-1 gap-1 sm:grid-cols-2 sm:gap-4"
                                  >
                                    {typeof entry === "string" ? (
                                      <span className="block sm:col-span-2">{entry}</span>
                                    ) : (
                                      <>
                                        <span className="text-slate-700">{entry.label}</span>
                                        <span className="font-semibold text-slate-900 sm:text-right">{entry.value}</span>
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
                      {section.action && (
                        <div className="mt-6 space-y-3 border-t border-slate-200 pt-5">
                          <p className="text-sm leading-relaxed text-slate-700">{section.action.description}</p>
                          <a
                            href={section.action.href}
                            onClick={() => {
                              if (section.key !== "employers") return;
                              const role = document.querySelector<HTMLSelectElement>("#callback select[name='role']");
                              if (role) role.value = "employer";
                            }}
                            className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-green-700 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-green-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green-700 sm:w-auto"
                          >
                            {section.action.label}<span aria-hidden="true" className="ml-2">→</span>
                          </a>
                        </div>
                      )}
                    </div>
                  </article>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      <section aria-labelledby="route-checks-title" className="border-t border-slate-200 bg-slate-50 py-10 md:py-12">
        <div className="mx-auto max-w-5xl space-y-5 px-4 md:px-6">
          <h2 id="route-checks-title" className="text-2xl font-semibold text-slate-900">A process you can check before you commit</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5"><h3 className="text-sm font-semibold">Check who is asking for payment</h3><p className="mt-2 text-sm leading-relaxed text-slate-700">Drivers do not pay Sufoniq or the Ghana agency to be selected, matched or hired. Ask for the written cost allocation and a receipt for any genuine preparation expense.</p></div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5"><h3 className="text-sm font-semibold">Get the role and terms in writing</h3><p className="mt-2 text-sm leading-relaxed text-slate-700">Confirm the employer, role, employment terms and responsibilities. Check any agreement to cover your PCC, medicals or translations before paying those costs.</p></div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5"><h3 className="text-sm font-semibold">Know who decides</h3><p className="mt-2 text-sm leading-relaxed text-slate-700">The employer decides the hire. Authorities and competent bodies decide applications and licensing requirements. No agent can guarantee those decisions or a start date.</p></div>
          </div>
          <p className="max-w-3xl text-sm leading-relaxed text-slate-700">Sufoniq is operated by UAB Skillaxis, registered in Lithuania and operated from Vienna. Ask for our company details and verify them before committing to the route.</p>
          <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
            <a href="https://www.migracija.lt/" target="_blank" rel="noopener noreferrer" className="font-semibold text-green-800 underline underline-offset-4">Official Lithuanian migration services ↗</a>
            <a href="https://www.regitra.lt/en/services/driving-licences/driver-qualification-cards/" target="_blank" rel="noopener noreferrer" className="font-semibold text-green-800 underline underline-offset-4">Regitra driver qualification guidance ↗</a>
            <a href="/method-trust" className="font-semibold text-green-800 underline underline-offset-4">Our method and boundaries</a>
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
              <h2 id="callback-title" className="text-xl font-semibold text-slate-900 md:text-2xl">
                Talk to us, and get a clear next step.
              </h2>
              <p className="mt-2 text-sm text-slate-700">
                Ghanaian driver, Lithuanian employer, or Ghana agency – tell us who you are and what you&apos;re looking
                for. We&apos;ll discuss fit, the steps to check and the costs that apply to you.
              </p>
              <p className="mt-3 text-xs text-slate-500">
                Adults 18+ only. By submitting, you agree that we may contact you about mobility, recruitment, and
                relocation services. No spam, ever.
              </p>
              <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                All fields are required — include the best phone number for WhatsApp follow up.
              </p>
              <p id="callback-help" className="mt-3 text-xs leading-relaxed text-slate-600">A short outline is enough. Do not send passport copies, medical records or police documents with this initial enquiry.</p>
            </div>

            <form onSubmit={handleSubmit} aria-labelledby="callback-title" aria-describedby="callback-help" className="space-y-3 rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm shadow-sm">
              {status === "success" && (
                <div
                  role="status"
                  aria-live="polite"
                  className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900"
                >
                  Thank you. Your message is with us. We will review your situation and reply with next steps and any questions that still need checking.
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
                    autoComplete="name"
                    placeholder="Your full name"
                    required
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
                    autoComplete="email"
                    placeholder="you@example.com"
                    required
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
                  required
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
                    autoComplete="tel"
                    placeholder="Include country code"
                    required
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
                  required
                  className="w-full resize-none rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="mt-1 inline-flex w-full items-center justify-center rounded-full border border-green-600 bg-green-700 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-green-600/30 transition hover:bg-green-800 hover:border-green-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
