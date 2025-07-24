"use client";

import { useState } from "react"; // ✅

import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen((prev) => {
      const newState = !prev;
      if (typeof window !== "undefined") {
        document.body.classList.toggle("hide-hero", newState);
      }
      return newState;
    });
  };

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
      className="w-full sticky top-0 z-50 shadow-sm backdrop-blur-sm border-b border-gray-200"
      style={{
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
        fontFamily: "var(--font-sans)",
      }}
    >
      {/* Wrapper */}
      <div className="w-full flex flex-row items-center justify-between px-5 py-3 md:py-2">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-4 md:justify-start">
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
          className="md:hidden text-3xl focus:outline-none z-50"
          onClick={toggleMenu}
          aria-label="Toggle Menu"
        >
          {isOpen ? "✕" : "☰"}
        </button>

        {/* Nav Links */}
        <nav
          className={`${
            isOpen ? "block" : "hidden"
          } fixed top-16 left-4 right-4 rounded-xl bg-white/70 backdrop-blur-lg shadow-lg shadow-black/10 transition-all duration-300 ease-in-out z-40
            md:static md:block md:w-auto md:bg-transparent md:shadow-none md:rounded-none md:backdrop-blur-0`}
        >
          <ul className="flex flex-col md:flex-row items-start md:items-start gap-6 md:gap-8 text-sm md:text-base font-medium px-6 py-6 md:p-0">
            {navItems.map(({ label, href }) => (
              <li key={label} className="w-full md:w-auto">
                <a
                  href={href}
                  className="block w-full text-gray-700 md:text-gray-500 px-4 py-2 md:px-0 md:py-0 transition duration-200 hover:bg-[var(--accent)] hover:text-white md:hover:bg-transparent md:hover:text-[var(--secondary)] md:hover:underline"
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
