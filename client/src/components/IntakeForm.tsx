"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function IntakeForm({ onSubmitted }: { onSubmitted?: () => void }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const form = formRef.current!;
    const data = new FormData(form);
    const values = {
      name: String(data.get("name") || ""),
      email: String(data.get("email") || ""),
      trade: String(data.get("trade") || ""),
      message: String(data.get("message") || ""),
    };

    const subject = "Job-seeker enquiry";
    const composedMessage = [
      values.trade ? `Trade / occupation: ${values.trade}` : undefined,
      values.message ? `Notes:\n${values.message}` : undefined,
    ]
      .filter(Boolean)
      .join("\n\n");

    setSubmitting(true);
    setError(null);
    setStatus("idle");

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          subject,
          message: composedMessage || "Website inquiry",
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload?.error || `Request failed (${response.status})`);
      }

      form.reset();
      setStatus("success");
      onSubmitted?.();
    } catch (err) {
      console.error(err);
      setStatus("error");
      if (err instanceof Error && err.name === "AbortError") {
        setError("Request timed out. Please try again.");
      } else {
        setError(err instanceof Error ? err.message : "Something went wrong");
      }
    } finally {
      clearTimeout(timer);
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
          Thanks — we’ve got it. Our recruitment team reads every message and replies within two business days.
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
      <div className="grid gap-4 md:grid-cols-2">
        <div className="grid gap-2">
          <label htmlFor="name" className="text-sm font-medium">
            Name
          </label>
          <input id="name" name="name" type="text" autoComplete="name" required className="h-10 rounded-md border bg-background px-3" />
        </div>
        <div className="grid gap-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input id="email" name="email" type="email" autoComplete="email" required className="h-10 rounded-md border bg-background px-3" />
        </div>
        <div className="grid gap-2">
          <label htmlFor="trade" className="text-sm font-medium">
            Trade or occupation
          </label>
          <p className="text-[11px] text-muted-foreground">Optional</p>
          <input
            id="trade"
            name="trade"
            type="text"
            placeholder="e.g. welder, truck driver, cook"
            className="h-10 rounded-md border bg-background px-3"
          />
        </div>
      </div>



      <div className="grid gap-2">
        <label htmlFor="message" className="text-sm font-medium">
          What would you like help with? (optional)
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          placeholder="Where you live now, your experience and your main question. Please leave out passport numbers and document scans."
          className="rounded-md border bg-background px-3 py-2"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" className="rounded-2xl" disabled={submitting}>
          {submitting ? "Sending..." : "Send message"}
        </Button>
        <a
          href="https://wa.me/420778604430?text=Hi%20Sufoniq%2C%20I%27d%20like%20to%20talk."
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-primary underline underline-offset-4"
        >
          Prefer WhatsApp? Message us instead.
        </a>
        <Link
          href="/privacy-policy"
          className="text-sm text-muted-foreground underline underline-offset-4"
        >
          Privacy Policy
        </Link>
      </div>
    </form>
  );
}
