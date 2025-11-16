"use client";

import React, { useEffect, useRef, useState } from "react";
import IntakeForm from "@/components/IntakeForm";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export default function ContactReproPage() {
  // core UI state
  const [focusMode, setFocusMode] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // data
  const email = "support@sufoniq.com"; // keep this consistent with your backend env MAIL_TO
  const whatsappHref = "https://wa.me/37064112439?text=Hi%20Sufoniq%2C%20I%27d%20like%20to%20talk.";

  // refs
  const sectionRef = useRef<HTMLElement | null>(null);
  const anchorRef = useRef<HTMLDivElement | null>(null);
  const formCardRef = useRef<HTMLDivElement | null>(null);

  // helpers
  const openMailto = () => {
    const subject = encodeURIComponent("Hello Sufoniq - Inquiry");
    const body = encodeURIComponent(`Hi Sufoniq team,\n\nI'd like to ask about...\n\n-\nSent from sufoniq.com`);
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };

  // focus mode: engage on first interaction inside the section
  const ensureFocusMode = () => {
    if (!focusMode) {
      setFocusMode(true);
      sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // ESC handling
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (showForm) {
        setShowForm(false);
      } else if (focusMode) {
        setFocusMode(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [focusMode, showForm]);

  // click outside the entire section → exit focus mode & close everything
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!focusMode) return;
      const t = e.target as Node;
      if (sectionRef.current && !sectionRef.current.contains(t)) {
        setShowForm(false);
        setFocusMode(false);
      }
    };
    window.addEventListener("pointerdown", onDown);
    return () => window.removeEventListener("pointerdown", onDown);
  }, [focusMode]);

  // click on the section background (not on buttons/panels) → close panels but keep focus mode
  const onSectionClickAway = (e: React.MouseEvent) => {
    const t = e.target as Node;
    const inAnchor = !!anchorRef.current?.contains(t);
    const inForm = !!formCardRef.current?.contains(t);
    if (!inAnchor && !inForm && showForm) {
      setShowForm(false);
    }
  };

  // handlers
  const handleEmailClick = () => {
    ensureFocusMode();
    openMailto();
  };

  const toggleForm = () => {
    ensureFocusMode();
    const toOpen = !showForm;
    setShowForm(toOpen);
    anchorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className={[
        "px-6 bg-background text-foreground overflow-hidden",
        focusMode ? "min-h-screen py-28" : "py-20",
      ].join(" ")}
      onMouseDownCapture={onSectionClickAway}
    >
      <div className="max-w-6xl mx-auto">
        {/* heading */}
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold mb-2">Got questions for us?</h2>
          <p className="text-base text-muted-foreground">We’ll get back with answers, wit, and maybe snacks.</p>
        </div>

        {/* helper */}
        <div className="min-h-[60px] flex justify-center items-center">
          <p className="text-sm text-muted-foreground">
            Choose how you&apos;d like to reach us &mdash; quick email or detailed form.
          </p>
        </div>

        {/* anchor row */}
        <div className="relative mt-4 flex flex-col items-center gap-4">
          <div ref={anchorRef} className="relative inline-flex flex-col gap-4 items-center sm:flex-row">
            <Button variant="secondary" size="lg" className="rounded-2xl px-6" onClick={toggleForm}>
              Book a consultation
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="rounded-2xl px-6"
              onClick={() => window.open(whatsappHref, "_blank", "noopener,noreferrer")}
            >
              Talk to a human
            </Button>

          </div>
          <p className="text-sm text-muted-foreground text-center">
            Feeling shy? Email us at{" "}
            <button
              type="button"
              onClick={handleEmailClick}
              className="font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-sm"
            >
              {email}
            </button>
            .
          </p>
        </div>

        {showForm && (
          <div
            ref={formCardRef}
            className="mt-8 animate-[fadeIn_480ms_cubic-bezier(0.22,1,0.36,1)] w-full"
          >
            <div className="max-w-3xl mx-auto rounded-2xl border border-border bg-card text-card-foreground shadow-xl">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border text-sm font-semibold">
                <span className="text-center w-full">Tell us about your move</span>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="ml-4 rounded-full p-2 hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                  aria-label="Close form"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="p-4 md:p-6">
                <IntakeForm />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* tiny keyframes for smoothness */}
      <style jsx>{`
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(10px) scale(0.985); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </section>
  );
}
