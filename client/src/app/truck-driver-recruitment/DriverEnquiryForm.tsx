"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import styles from "@/components/EmployerPanels.module.css";

const empty = { company: "", email: "", country: "", headcount: "", qualification: "", brief: "" };

export default function DriverEnquiryForm() {
  const [fields, setFields] = useState(empty);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const update = (key: keyof typeof empty, value: string) => setFields(previous => ({ ...previous, [key]: value }));

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    const email = fields.email.trim();
    if (!/^\S+@\S+\.\S+$/.test(email) || !fields.country.trim() || !fields.brief.trim()) {
      setError("Please enter a valid email, hiring country and a short driver brief.");
      setStatus("error");
      return;
    }
    if (fields.headcount && (!Number.isInteger(Number(fields.headcount)) || Number(fields.headcount) < 1)) {
      setError("Enter a whole number of drivers, starting from one.");
      setStatus("error");
      return;
    }
    setStatus("sending");
    setError("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fields.company.trim() || "Transport employer",
          email,
          subject: "Truck driver recruitment enquiry",
          message: [
            `Company: ${fields.company.trim() || "Not supplied"}`,
            `Hiring country: ${fields.country.trim()}`,
            `Drivers needed: ${fields.headcount || "To discuss"}`,
            `Qualification support: ${fields.qualification || "To discuss"}`,
            `Driver brief: ${fields.brief.trim()}`,
            "Source: /truck-driver-recruitment",
          ].join("\n"),
        }),
      });
      if (!response.ok) throw new Error("Request failed");
      setFields(empty);
      setStatus("success");
    } catch {
      setError("We couldn’t send your enquiry. Please try again, or use the email or WhatsApp links beside this form.");
      setStatus("error");
    }
  }

  return (
    <form onSubmit={submit} className={styles.form} aria-labelledby="driver-form-title" aria-busy={status === "sending"}>
      <div className={styles.formHeader}>
        <h3 id="driver-form-title">Tell us about your driver requirement</h3>
        <p>Three required fields. The rest can be discussed together.</p>
      </div>
      <div className={styles.formBody}>
        <fieldset disabled={status === "sending"}>
          <legend className="sr-only">Driver recruitment enquiry</legend>
          <div className={styles.fields}>
            <label className={styles.label}><span>Business email (required)</span><input type="email" name="email" required maxLength={254} autoComplete="email" placeholder="you@company.com" className={styles.input} value={fields.email} onChange={e => update("email", e.target.value)} /></label>
            <label className={styles.label}><span>Company <span className={styles.optional}>(optional)</span></span><input name="company" maxLength={120} autoComplete="organization" placeholder="Your transport company" className={styles.input} value={fields.company} onChange={e => update("company", e.target.value)} /></label>
            <label className={styles.label}><span>Hiring country (required)</span><input name="country" required maxLength={100} placeholder="For example: Germany" className={styles.input} value={fields.country} onChange={e => update("country", e.target.value)} /></label>
            <label className={styles.label}><span>Drivers needed <span className={styles.optional}>(optional)</span></span><input name="headcount" type="number" min={1} step={1} inputMode="numeric" placeholder="For example: 2" className={styles.input} value={fields.headcount} onChange={e => update("headcount", e.target.value)} /></label>
            <label className={[styles.label, styles.wide].join(" ")}><span>Could you support qualification? <span className={styles.optional}>(optional)</span></span><select name="qualification" className={styles.input} value={fields.qualification} onChange={e => update("qualification", e.target.value)}><option value="">Let’s discuss this</option><option>We need drivers already qualified for the destination</option><option>We could support licence and professional qualification steps</option><option>We need to understand the requirements first</option></select></label>
            <label className={[styles.label, styles.wide].join(" ")}><span>Your driver brief (required)</span><textarea name="brief" required maxLength={3000} aria-describedby="driver-form-help" className={[styles.input, styles.textarea].join(" ")} placeholder="Vehicle and trailer types, routes, language needs and when you hope to hire. A few lines are enough." value={fields.brief} onChange={e => update("brief", e.target.value)} /></label>
          </div>
        </fieldset>
        <p id="driver-form-help" className={styles.help}>Please leave out candidate names, licence scans and other personal documents.</p>
        {status === "error" && <p className={[styles.message, styles.error].join(" ")} role="alert">{error}</p>}
        {status === "success" && <p className={[styles.message, styles.success].join(" ")} role="status">Enquiry received. We’ll contact you to discuss your driver requirements and next steps.</p>}
        <button type="submit" disabled={status === "sending"} className={styles.submit}>{status === "sending" ? "Sending…" : "Send our driver enquiry"}<ArrowRight size={18} aria-hidden="true" /></button>
        <p className={styles.privacy}>We use your enquiry to reply. <Link href="/privacy-policy">Privacy policy</Link></p>
      </div>
    </form>
  );
}
