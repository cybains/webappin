"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        document.body.classList.toggle("hide-hero", next);
      }
      return next;
    });
  };

  const navItems = [
    { label: "Jobs", href: "/jobs" },
    { label: "Services", href: "/#services" },
    { label: "Countries", href: "/countries" },
    { label: "Blog", href: "#resources" },
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/#contact" },
    { label: "Client Portal", href: "#client-portal" },
  ];

  return (
    <header
      className="w-full sticky top-0 z-50 border-b backdrop-blur-md ring-brand"
      style={{
        background: "color-mix(in srgb, var(--background) 92%, transparent)",
        color: "var(--foreground)",
        fontFamily: "var(--font-sans)",
      }}
    >
      <div className="w-full flex flex-row items-center justify-between px-5 py-3 md:py-2">
        {/* Logo (no glow, slight clarity) */}
        <Link href="/" className="flex items-center gap-3 md:justify-start">
          <Image
            src="/Asset 1.png"
            alt="Sufoniq Logo"
            width={32}
            height={32}
            priority
            className="h-8 w-auto"
            style={{ filter: "contrast(1.12) brightness(1.08) saturate(1.05)" }}
          />
          <Image
            src="/Asset 3.png"
            alt="Sufoniq"
            width={96}
            height={18}
            priority
            className="-ml-1 mt-0.5 h-5 w-auto"
            style={{ filter: "contrast(1.12) brightness(1.08) saturate(1.05)" }}
          />
        </Link>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-3xl focus:outline-none z-50 rounded px-2 py-1"
          onClick={toggleMenu}
          aria-label="Toggle Menu"
          style={{
            boxShadow: "0 0 0 1px color-mix(in srgb, var(--ring) 45%, transparent)",
          }}
        >
          {isOpen ? "✕" : "☰"}
        </button>

        {/* Nav Links */}
        <nav
          className={`${
            isOpen ? "block" : "hidden"
          } fixed top-16 left-4 right-4 rounded-xl shadow-lg transition-all duration-300 ease-in-out z-40
             md:static md:block md:w-auto md:shadow-none md:rounded-none`}
          style={{
            background: isOpen
              ? "color-mix(in srgb, var(--card) 92%, transparent)"
              : "transparent",
            border: isOpen ? "1px solid var(--border)" : "none",
            backdropFilter: isOpen ? "blur(8px) saturate(115%)" : "none",
            WebkitBackdropFilter: isOpen ? "blur(8px) saturate(115%)" : "none",
          }}
        >
          <ul className="flex flex-col md:flex-row items-start md:items-start gap-6 md:gap-8 text-sm md:text-base font-medium px-6 py-6 md:p-0">
            {navItems.map(({ label, href }) => (
              <li key={label} className="w-full md:w-auto">
                {href.startsWith("/") ? (
                  <Link
                    href={href}
                    className="block w-full px-4 py-2 md:px-0 md:py-0 rounded-md md:rounded-none transition-colors duration-150 hover:underline md:hover:underline hover:text-[var(--secondary)]"
                    style={{ color: "color-mix(in srgb, var(--foreground) 82%, transparent)" }}
                  >
                    {label}
                  </Link>
                ) : (
                  <a
                    href={href}
                    className="block w-full px-4 py-2 md:px-0 md:py-0 rounded-md md:rounded-none transition-colors duration-150 hover:underline md:hover:underline hover:text-[var(--secondary)]"
                    style={{ color: "color-mix(in srgb, var(--foreground) 82%, transparent)" }}
                    rel="noreferrer"
                  >
                    {label}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
