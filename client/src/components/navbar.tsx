"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);

  const navItems = [
    { label: "Services", href: "#services" },
    { label: "Countries", href: "#countries" },
    { label: "Blog", href: "#resources" },
    { label: "About Us", href: "#about" },
    { label: "Contact", href: "#contact" },
    { label: "Client Portal", href: "#client-portal" },
  ];

  return (
    <header
      className="w-full border-b"
      style={{
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
        fontFamily: "var(--font-sans)",
      }}
    >
      <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-center justify-between px-4 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3 md:justify-start">
          <img src="/logo.svg" alt="Rovari Logo" className="h-10 w-auto" />
          <span className="text-3xl font-bold" style={{ color: "var(--foreground)" }}>
            Rovari
          </span>
        </Link>

        {/* Hamburger for Mobile */}
        <button
          className="md:hidden text-3xl"
          onClick={toggleMenu}
          aria-label="Toggle Menu"
          style={{ color: "var(--foreground)" }}
        >
          {isOpen ? "✕" : "☰"}
        </button>

        {/* Nav Links */}
        <nav className={`mt-4 md:mt-0 ${isOpen ? "block" : "hidden"} md:block`}>
          <ul className="flex flex-wrap justify-center md:justify-end gap-4 md:gap-8 text-sm md:text-base font-medium">
            {navItems.map(({ label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  className="transition-all duration-200 hover:scale-105"
                  style={{
                    color: "var(--foreground)",
                    textDecoration: "none",
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.color = "var(--secondary)")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.color = "var(--foreground)")
                  }
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
