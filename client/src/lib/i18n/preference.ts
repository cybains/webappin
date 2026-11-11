import type { Locale } from "./shared";

export const LANGUAGE_COOKIE = "sufoniq-language";
export const LANGUAGE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export function savedLanguage(value: string | undefined): Locale | undefined {
  return value === "en" || value === "de" || value === "cs" || value === "pl" ? value : undefined;
}

export function countryLanguage(country: string | null): Locale {
  switch (country?.toUpperCase()) {
    case "CZ": return "cs";
    case "PL": return "pl";
    case "DE":
    case "AT": return "de";
    default: return "en";
  }
}
