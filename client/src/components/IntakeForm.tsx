"use client";

import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";

export const REASONS = [
  "Find a job",
  "Hire talent",
  "Student support",
  "Upskill / Reskill",
  "Relocation help",
  "Housing",
  "Partnership / Collaboration",
  "Other",
] as const;

export const STAGES = [
  "Just exploring",
  "Ready to start",
  "In progress & stuck",
  "Need a second opinion",
] as const;

type IntakeFormValues = {
  name: string;
  email: string;
  phone?: string;
  reasons: string[];
  stage?: string;
  location?: string;
  message?: string;
};

const ToggleChip = ({
  label,
  selected,
  onToggle,
}: {
  label: string;
  selected: boolean;
  onToggle: () => void;
}) => (
  <button
    type="button"
    onClick={onToggle}
    aria-pressed={selected}
    className={`rounded-full border px-3 py-1 text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${selected ? "border-transparent bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm" : "border-border bg-background text-foreground hover:bg-muted"}`}
  >
    {label}
  </button>
);

export default function IntakeForm({ onSubmitted }: { onSubmitted?: () => void }) {
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
          <label htmlFor="name" className="text-sm font-medium">
            Name
          </label>
          <input id="name" name="name" type="text" required className="h-10 rounded-md border bg-background px-3" />
        </div>
        <div className="grid gap-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input id="email" name="email" type="email" required className="h-10 rounded-md border bg-background px-3" />
        </div>
        <div className="grid gap-2">
          <label htmlFor="phone" className="text-sm font-medium">
            Phone / WhatsApp (optional)
          </label>
          <input id="phone" name="phone" type="tel" className="h-10 rounded-md border bg-background px-3" />
        </div>
        <div className="grid gap-2">
          <label htmlFor="location" className="text-sm font-medium">
            Preferred location (optional)
          </label>
          <input
            id="location"
            name="location"
            type="text"
            placeholder="City or country — if you have one in mind"
            className="h-10 rounded-md border bg-background px-3"
          />
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
        <label htmlFor="message" className="text-sm font-medium">
          Anything we should know?
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          placeholder="Give us the short version: goals, constraints, timelines, special requests."
          className="rounded-md border bg-background px-3 py-2"
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <Button type="submit" className="rounded-2xl" disabled={submitting}>
          {submitting ? "Sending..." : "Submit"}
        </Button>
      </div>
    </form>
  );
}
