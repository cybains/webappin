"use client";
import { useTranslation,localizeValidation,clearValidation } from "@/lib/i18n/client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import Link from "@/components/LocalizedLink";
import styles from "./EmployerPanels.module.css";

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

type EnquiryFormProps = {
  source?: string;
  title?: string;
  introduction?: string;
  contextLabel?: string;
  placeholder?: string;
  help?: string;
  submitLabel?: string;
};

export default function WorkforceEnquiryForm({
  source = "Home / Contact",
  title = "Let’s talk about your role",
  introduction = "A brief outline is enough to start the conversation.",
  contextLabel = "What are you hiring for?",
  placeholder = "For example: two welders for our site in Austria, ideally starting in September. We’re finding it difficult to reach suitable candidates.",
  help = "Include the role, location and preferred timing. Please leave out candidate documents and sensitive personal details.",
  submitLabel = "Send enquiry",
}: EnquiryFormProps) {
  const {locale,t}=useTranslation();
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
          subject: t("Workforce enquiry"),
          message: [
            `Language: ${locale}`,
            `Context: ${contextValue}`,
            `Source: ${source} (Workforce Enquiry)`,
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
      setError("Something went wrong");
    }
  };

  return (
    <form onInvalidCapture={event=>localizeValidation(event.target,locale,t)} onInputCapture={event=>clearValidation(event.target)} onSubmit={handleSubmit} id="workforce-enquiry" aria-labelledby="workforce-enquiry-title" aria-busy={status === "sending"} className={styles.form}>
      <div className={styles.formHeader}>
        <h3 id="workforce-enquiry-title">{t(title)}</h3>
        <p>{t(introduction)}</p>
      </div>
      <div className={styles.formBody}>
        <div className={styles.fields}>
          <label className={styles.label}>
            <span>{t("Work email (required)")}</span>
            <input type="email" required autoComplete="email" name="email" value={formData.email} onChange={event => setFormData(previous => ({ ...previous, email: event.target.value }))} className={styles.input} placeholder={t("you@company.com")} />
          </label>
          <label className={styles.label}>
            <span>{t("Your name ")}<span className={styles.optional}>{t("(optional)")}</span></span>
            <input autoComplete="name" name="name" value={formData.name} onChange={event => setFormData(previous => ({ ...previous, name: event.target.value }))} className={styles.input} placeholder={t("Your name")} />
          </label>
          <label className={[styles.label, styles.wide].join(" ")}>
            <span>{t(contextLabel)} <span className={styles.optional}>{t("(required)")}</span></span>
            <textarea required name="context" aria-describedby="workforce-enquiry-help" value={formData.context} onChange={event => setFormData(previous => ({ ...previous, context: event.target.value }))} className={[styles.input, styles.textarea].join(" ")} placeholder={t(placeholder)} />
          </label>
        </div>
        <p id="workforce-enquiry-help" className={styles.help}>{t(help)}</p>
        {error && <p className={[styles.message, styles.error].join(" ")} role="alert">{t(error)}</p>}
        {status === "success" && <p className={[styles.message, styles.success].join(" ")} role="status">{t("Enquiry received. We’ll contact you to discuss your requirement and next steps.")}</p>}
        <button type="submit" disabled={status === "sending"} className={styles.submit}>{t(status === "sending" ? "Sending…" : submitLabel)}<ArrowRight size={18} aria-hidden="true" /></button>
        <p className={styles.privacy}>{t("We use your enquiry to reply. ")}<Link locale={locale} href="/privacy-policy">{t("Privacy policy")}</Link></p>
      </div>
    </form>
  );
}
