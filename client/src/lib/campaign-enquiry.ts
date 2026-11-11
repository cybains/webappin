import { campaignFields, type CampaignKind } from "./campaign-fields";
import { localizedHref, type Locale } from "./i18n/shared";

export function validateCampaign(kind: CampaignKind, fields: Record<string, string>) {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email?.trim() ?? "")) return "Enter a valid business email.";
  if (campaignFields[kind].some(field => field.required && !fields[field.key]?.trim())) return "Please complete the required fields.";
  if (fields.headcount && (!/^\d+$/.test(fields.headcount) || Number(fields.headcount) < 1 || Number(fields.headcount) > 9999)) return "Enter a whole number between 1 and 9999.";
  return null;
}

export function campaignMessage(kind: CampaignKind, fields: Record<string, string>, locale: Locale) {
  const path = kind === "seasonal" ? "/austria-seasonal-workers" : "/truck-driver-recruitment";
  return [
    `Language: ${locale}`,
    ...campaignFields[kind].map(field => {
      const value = fields[field.key]?.trim();
      const meaning = field.options?.find(option => option[0] === value)?.[1];
      return `${field.label}: ${meaning || value || "To discuss"}`;
    }),
    `Additional context: ${fields.notes?.trim() || "Not supplied"}`,
    `Source: https://sufoniq.com${localizedHref(path, locale)}`,
  ].join("\n");
}
