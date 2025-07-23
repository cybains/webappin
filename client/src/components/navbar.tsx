"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);

  const navItems = [
    { label: "Jobs", href: "/jobs" },
    { label: "Services", href: "#services" },
    { label: "Countries", href: "#countries" },
    { label: "Blog", href: "#resources" },
    { label: "About Us", href: "#about" },
    { label: "Contact", href: "#contact" },
    { label: "Client Portal", href: "#client-portal" },
  ];

  return (
    <header
      className="w-full shadow-sm backdrop-blur-sm sticky top-0 z-50"

      style={{
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
        fontFamily: "var(--font-sans)",
      }}
    >
      <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-center pl-0 pr-6 py-3 md:py-2">


        {/* Logo */}
        <Link href="/" className="flex items-center space-x-4 md:justify-start -ml-8">

          <Image
            src="/Asset 1.png"
            alt="Sufoniq Logo"
            width={32}
            height={32}
            className="h-8 w-auto"
          />
          <Image
            src="/Asset 3.png"
            alt="Sufoniq"
            width={90}
            height={10}
            className="h-5 w-auto -ml-2 mt-1"
          />
        </Link>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-3xl focus:outline-none"
          onClick={toggleMenu}
          aria-label="Toggle Menu"
        >
          {isOpen ? "✕" : "☰"}
        </button>

        {/* Nav Links */}
        <nav
          className={`flex-grow w-full md:w-auto transition-all duration-300 ease-in-out mt-1 md:ml-7 ${
            isOpen ? "block mt-4" : "hidden md:block"
        }`}
      >

          <ul className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8 text-sm md:text-base font-medium">

            {navItems.map(({ label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  className="text-gray-500 transition-colors duration-200 hover:text-[var(--secondary)]"
                  style={{ // or 'Inter, sans-serif'
                    textDecoration: "none",
                  }}
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
