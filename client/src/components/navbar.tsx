"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";

import Link from "@/components/LocalizedLink";
import {useTranslation} from "@/lib/i18n/client";
import {englishPath,localizedHref,type Locale} from "@/lib/i18n/shared";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Home", href: "/" },
  { label: "For employers", href: "/employers" },
  { label: "For job seekers", href: "/work-in-europe" },
  { label: "About us", href: "/about" },
  { label: "Method & Trust", href: "/method-trust" },
  { label: "Insights", href: "/insights" },
  { label: "Contact", href: "/#contact" },
];

const scrollToContact = (locale: Locale) => {
  const contactSection = document.getElementById("driver-enquiry") ?? document.getElementById("employer-enquiry") ?? document.getElementById("seasonal-enquiry") ?? document.getElementById("job-seeker-enquiry") ?? document.getElementById("contact");
  if (contactSection) {
    contactSection.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }
  window.location.href = localizedHref("/#contact",locale);
};

export default function Navbar() {
  const {locale,t}=useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const actualPath=usePathname() ?? "/";
  const pathname = englishPath(actualPath);

  const contactTargets: Record<string, string> = { "/work-in-europe": "job-seeker-enquiry", "/employers": "employer-enquiry", "/truck-driver-recruitment": "driver-enquiry", "/austria-seasonal-workers": "seasonal-enquiry" };
  const contactTarget = contactTargets[pathname];
  const visibleItems=navItems;
  const pageNavItems = contactTarget
    ? visibleItems.map(item => item.label === "Contact" ? { ...item, href: `${pathname}#${contactTarget}` } : item)
    : visibleItems;

  const primaryLabel=locale !== "en" && pathname === "/work-in-europe" ? t("Ask for support") : t("Discuss a role");
  const navLabel = (label: string) => t(locale !== "en"
    ? ({ "For employers": "Employers", "For job seekers": "Job seekers", "Method & Trust": "Our approach" }[label] ?? label)
    : label);
  const toggleMenu = () => setIsOpen((prev) => !prev);
  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href.includes("#")) return false;
    return pathname === href;
  };

  return (
    <header
      className="w-full sticky top-0 z-50 border-b border-[color:var(--card-border)] bg-[var(--background)]"
      style={{ fontFamily: "var(--font-sans)" }}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-6">
        {/* Wordmark */}
        <Link locale={locale} href="/" className="shrink-0 text-[var(--foreground)]">
          <span className="text-base font-medium tracking-[0.05em]">SUFONIQ</span>
        </Link>

        {/* Centered nav */}
        <nav className={`hidden min-w-0 flex-1 justify-center xl:flex`} aria-label={t("Main navigation")}>
          <ul className={`flex items-center justify-center ${locale !== "en" ? "gap-1" : "gap-5"} text-sm font-medium text-slate-600`}>
            {pageNavItems.map(({ label, href }) => (
              <li key={label} className="shrink-0">
                <Link locale={locale}
                  href={href}
                  className={`inline-flex min-h-11 items-center whitespace-nowrap px-2 py-1 text-sm font-medium border-b-2 transition duration-200 ${
                    isActive(href)
                      ? "border-[color:var(--foreground)] text-[var(--foreground)]"
                      : "border-transparent hover:border-slate-300 hover:text-[var(--foreground)]"
                  }`}
                >
                  {navLabel(label)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* CTA + mobile toggle */}
        <div className="flex shrink-0 items-center gap-3">

          <div className="hidden xl:block"><Button
            type="button"
            size="lg"
            onClick={() => { setIsOpen(false); scrollToContact(locale); }}
            className="items-center justify-center whitespace-nowrap rounded-2xl text-base"
          >{primaryLabel}</Button></div>
          <button
            className={`flex h-11 w-11 items-center justify-center xl:hidden text-3xl focus-visible:outline-2 focus-visible:outline-offset-4`}
            onClick={toggleMenu}
            aria-label={t(isOpen ? "Close menu" : "Open menu")}
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
          >
            {isOpen ? "✕" : "☰"}
          </button>
          <LanguageSwitcher key={actualPath} pathname={pathname} onOpen={() => setIsOpen(false)} />
        </div>
      </div>

      {/* Mobile menu */}
      <nav
        id="mobile-navigation"
        aria-label={t("Mobile navigation")}
        className={`${
          isOpen ? "block" : "hidden"
        } xl:hidden border-t border-[color:var(--card-border)] bg-[var(--background)] px-6 py-4`}
      >
        <ul className="flex flex-col gap-3 text-sm font-medium">
          {pageNavItems.map(({ label, href }) => (
            <li key={navLabel(label)}>
              <Link locale={locale}
                href={href}
                onClick={() => setIsOpen(false)}
                className="block w-full rounded-lg px-3 py-2 transition hover:bg-[var(--accent)]/10 hover:text-[var(--secondary)]"
              >
                {navLabel(label)}
              </Link>
            </li>
          ))}
          <li>
            <Button
              type="button"
              size="lg"
              onClick={() => {setIsOpen(false);scrollToContact(locale);}}
              className="w-full whitespace-nowrap rounded-2xl text-base"
            >{primaryLabel}</Button>
          </li>
        </ul>
      </nav>
    </header>
  );
}
