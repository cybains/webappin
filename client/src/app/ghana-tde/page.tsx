"use client";

// Sufoniq / Skillaxis – Ghana Truck Driver Mobility Page
// Single light-mode page for Ghanaian drivers, Lithuanian employers, and Ghana recruitment agencies.

import React from "react";

export default function Page() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Top bar / brand */}
      <header className="w-full border-b border-slate-200 bg-white/90 backdrop-blur sticky top-0 z-20 shadow-[0_2px_16px_rgba(15,23,42,0.05)]">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 md:px-6">
          <div className="flex items-center gap-2 font-semibold tracking-wide">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 border border-slate-300">
              <span className="text-xs font-bold text-slate-800">SQ</span>
            </div>
            <span className="text-sm md:text-base uppercase text-slate-900">Sufoniq / Skillaxis</span>
          </div>
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
      <section className="border-t border-slate-200 bg-slate-50 py-12 md:py-16">
        <div className="mx-auto max-w-5xl px-4 md:px-6 space-y-8">
          <div className="max-w-2xl space-y-3">
            <h2 className="text-2xl font-semibold text-slate-900 md:text-3xl">For Ghanaian professional drivers</h2>
            <p className="text-sm text-slate-700 md:text-base">
              We focus on Category C/CE truck drivers with real experience who want a legal, stable path to Europe.
              Everything is built around clarity: confirmed job, clean legal process, and honest expectations.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 text-sm">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-base font-medium text-slate-900">✔ Guaranteed job in Lithuania</p>
              <p className="mt-2 text-xs text-slate-700">
                Before any documents are processed, drivers receive a confirmed Lithuanian employer and position
                outline.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-base font-medium text-slate-900">✔ Work visa + TRP support</p>
              <p className="mt-2 text-xs text-slate-700">
                Skillaxis handles Lithuanian‑side processes: work permit, TRP, and MIGRIS submissions in coordination
                with the employer.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-base font-medium text-slate-900">✔ Code 95 & tachograph guidance</p>
              <p className="mt-2 text-xs text-slate-700">
                We guide you on EU professional driver requirements and where Code 95 and tachograph card are obtained –
                whether in Ghana or after arrival in Lithuania.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-base font-medium text-slate-900">✔ Relocation & onboarding support</p>
              <p className="mt-2 text-xs text-slate-700">
                From airport pickup and local registration to company onboarding and integration, you are not left
                alone to guess.
              </p>
            </div>

            <div className="rounded-2xl border border-green-600/70 bg-white p-5 shadow-sm">
              <p className="text-base font-medium text-green-700">✔ No recruitment fees – ever</p>
              <p className="mt-2 text-xs text-green-700/80">
                Drivers never pay to access a job. You only cover personal documentation and travel. This is fully
                aligned with ILO guidelines for fair recruitment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section – What drivers pay vs do not pay */}
      <section className="border-t border-slate-200 bg-slate-50 py-12 md:py-16">
        <div className="mx-auto max-w-5xl px-4 md:px-6 space-y-8">
          <div className="max-w-2xl space-y-3">
            <h2 className="text-2xl font-semibold text-slate-900 md:text-3xl">What drivers pay – and what they don&apos;t</h2>
            <p className="text-sm text-slate-700 md:text-base">
              To keep everything transparent and ILO‑compliant, we clearly separate the costs that belong to the driver
              from those that belong to the employer / Skillaxis.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 text-sm">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-base font-semibold text-slate-900">Drivers cover:</p>
              <ul className="mt-2 space-y-1 text-xs text-slate-700 list-disc list-inside">
                <li>Medical examination in Ghana</li>
                <li>Police clearance</li>
                <li>Passport (new or renewal)</li>
                <li>Document notarisation / attestation</li>
                <li>Translations if needed</li>
                <li>Air ticket to Lithuania</li>
                <li>Personal travel preparation costs</li>
                <li>Optional: Code 95 training (if done in Ghana)</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-green-600/70 bg-white p-5 shadow-sm">
              <p className="text-base font-semibold text-green-700">Drivers do NOT pay:</p>
              <ul className="mt-2 space-y-1 text-xs text-green-700/90 list-disc list-inside">
                <li>Recruitment fees</li>
                <li>Visa fees</li>
                <li>Work permit fees</li>
                <li>Temporary residence permit (TRP) fees</li>
                <li>Any fee to &quot;secure&quot; or &quot;reserve&quot; the job</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Section – What Skillaxis pays & how we earn */}
      <section className="border-t border-slate-200 bg-slate-50 py-12 md:py-16">
        <div className="mx-auto max-w-5xl px-4 md:px-6 space-y-8">
          <div className="max-w-2xl space-y-3">
            <h2 className="text-2xl font-semibold text-slate-900 md:text-3xl">What Skillaxis covers</h2>
            <p className="text-sm text-slate-700 md:text-base">
              For drivers and employers, we keep our model simple. Recruitment is free for drivers; legal and mobility
              work is covered and only charged after success.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 text-sm">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-base font-semibold text-slate-900">Skillaxis covers:</p>
              <ul className="mt-2 space-y-1 text-xs text-slate-700 list-disc list-inside">
                <li>Work permit fee in Lithuania</li>
                <li>TRP (temporary residence permit) fee</li>
                <li>MIGRIS and other Lithuanian processing fees</li>
                <li>Employer coordination and documentation</li>
                <li>Relocation administration on the European side</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-base font-semibold text-slate-900">How Skillaxis is paid:</p>
              <ul className="mt-2 space-y-1 text-xs text-slate-700 list-disc list-inside">
                <li>
                  We charge a small immigration processing fee only after the driver&apos;s visa is issued and travel is
                  ready.
                </li>
                <li>This fee is not a recruitment fee – job access remains free for the driver.</li>
                <li>The fee is used to pay our vetted Ghana recruitment partner for their work.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Section – Requirements & process for drivers */}
      <section className="border-t border-slate-200 bg-slate-50 py-12 md:py-16">
        <div className="mx-auto max-w-5xl px-4 md:px-6 space-y-8">
          <div className="grid gap-8 md:grid-cols-2 md:items-start">
            <div className="space-y-3">
              <h2 className="text-2xl font-semibold text-slate-900 md:text-3xl">Requirements for Ghanaian drivers</h2>
              <p className="text-sm text-slate-700 md:text-base">
                We focus on professional, safety‑minded drivers who can succeed in European operations.
              </p>
              <ul className="mt-2 space-y-1 text-xs text-slate-700 list-disc list-inside">
                <li>Valid Ghanaian driving licence – Category C/CE or equivalent</li>
                <li>Minimum 2+ years heavy truck / articulated driving experience</li>
                <li>Clean police clearance and medically fit for professional driving</li>
                <li>Good verbal English communication skills</li>
                <li>Passport valid for at least 18 months</li>
                <li>Willingness to complete EU Code 95 and tachograph certification</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-slate-900">Step‑by‑step deployment process</h3>
              <ol className="mt-2 space-y-2 text-xs text-slate-700">
                <li><span className="font-semibold text-green-700">1. Registration –</span> sign up via our Ghana partner.</li>
                <li><span className="font-semibold text-green-700">2. Document check –</span> passport, licence, and experience verified.</li>
                <li><span className="font-semibold text-green-700">3. Employer match –</span> driver matched to Lithuanian transport company.</li>
                <li><span className="font-semibold text-green-700">4. Ghana procedures –</span> medicals, police clearance, and travel preparation.</li>
                <li><span className="font-semibold text-green-700">5. Visa & permits –</span> Skillaxis manages Lithuanian legal steps.</li>
                <li><span className="font-semibold text-green-700">6. Visa approval –</span> immigration processing fee is paid; flight booked.</li>
                <li><span className="font-semibold text-green-700">7. Arrival & onboarding –</span> training, testing, and integration in Lithuania.</li>
                <li><span className="font-semibold text-green-700">8. Employment start –</span> driver begins full‑time work after passing.</li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* Section – Timeline & Approximate Costs */}
      <section className="border-t border-slate-200 bg-slate-50 py-12 md:py-16">
        <div className="mx-auto max-w-5xl px-4 md:px-6 space-y-8">
          <div className="max-w-3xl space-y-3">
            <h2 className="text-2xl font-semibold text-slate-900 md:text-3xl">Deployment timeline & approximate costs</h2>
            <p className="text-sm text-slate-700 md:text-base">
              These timelines and costs are averages based on previous Ghana → Lithuania deployments. They help drivers,
              employers, and agencies understand realistic expectations.
            </p>
          </div>

          {/* Timeline */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Average timeline (6–10 weeks)</h3>
            <ol className="mt-3 space-y-3 text-xs text-slate-700 list-decimal list-inside">
              <li><span className="font-semibold text-green-700">Registration & document check:</span> 3–7 days</li>
              <li><span className="font-semibold text-green-700">Employer match & confirmation:</span> 1–2 weeks</li>
              <li><span className="font-semibold text-green-700">Ghana procedures (medicals, police clearance):</span> 1–3 weeks</li>
              <li><span className="font-semibold text-green-700">Work permit processing (Lithuania):</span> 2–4 weeks</li>
              <li><span className="font-semibold text-green-700">Visa submission & approval:</span> 1–2 weeks</li>
              <li><span className="font-semibold text-green-700">Flight booking & arrival:</span> immediately after visa approval</li>
            </ol>
            <p className="text-[11px] text-slate-500">*Fastest deployments happen when documents are completed early.</p>
          </div>

          {/* Costs */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Approximate driver costs (Ghana side)</h3>
            <ul className="mt-2 space-y-2 text-xs text-slate-700 list-disc list-inside">
              <li><span className="font-semibold text-green-700">Medical exam:</span> GHS 400 – 800</li>
              <li><span className="font-semibold text-green-700">Police clearance:</span> GHS 100 – 200</li>
              <li><span className="font-semibold text-green-700">Passport (new or renewal):</span> GHS 600 – 1,000</li>
              <li><span className="font-semibold text-green-700">Notarisation / attestation:</span> GHS 300 – 700</li>
              <li><span className="font-semibold text-green-700">Translations:</span> GHS 200 – 500</li>
              <li><span className="font-semibold text-green-700">Flight to Lithuania:</span> USD 600 – 900</li>
              <li><span className="font-semibold text-green-700">Personal travel preparation:</span> GHS 200 – 600</li>
              <li><span className="font-semibold text-green-700">Optional: Code 95 training (Ghana):</span> GHS 2,500 – 4,500</li>
            </ul>
            <p className="text-[11px] text-slate-500">*These are third‑party costs. Skillaxis never charges recruitment fees.</p>
          </div>

          {/* Skillaxis fee */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Skillaxis service fee (after visa approval)</h3>
            <p className="mt-2 text-xs text-slate-700">
              A small immigration processing fee is charged only after the driver&apos;s visa is successfully approved.
            </p>
            <p className="mt-2 text-xs text-slate-700">
              Typical range: <span className="font-semibold text-green-700">USD 250 – 450</span>
            </p>
          </div>
        </div>
      </section>

      {/* Section – For Lithuanian employers */}
      <section className="border-t border-slate-200 bg-slate-50 py-12 md:py-16">
        <div className="mx-auto max-w-5xl px-4 md:px-6 space-y-8">
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold text-slate-900 md:text-3xl">For Lithuanian transport employers</h2>
            <p className="text-sm text-slate-700 md:text-base">
              We build stable, compliant driver pipelines from Ghana, managed from Europe. Our model is designed to
              reduce risk and increase retention.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 text-sm">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-base font-semibold text-slate-900">Why Ghana?</p>
              <ul className="mt-2 space-y-1 text-xs text-slate-700 list-disc list-inside">
                <li>Large pool of experienced LT/TTD and heavy truck drivers</li>
                <li>Strong road discipline, often from GCC experience (KSA, UAE, Qatar, etc.)</li>
                <li>Fast documentation timelines compared with many other regions</li>
                <li>High English proficiency and compatible work ethic</li>
                <li>Higher retention rates compared with some Asian recruitment channels</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-base font-semibold text-slate-900">Why Skillaxis?</p>
              <ul className="mt-2 space-y-1 text-xs text-slate-700 list-disc list-inside">
                <li>European‑managed company, based in Lithuania and Austria</li>
                <li>End‑to‑end mobility partner – not just a CV forwarding agency</li>
                <li>Structured, transparent process and documentation</li>
                <li>ILO‑compliant, zero recruitment fees for drivers</li>
                <li>Low risk for employers – focus on performance and retention</li>
                <li>Exclusive Ghana partnership ensures consistent standards and integrity</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Section – For Ghana recruitment agencies */}
      <section className="border-t border-slate-200 bg-slate-50 py-12 md:py-16">
        <div className="mx-auto max-w-5xl px-4 md:px-6 space-y-6">
          <div className="max-w-3xl space-y-3">
            <h2 className="text-2xl font-semibold text-slate-900 md:text-3xl">For Ghana recruitment agencies</h2>
            <p className="text-sm text-slate-700 md:text-base">
              Our model is built on trust and compliance. We work with one exclusive partner per sending country to
              maintain quality and alignment with ILO standards.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm shadow-sm">
            <ul className="space-y-1 text-xs text-slate-700 list-disc list-inside">
              <li>Skillaxis works with one exclusive recruitment partner per country.</li>
              <li>Partners must fully comply with ILO fair recruitment guidelines.</li>
              <li>We evaluate documentation integrity, ethics, and candidate handling.</li>
              <li>Agencies are paid only after driver visa approval (no upfront driver charges).</li>
              <li>
                Interested agencies can introduce themselves via the contact form, indicating &quot;Agency&quot; in the
                message.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Callback / contact form – shared for all audiences */}
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

            <form className="space-y-3 rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm shadow-sm">
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
                className="mt-1 inline-flex w-full items-center justify-center rounded-full border border-green-600 bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-green-600/30 transition hover:bg-yellow-400 hover:border-yellow-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50"
              >
                Send my request
              </button>

              <p className="text-[10px] leading-relaxed text-slate-500">
                This is a static example form. Connect it to your preferred backend or form handler (for example, an API route in Next.js, CRM, or email handler) to start receiving requests.
              </p>
            </form>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white py-4">
        <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-2 px-4 text-[11px] text-slate-600 md:flex-row md:items-center md:px-6">
          <span>© {new Date().getFullYear()} UAB Skillaxis · Sufoniq. All rights reserved.</span>
          <div className="flex flex-wrap items-center gap-3">
            <span>Beneficiary: UAB Skillaxis</span>
            <span>Payer: UAB Skillaxis</span>
            <a href="#" className="underline-offset-2 hover:underline">
              Privacy
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
