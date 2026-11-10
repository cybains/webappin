"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown, Globe2 } from "lucide-react";
import { useTranslation } from "@/lib/i18n/client";
import { languageOptions, localizedHref } from "@/lib/i18n/shared";

export default function LanguageSwitcher({ pathname, onOpen }: { pathname: string; onOpen: () => void }) {
  const { locale, t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [suffix, setSuffix] = useState("");
  const container = useRef<HTMLElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const current = languageOptions.find(language => language.code === locale)!;

  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => {
      if (!container.current?.contains(event.target as Node)) setOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
      }
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);

  function show() {
    setSuffix(window.location.search + window.location.hash);
    onOpen();
    setOpen(true);
  }

  return (
    <nav ref={container} aria-label={t("Switch language")} className="relative shrink-0"
      onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false); }}>
      <button ref={trigger} type="button" aria-expanded={open} aria-controls={panelId}
        aria-label={`${t("Choose language")}: ${current.name}`}
        onClick={() => open ? setOpen(false) : show()}
        onKeyDown={event => {
          if (event.key === "ArrowDown") {
            event.preventDefault();
            show();
            requestAnimationFrame(() => container.current?.querySelector<HTMLAnchorElement>("ul a")?.focus());
          }
        }}
        className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl border px-3 text-xs font-semibold text-[var(--foreground)] transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 ${open ? "border-slate-300 bg-slate-100" : "border-[color:var(--card-border)] bg-transparent"}`}>
        <Globe2 className="h-4 w-4 text-slate-500" aria-hidden="true" />
        <span>{current.code.toUpperCase()}</span>
        <ChevronDown className={`h-3.5 w-3.5 text-slate-500 motion-safe:transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true" />
      </button>
      {open && (
        <div id={panelId} className="absolute right-0 top-full z-50 mt-2 w-52 max-w-[calc(100vw-2rem)] rounded-2xl border border-[color:var(--card-border)] bg-[var(--background)] p-2 shadow-[0_12px_32px_rgba(15,23,42,0.12)]">
          <p className="px-3 pb-2 pt-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">{t("Language")}</p>
          <ul className="space-y-1">
            {languageOptions.map(language => {
              const destination = localizedHref(pathname, language.code);
              const available = language.code === "en" || destination !== pathname;
              const selected = language.code === locale;
              const label = <><span className="flex-1">{language.name}</span><span className="text-[11px] text-slate-500">{language.code.toUpperCase()}</span>{selected ? <Check className="h-4 w-4 text-primary" aria-hidden="true" /> : <span className="w-4" aria-hidden="true" />}</>;
              const classes = `flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${selected ? "bg-slate-100 font-semibold text-[var(--foreground)]" : "text-slate-600 hover:bg-slate-100 hover:text-[var(--foreground)]"}`;
              return <li key={language.code}>{available ? (
                <a href={destination + suffix} hrefLang={language.code} lang={language.code} aria-current={selected ? "page" : undefined} className={classes} onClick={() => setOpen(false)}>{label}</a>
              ) : (
                <button type="button" disabled title={t("Not available for this page")} className={`${classes} cursor-not-allowed opacity-45`}>{label}</button>
              )}</li>;
            })}
          </ul>
        </div>
      )}
    </nav>
  );
}
