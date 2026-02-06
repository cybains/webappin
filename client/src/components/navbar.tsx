"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";

import Link from "next/link";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Use Cases", href: "/use-cases" },
  { label: "Insights", href: "/insights" },
  { label: "Employers", href: "/employers" },
  { label: "Method & Trust", href: "/method-trust" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/#contact" },
];

const scrollToContact = () => {
  const contactSection = document.getElementById("contact");
  if (contactSection) {
    contactSection.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }
  window.location.href = "/#contact";
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname() ?? "/";

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href.startsWith("/#")) return pathname === "/";
    return pathname === href;
  };

  return (
    <header
      className="w-full sticky top-0 z-50 border-b border-[color:var(--card-border)] bg-[var(--background)]"
      style={{ fontFamily: "var(--font-sans)" }}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        {/* Wordmark */}
        <Link href="/" className="text-[var(--foreground)]">
          <span className="text-base font-medium tracking-[0.05em]">SUFONIQ</span>
        </Link>

        {/* Centered nav */}
        <nav className="hidden flex-1 justify-center md:flex">
          <ul className="flex items-center justify-center gap-5 text-sm font-medium text-slate-600">
            {navItems.map(({ label, href }) => (
              <li key={label}>
                <Link
                  href={href}
                  className={`px-2 py-1 text-sm font-medium border-b-2 transition duration-200 ${
                    isActive(href)
                      ? "border-[color:var(--foreground)] text-[var(--foreground)]"
                      : "border-transparent hover:border-slate-300 hover:text-[var(--foreground)]"
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* CTA + mobile toggle */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={scrollToContact}
            className="hidden rounded-xl border border-[color:var(--card-border)] px-3 py-1 text-sm font-medium text-[var(--foreground)] transition hover:bg-[var(--card-border)]/60 md:inline-flex"
          >
            Request access
          </button>
          <button
            className="md:hidden text-3xl focus:outline-none"
            onClick={toggleMenu}
            aria-label="Toggle Menu"
          >
            {isOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <nav
        className={`${
          isOpen ? "block" : "hidden"
        } md:hidden border-t border-[color:var(--card-border)] bg-[var(--background)] px-6 py-4`}
      >
        <ul className="flex flex-col gap-3 text-sm font-medium">
          {navItems.map(({ label, href }) => (
            <li key={label}>
              <Link
                href={href}
                className="block w-full rounded-lg px-3 py-2 transition hover:bg-[var(--accent)]/10 hover:text-[var(--secondary)]"
              >
                {label}
              </Link>
            </li>
          ))}
          <li>
            <button
              type="button"
              onClick={scrollToContact}
              className="w-full rounded-lg border border-[color:var(--border)] px-3 py-2 text-left font-semibold text-[var(--foreground)] transition hover:bg-[var(--accent)]/10 hover:text-[var(--secondary)]"
            >
              Request access
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
}
