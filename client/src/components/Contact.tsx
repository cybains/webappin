"use client";

import React, { useEffect, useRef, useState } from "react";

export default function ContactReproPage() {
  // core UI state
  const [focusMode, setFocusMode] = useState(false);
  const [showEmailMenu, setShowEmailMenu] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // data
  const email = "contactform@sufoniq.com"; // keep this consistent with your backend env MAIL_TO
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  // 🔧 tiny bug fix:
  // the [submitting, setSubmitting] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // refs
  const sectionRef = useRef<HTMLElement | null>(null);
  const anchorRef = useRef<HTMLDivElement | null>(null);
  const emailMenuRef = useRef<HTMLDivElement | null>(null);
  const formCardRef = useRef<HTMLDivElement | null>(null);
  const firstFieldRef = useRef<HTMLInputElement | null>(null);

  // helpers
  const isMobileNow = () =>
    typeof window !== "undefined" && window.matchMedia("(max-width: 1023.5px)").matches;

  const compose = (overrides?: { subject?: string; body?: string }) => {
    const subject = encodeURIComponent(overrides?.subject ?? "Hello Sufoniq — Inquiry");
    const body = encodeURIComponent(
      overrides?.body ?? `Hi Sufoniq team,\n\nI’d like to ask about...\n\n—\nSent from sufoniq.com`
    );
    return { subject, body };
  };

  const openCompose = (
    provider: "gmail" | "outlook" | "mailto",
    overrides?: { subject?: string; body?: string }
  ) => {
    const { subject, body } = compose(overrides);
    let url = "";
    if (provider === "gmail") {
      url = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${body}`;
    } else if (provider === "outlook") {
      url = `https://outlook.live.com/mail/0/deeplink/compose?to=${email}&subject=${subject}&body=${body}`;
    } else {
      url = `mailto:${email}?subject=${subject}&body=${body}`;
    }
    window.open(url, provider === "mailto" ? "_self" : "_blank");
    setShowEmailMenu(false);
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
      if (showEmailMenu || showForm) {
        setShowEmailMenu(false);
        setShowForm(false);
      } else if (focusMode) {
        setFocusMode(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [focusMode, showEmailMenu, showForm]);

  // click outside the entire section → exit focus mode & close everything
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!focusMode) return;
      const t = e.target as Node;
      if (sectionRef.current && !sectionRef.current.contains(t)) {
        setShowEmailMenu(false);
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
    const inMenu = !!emailMenuRef.current?.contains(t);
    const inForm = !!formCardRef.current?.contains(t);
    if (!inAnchor && !inMenu && !inForm) {
      if (showEmailMenu) setShowEmailMenu(false);
      if (showForm) setShowForm(false);
    }
  };

  // handlers
  const handleEmailClick = () => {
    ensureFocusMode();
    if (isMobileNow()) {
      openCompose("mailto");
      return;
    }
    setShowEmailMenu((s) => !s);
    setShowForm(false);
    anchorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const toggleForm = () => {
    ensureFocusMode();
    const toOpen = !showForm;
    setShowForm(toOpen);
    setShowEmailMenu(false);
    anchorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    if (toOpen) setTimeout(() => firstFieldRef.current?.focus(), 420);
  };

  // form utils
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form), // { name, email, subject, message }
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || `Request failed (${res.status})`);
      }
      setForm({ name: "", email: "", subject: "", message: "" });
      setShowForm(false);
      // TODO: optional toast success
    } catch (err) {
      console.error(err);
      // TODO: optional toast error
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className={[
        "px-6 bg-background text-foreground overflow-hidden",
        focusMode ? "min-h-screen py-28" : "py-20",
      ].join(" ")}
      onPointerDownCapture={ensureFocusMode}
      onMouseDownCapture={onSectionClickAway}
    >
      <div className="max-w-6xl mx-auto">
        {/* heading */}
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold mb-2">Still got questions?</h2>
          <p className="text-base text-muted-foreground">We’ll get back with answers, wit, and maybe snacks.</p>
        </div>

        {/* helper */}
        <div className="min-h-[60px] flex justify-center items-center">
          <p className="text-sm text-muted-foreground">
            Choose how you’d like to reach us — quick email or detailed form.
          </p>
        </div>

        {/* anchor row */}
        <div className="relative mt-4 flex justify-center">
          <div ref={anchorRef} className="relative inline-flex gap-4 items-center">
            <button
              onClick={handleEmailClick}
              className="bg-primary text-primary-foreground font-semibold py-2 px-6 rounded-full shadow hover:bg-primary/90 transition-colors"
            >
              Email Us
            </button>
            <button
              onClick={toggleForm}
              className="border border-primary text-primary font-semibold py-2 px-6 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              Contact Form
            </button>

            {/* LEFT: email options (desktop only) */}
            {showEmailMenu && (
              <div
                ref={emailMenuRef}
                role="menu"
                className="hidden lg:block absolute right-[calc(100%+16px)] top-1/2 -translate-y-1/2 z-50 animate-[slideInLeft_480ms_cubic-bezier(0.22,1,0.36,1)]"
              >
                <div className="relative w-72 rounded-2xl border border-border bg-popover text-popover-foreground shadow-xl overflow-hidden">
                  {/* caret */}
                  <div aria-hidden className="absolute -right-2 top-8 w-0 h-0 border-y-[10px] border-y-transparent border-l-[10px] border-l-border" />
                  <div aria-hidden className="absolute -right-[7px] top-8 w-0 h-0 border-y-[9px] border-y-transparent border-l-[9px] border-l-popover" />
                  <div className="px-4 py-2 text-xs text-muted-foreground border-b border-border">Quick compose:</div>
                  <button
                    className="w-full px-4 py-3 text-sm hover:bg-accent hover:text-accent-foreground text-left"
                    onClick={() => openCompose("gmail")}
                  >
                    Open in Gmail
                  </button>
                  <button
                    className="w-full px-4 py-3 text-sm hover:bg-accent hover:text-accent-foreground text-left"
                    onClick={() => openCompose("outlook")}
                  >
                    Open in Outlook
                  </button>
                  <button
                    className="w-full px-4 py-3 text-sm hover:bg-accent hover:text-accent-foreground text-left"
                    onClick={() => openCompose("mailto")}
                  >
                    Use my default mail app
                  </button>
                </div>
              </div>
            )}

            {/* RIGHT: contact form (desktop only) */}
            {showForm && (
              <div className="hidden lg:block absolute left-[calc(100%+16px)] top-1/2 -translate-y-1/2 z-40 animate-[slideInRight_480ms_cubic-bezier(0.22,1,0.36,1)]">
                <div ref={formCardRef} className="relative">
                  {/* caret */}
                  <div aria-hidden className="absolute -left-2 top-8 w-0 h-0 border-y-[10px] border-y-transparent border-r-[10px] border-r-border" />
                  <div aria-hidden className="absolute -left-[7px] top-8 w-0 h-0 border-y-[9px] border-y-transparent border-r-[9px] border-r-card" />
                  <form
                    onSubmit={handleSubmit}
                    className="w-[600px] max-w-[82vw] grid grid-cols-1 gap-4 bg-card/60 backdrop-blur rounded-2xl p-6 border border-border"
                  >
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium mb-1">Name</label>
                        <input
                          ref={firstFieldRef}
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          type="text"
                          required
                          className="w-full rounded-lg border border-input bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
                          placeholder="Jane Doe"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          type="email"
                          required
                          className="w-full rounded-lg border border-input bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
                          placeholder="jane@example.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Subject</label>
                      <input
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        type="text"
                        required
                        className="w-full rounded-lg border border-input bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
                        placeholder="How can you help with…"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Message</label>
                      <textarea
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        className="w-full rounded-lg border border-input bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
                        placeholder="Tell us a bit about what you need…"
                      />
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <p className="text-xs text-muted-foreground">
                        We’ll send this to <span className="font-medium">{email}</span>.
                      </p>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="bg-primary text-primary-foreground font-semibold py-2 px-6 rounded-full shadow hover:bg-primary/90 disabled:opacity-60 transition-colors"
                      >
                        {submitting ? "Sending…" : "Send Message"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* MOBILE: form below buttons */}
        {showForm && (
          <div className="lg:hidden mt-8 animate-[fadeIn_480ms_cubic-bezier(0.22,1,0.36,1)]">
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 gap-4 bg-card/60 backdrop-blur rounded-2xl p-6 border border-border"
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    ref={firstFieldRef}
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    type="text"
                    required
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Jane Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    type="email"
                    required
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
                    placeholder="jane@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Subject</label>
                <input
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  type="text"
                  required
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
                  placeholder="How can you help with…"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Message</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Tell us a bit about what you need…"
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                <p className="text-xs text-muted-foreground">
                  We’ll send this to <span className="font-medium">{email}</span>.
                </p>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-primary text-primary-foreground font-semibold py-2 px-6 rounded-full shadow hover:bg-primary/90 disabled:opacity-60 transition-colors"
                >
                  {submitting ? "Sending…" : "Send Message"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* tiny keyframes for smoothness */}
      <style jsx>{`
        @keyframes slideInLeft {
          0% { opacity: 0; transform: translateX(-12px) scale(0.985); }
          100% { opacity: 1; transform: translateX(0) scale(1); }
        }
        @keyframes slideInRight {
          0% { opacity: 0; transform: translateX(12px) scale(0.985); }
          100% { opacity: 1; transform: translateX(0) scale(1); }
        }
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(10px) scale(0.985); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </section>
  );
}
