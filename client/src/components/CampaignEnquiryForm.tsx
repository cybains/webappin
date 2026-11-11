"use client";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import Link from "./LocalizedLink";
import { useTranslation, localizeValidation, clearValidation } from "@/lib/i18n/client";
import { campaignFields, campaignCopy, type CampaignKind } from "@/lib/campaign-fields";
import { campaignMessage, validateCampaign } from "@/lib/campaign-enquiry";
import styles from "./EmployerPanels.module.css";
import campaignStyles from "./CampaignEnquiryForm.module.css";

export default function CampaignEnquiryForm({ kind }: { kind: CampaignKind }) {
  const { locale, t } = useTranslation();
  const [fields, setFields] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const copy = campaignCopy[kind], prefix = `${kind}-campaign`;
  const update = (key: string, value: string) => { setFields(previous => ({ ...previous, [key]: value })); if (status === "success") setStatus("idle"); };
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    const invalid = validateCampaign(kind, fields);
    if (invalid) { setError(invalid); setStatus("error"); return; }
    setStatus("sending"); setError("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: fields.company?.trim() || "Employer", email: fields.email.trim(), subject: t(copy.subject), message: campaignMessage(kind, fields, locale) }),
      });
      const result = await response.json();
      if (!response.ok || result.ok !== true) throw new Error("Enquiry not accepted");
      setFields({}); setStatus("success");
    } catch {
      setError("We couldn’t send your enquiry. Please try again, or use the email or WhatsApp links beside this form."); setStatus("error");
    }
  }
  return (
    <form onSubmit={submit} onInvalidCapture={event => localizeValidation(event.target, locale, t)} onInputCapture={event => clearValidation(event.target)} className={styles.form} aria-labelledby={`${prefix}-title`} aria-busy={status === "sending"}>
      <div className={styles.formHeader}><h3 id={`${prefix}-title`}>{t(copy.title)}</h3><p>{t(copy.introduction)}</p></div>
      <div className={styles.formBody}>
        <fieldset disabled={status === "sending"}>
          <legend className="sr-only">{t(copy.title)}</legend>
          <div className={`${styles.fields} ${campaignStyles.fields}`}>
            {campaignFields[kind].map(field => <label key={field.key} className={[styles.label, field.options ? styles.wide : ""].join(" ")}>
              <span>{t(field.label)} <span className={styles.optional}>{t(field.required ? "(required)" : "(optional)")}</span></span>
              {field.options ? <select name={field.key} className={styles.input} value={fields[field.key] || ""} onChange={event => update(field.key, event.target.value)}><option value="">{t("To discuss")}</option>{field.options.map(([value, label]) => <option key={value} value={value}>{t(label)}</option>)}</select>
                : <input name={field.key} type={field.type || "text"} required={field.required} maxLength={field.type === "email" ? 254 : 180} min={field.type === "number" ? 1 : undefined} max={field.type === "number" ? 9999 : undefined} step={field.type === "number" ? 1 : undefined} inputMode={field.type === "number" ? "numeric" : undefined} autoComplete={field.key === "email" ? "email" : field.key === "company" ? "organization" : field.key === "country" ? "country-name" : undefined} placeholder={field.placeholder ? t(field.placeholder) : undefined} value={fields[field.key] || ""} onChange={event => update(field.key, event.target.value)} className={styles.input} />}
            </label>)}
            <label className={`${styles.label} ${styles.wide}`}><span>{t(copy.notes)} <span className={styles.optional}>{t("(optional)")}</span></span><textarea name="notes" maxLength={2200} aria-describedby={`${prefix}-help`} placeholder={t(copy.placeholder)} className={`${styles.input} ${styles.textarea}`} value={fields.notes || ""} onChange={event => update("notes", event.target.value)} /></label>
          </div>
        </fieldset>
        <p id={`${prefix}-help`} className={styles.help}>{t("Please leave out candidate names, licence scans and other personal documents.")}</p>
        {status === "error" && <p className={`${styles.message} ${styles.error}`} role="alert">{t(error)}</p>}
        {status === "success" && <p className={`${styles.message} ${styles.success}`} role="status">{t(copy.success)}</p>}
        <button type="submit" disabled={status === "sending"} className={styles.submit}>{t(status === "sending" ? "Sending…" : copy.submit)}<ArrowRight size={18} className="shrink-0" aria-hidden="true" /></button>
        <p className={styles.privacy}>{t("We use your enquiry to reply. ")}<Link locale={locale} href="/privacy-policy">{t("Privacy policy")}</Link></p>
      </div>
    </form>
  );
}
