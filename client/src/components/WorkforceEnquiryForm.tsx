"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

export default function WorkforceEnquiryForm() {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    context: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const emailValue = formData.email.trim();
  const contextValue = formData.context.trim();
  const emailValid = EMAIL_REGEX.test(emailValue);
  const canSubmit = emailValue.length > 0 && contextValue.length > 0;


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "sending") return;
    if (!canSubmit) {
      setError("Email and context are required.");
      setStatus("error");
      return;
    }
    if (!emailValid) {
      setError("Enter a valid email.");
      setStatus("error");
      return;
    }

    setError(null);
    setStatus("sending");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim() || "Anonymous",
          email: emailValue,
          subject: "Workforce enquiry",
          message: [
            `Context: ${contextValue}`,
            "Source: Home / Contact (Workforce Enquiry)",
          ].join("\n"),
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload?.error || `Request failed (${response.status})`);
      }

      setStatus("success");
      setFormData({ email: "", name: "", context: "" });
    } catch (err) {
      console.error(err);
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      id="workforce-enquiry"
      aria-labelledby="workforce-enquiry-title"
      className={`rounded-3xl border border-[color:var(--card-border)] bg-black/0.015 p-4 transition`}
    >
      <h3 id="workforce-enquiry-title" className="text-lg font-semibold text-foreground">Describe the role</h3>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Work email</span>
          <input
            type="email"
            required
            aria-required="true"
            autoComplete="email"
            name="email"
            value={formData.email}
            onChange={(event) =>
              setFormData((prev) => ({ ...prev, email: event.target.value }))
            }
            className="h-10 rounded-xl border border-black/10 bg-white px-3 text-sm text-foreground outline-none transition focus:border-black/20 focus:ring-2 focus:ring-black/10"
            placeholder="name@example.com"
          />
        </label>
        <label className="grid gap-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Name (optional)</span>
          <input
            autoComplete="name"
            name="name"
            value={formData.name}
            onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
            className="h-10 rounded-xl border border-black/10 bg-white px-3 text-sm text-foreground outline-none transition focus:border-black/20 focus:ring-2 focus:ring-black/10"
            placeholder="Optional"
          />
        </label>
        <label className="grid gap-1 sm:col-span-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">The role and hiring requirement</span>
          <textarea
            required
            aria-required="true"
            value={formData.context}
            onChange={(event) =>
              setFormData((prev) => ({ ...prev, context: event.target.value }))
            }
            name="context"
            aria-describedby="workforce-enquiry-help"
            className="min-h-[144px] rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-foreground outline-none transition focus:border-black/20 focus:ring-2 focus:ring-black/10"
            placeholder="Roles, headcount, work location, timing and known requirements."
          />
        </label>
      </div>
      <p id="workforce-enquiry-help" className="mt-3 text-xs text-muted-foreground">
        Roles, headcount, work location, timing and any known hurdle. A brief outline is fine. Please leave out candidate documents and sensitive personal details.
      </p>
      <p className="mt-2 text-xs text-muted-foreground">We use your enquiry to assess fit and reply.</p>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          {error && (
            <p className="text-sm text-red-700" role="alert">
              {error}
            </p>
          )}
          {status === "success" && (
              <p className="text-sm text-emerald-800" role="status">
              Enquiry received. We&rsquo;ll contact you to discuss fit and next steps.
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={!canSubmit || !emailValid || status === "sending"}
          className="inline-flex w-full sm:w-auto items-center justify-center gap-2 min-h-12 rounded-2xl bg-primary bg-[color:var(--primary)] px-4 sm:px-8 py-3 text-sm sm:text-base font-semibold text-primary-foreground text-[color:var(--primary-foreground)] transition hover:bg-primary/90 hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-60"
        >
          {status === "sending" ? "Sending…" : "Send enquiry"}
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
}
