"use client";

import { useEffect, useRef, useState } from "react";

export default function ContactSection() {
  const [showEmailMenu, setShowEmailMenu] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [lifted, setLifted] = useState(false);
  const [notice, setNotice] = useState<null | { type: "success" | "error"; msg: string }>(null);
  const email = "support@sufoniq.com";

  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const emailBtnRef = useRef<HTMLButtonElement | null>(null);
  const emailMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setLifted(showEmailMenu || showForm || !!notice);
  }, [showEmailMenu, showForm, notice]);

  // Close email menu on outside click or ESC
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!showEmailMenu) return;
      const target = e.target as Node;
      if (
        emailMenuRef.current &&
        !emailMenuRef.current.contains(target) &&
        emailBtnRef.current &&
        !emailBtnRef.current.contains(target)
      ) {
        setShowEmailMenu(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowEmailMenu(false);
    };
    window.addEventListener("click", onClick);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("click", onClick);
      window.removeEventListener("keydown", onKey);
    };
  }, [showEmailMenu]);

  const openCompose = (provider: "gmail" | "outlook" | "mailto") => {
    const subject = encodeURIComponent("Hello Sufoniq — Inquiry");
    const body = encodeURIComponent(
      `Hi Sufoniq team,\n\nI’d like to ask about...\n\n—\nSent from sufoniq.com`
    );

    let url = "";
    if (provider === "gmail") {
      url = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${body}`;
    } else if (provider === "outlook") {
      url = `https://outlook.live.com/mail/0/deeplink/compose?to=${email}&subject=${subject}&body=${body}`;
    } else {
      url = `mailto:${email}?subject=${subject}&body=${body}`;
    }
    window.open(url, provider === "mailto" ? "_self" : "_blank", "noopener,noreferrer");
    setShowEmailMenu(false);
    setNotice(null);
  };

  const toggleForm = () => {
    setShowForm((s) => !s);
    setShowEmailMenu(false);
    setNotice(null);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validate = () => {
    if (!form.name.trim()) return "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return "Please enter a valid email.";
    if (!form.subject.trim()) return "Please add a subject.";
    if (!form.message.trim()) return "Please write a message.";
    return null;
  };

  const fallbackMailto = () => {
    const subject = encodeURIComponent(form.subject || "Hello Sufoniq — Inquiry");
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}\n\n—\nSent via contact form on sufoniq.com`
    );
    const url = `mailto:${email}?subject=${subject}&body=${body}`;
    window.location.href = url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      setNotice({ type: "error", msg: err });
      return;
    }

    setSubmitting(true);
    setNotice(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        fallbackMailto();
        setSubmitting(false);
        setNotice({
          type: "success",
          msg: "Opening your mail app to send the message…",
        });
        return;
      }

      setForm({ name: "", email: "", subject: "", message: "" });
      setSubmitting(false);
      setNotice({ type: "success", msg: "Thanks! Your message has been sent." });
    } catch {
      fallbackMailto();
      setSubmitting(false);
      setNotice({
        type: "success",
        msg: "Opening your mail app to send the message…",
      });
    }
  };

  return (
    <section
      className="py-20 px-6 text-center bg-background text-foreground relative overflow-hidden"
      id="contact"
    >
      {/* Floating Text */}
      <div
        className={`transition-transform duration-500 ease-in-out mb-6 ${
          lifted ? "-translate-y-6" : "translate-y-0"
        }`}
      >
        <h2 className="text-2xl font-bold mb-2 text-foreground">Still got questions?</h2>
        <p className="text-base text-muted-foreground">
          We&rsquo;ll get back with answers, wit, and maybe snacks.
        </p>
      </div>

      {/* Reserved Space for Messages */}
      <div className="h-[110px] sm:h-[100px] md:h-[90px] transition-all duration-500 ease-in-out">
        {notice && (
          <div
            className={`animate-fadeIn transition-opacity ${
              notice.type === "success" ? "text-emerald-700" : "text-red-600"
            }`}
          >
            <p className="text-sm italic">{notice.msg}</p>
          </div>
        )}
        {!notice && showEmailMenu && (
          <div className="animate-fadeIn transition-opacity">
            <p className="text-sm text-muted-foreground">Choose how you’d like to email us:</p>
          </div>
        )}
        {!notice && showForm && (
          <div className="animate-fadeIn transition-opacity">
            <p className="text-sm text-muted-foreground">Fill out the form and we’ll reply soon.</p>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex justify-center gap-4 mt-6 relative">
        <button
          ref={emailBtnRef}
          onClick={() => {
            setShowEmailMenu((s) => !s);
            setShowForm(false);
            setNotice(null);
          }}
          className="bg-primary text-white font-semibold py-2 px-6 rounded-full shadow hover:bg-primary/90 hover:text-black hover:font-bold transition"
          aria-haspopup="menu"
          aria-expanded={showEmailMenu}
          aria-controls="email-menu"
        >
          Email Us
        </button>

        <button
          onClick={toggleForm}
          className="border border-primary text-primary font-semibold py-2 px-6 rounded-full hover:bg-primary hover:text-white transition"
        >
          Contact Form
        </button>

        {/* Email options dropdown — now ABOVE the button */}
        {showEmailMenu && (
          <div
            id="email-menu"
            ref={emailMenuRef}
            role="menu"
            className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-56 rounded-xl border border-zinc-200 bg-white shadow-lg text-left overflow-hidden z-50"
          >
            <button
              role="menuitem"
              className="w-full px-4 py-3 text-sm hover:bg-zinc-50 text-left"
              onClick={() => openCompose("gmail")}
            >
              Open in Gmail
            </button>
            <button
              role="menuitem"
              className="w-full px-4 py-3 text-sm hover:bg-zinc-50 text-left"
              onClick={() => openCompose("outlook")}
            >
              Open in Outlook
            </button>
            <button
              role="menuitem"
              className="w-full px-4 py-3 text-sm hover:bg-zinc-50 text-left"
              onClick={() => openCompose("mailto")}
            >
              Use my default mail app
            </button>
          </div>
        )}
      </div>

      {/* Contact Form */}
      {showForm && (
        <div className="mt-10 max-w-xl mx-auto text-left animate-fadeIn">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-4 bg-white/60 backdrop-blur rounded-2xl p-6 border border-zinc-200"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  type="text"
                  required
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 outline-none focus:ring-2 focus:ring-primary/40"
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
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 outline-none focus:ring-2 focus:ring-primary/40"
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
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 outline-none focus:ring-2 focus:ring-primary/40"
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
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 outline-none focus:ring-2 focus:ring-primary/40"
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
                className="bg-primary text-white font-semibold py-2 px-6 rounded-full shadow hover:bg-primary/90 disabled:opacity-60 transition"
              >
                {submitting ? "Sending…" : "Send Message"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Custom animation class */}
      <style jsx>{`
        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: scale(0.98);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.35s ease-out;
        }
      `}</style>
    </section>
  );
}
