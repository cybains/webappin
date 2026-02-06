"use client";

import { useEffect, useState } from "react";
import IntakeForm from "@/components/IntakeForm";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const email = "support@sufoniq.com";
const whatsappHref = "https://wa.me/420778604430";

const WhatsappIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 2C6.486 2 2 5.806 2 11c0 2.256.787 4.425 2.26 6.056L2 22l5.131-1.9A9.607 9.607 0 0012 20c5.514 0 10-3.806 10-9s-4.486-9-10-9zm4.042 11.103c-.138.383-.776.73-1.508 1.078-.452.225-.848.397-1.048.565-.236.203-.422.52-.606.868-.071.138-.134.276-.212.394-.093.143-.367.529-.628.601-.28.083-.602-.037-1.116-.285-.44-.218-1.092-.516-1.7-1.081-.445-.41-.763-.88-.929-1.174-.176-.313-.29-.703-.298-1.029-.01-.392.067-.608.284-.862.207-.244.459-.553.63-.739.161-.177.392-.422.537-.594.07-.082.094-.148.074-.262-.018-.104-.065-.201-.137-.297-.092-.128-.319-.484-.428-.693-.118-.234-.237-.2-.33-.204-.321-.02-.694-.043-1.065-.043-.307 0-.558.028-.714.106-.147.076-.352.205-.524.41-.21.246-.651.756-.651 1.847 0 1.196.479 2.723 1.125 3.554.466.613 1.026 1.138 1.786 1.525.829.425 1.463.482 1.934.561.28.051.513.073.63.073.289 0 .592-.104 1.12-.441.517-.33 1.239-.84 1.293-.894.055-.053.134-.122.199-.182.126-.121.186-.264.14-.427-.043-.146-.11-.211-.179-.313-.093-.136-.405-.663-.458-.743z" />
  </svg>
);

export default function ContactReproPage() {
  const [highlightAccessCard, setHighlightAccessCard] = useState(false);

  useEffect(() => {
    if (!highlightAccessCard) return;
    const timer = setTimeout(() => setHighlightAccessCard(false), 2200);
    return () => clearTimeout(timer);
  }, [highlightAccessCard]);

  const handlePrimaryClick = () => {
    document.getElementById("intake-form")?.scrollIntoView({ behavior: "smooth", block: "center" });
    setHighlightAccessCard(true);
  };

  return (
    <section id="contact" className="relative z-10 px-6 py-16 scroll-mt-24 text-foreground">
      <div className="max-w-6xl mx-auto">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] items-start">
          <div className="space-y-5">
            <div className="space-y-2">
              <p className="sufoniq-meta-label">CONTACT</p>
              <h2 className="text-3xl font-semibold">Start with context. We&rsquo;ll take it from there.</h2>
              <p className="text-base sufoniq-body-text">
                Most people start in the platform to understand what&rsquo;s realistically possible.
              </p>
              <p className="text-sm sufoniq-body-text">
                If your situation is complex, uncertain, or needs confirmation, you can talk to a human - without starting from zero.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="default"
                size="lg"
                className="rounded-2xl px-6 py-3"
                onClick={handlePrimaryClick}
              >
                Request access
              </Button>
              <Button
                variant="outline"
                size="lg"
                title="Chat on WhatsApp"
                className="rounded-full px-4 py-3 text-[#25D366] hover:text-[#1aa957] hover:bg-[#25D366]/10"
                onClick={() => window.open(whatsappHref, "_blank", "noopener,noreferrer")}
              >
                <WhatsappIcon className="h-5 w-5 text-[inherit]" aria-hidden />
              </Button>
            </div>
            <p className="text-[11px] text-muted-foreground">
            Email us at <a className="font-semibold text-foreground hover:underline" href={`mailto:${email}`}>{email}</a>
            </p>
            <GeneralAccessForm highlight={highlightAccessCard} />
          </div>
          <div
            id="intake-form"
            className="rounded-3xl border border-[color:var(--card-border)] bg-[color:var(--card)] p-6 shadow-none"
          >
            <IntakeForm />
          </div>
        </div>
      </div>
    </section>
  );
}

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

type GeneralAccessFormProps = {
  highlight?: boolean;
};

function GeneralAccessForm({ highlight = false }: GeneralAccessFormProps) {
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

  const highlightClass = highlight ? "ring-2 ring-border/80" : "";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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
          subject: "Platform access request",
          message: [
            `Context: ${contextValue}`,
            "Source: Home / Contact (Access Card)",
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
      className={`mt-4 rounded-3xl border border-[color:var(--card-border)] bg-black/0.015 p-4 transition ${highlightClass}`}
    >
      <div className="text-sm font-semibold text-foreground">Request access</div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">EMAIL</span>
          <input
            type="email"
            required
            aria-required="true"
            value={formData.email}
            onChange={(event) =>
              setFormData((prev) => ({ ...prev, email: event.target.value }))
            }
            className="h-10 rounded-xl border border-black/10 bg-white px-3 text-sm text-foreground outline-none transition focus:border-black/20 focus:ring-2 focus:ring-black/10"
            placeholder="name@example.com"
          />
        </label>
        <label className="grid gap-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">NAME</span>
          <input
            value={formData.name}
            onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
            className="h-10 rounded-xl border border-black/10 bg-white px-3 text-sm text-foreground outline-none transition focus:border-black/20 focus:ring-2 focus:ring-black/10"
            placeholder="Optional"
          />
        </label>
        <label className="grid gap-1 sm:col-span-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">CONTEXT</span>
          <textarea
            required
            aria-required="true"
            value={formData.context}
            onChange={(event) =>
              setFormData((prev) => ({ ...prev, context: event.target.value }))
            }
            className="min-h-[88px] rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-foreground outline-none transition focus:border-black/20 focus:ring-2 focus:ring-black/10"
            placeholder="What are you trying to do? Countries, timing, constraints."
          />
        </label>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        We do not require sensitive data to start. Keep it high-level.
      </p>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          {error && (
            <p className="text-xs text-red-600" aria-live="polite">
              {error}
            </p>
          )}
          {status === "success" && (
              <p className="text-xs text-emerald-600" aria-live="polite">
              Request received. We&rsquo;ll respond with the right entry point.
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={!canSubmit || !emailValid || status === "sending"}
          className="inline-flex items-center gap-2 rounded-xl bg-foreground px-3 py-2 text-sm font-semibold text-background transition hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          Request access
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
}
