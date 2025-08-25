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
      className="w-full sticky top-0 z-50 border-b ring-brand backdrop-blur-md"
      /* translucent glass that adapts to theme */
      style={{
        background: "color-mix(in srgb, var(--background) 82%, transparent)",
        color: "var(--foreground)",
        fontFamily: "var(--font-sans)",
      }}
    >
      {/* Wrapper */}
      <div className="w-full flex flex-row items-center justify-between px-5 py-3 md:py-2">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-4 md:justify-start">
          <Image
            src="/Asset 1.png"
            alt="Sufoniq Logo"
            width={32}
            height={32}
            className="h-8 w-auto brightness-110 contrast-125
                       dark:brightness-125 dark:contrast-125
                       dark:drop-shadow-[0_0_8px_rgba(14,165,233,0.45)]"
            priority
          />
          <Image
            src="/Asset 3.png"
            alt="Sufoniq"
            width={90}
            height={10}
            className="h-5 w-auto -ml-2 mt-1 brightness-110 contrast-125
                       dark:brightness-125 dark:contrast-125
                       dark:drop-shadow-[0_0_8px_rgba(14,165,233,0.4)]"
            priority
          />
        </Link>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-3xl focus:outline-none z-50 rounded px-2 py-1"
          onClick={toggleMenu}
          aria-label="Toggle Menu"
          style={{
            /* subtle focus ring that matches theme tokens */
            boxShadow:
              "0 0 0 1px color-mix(in srgb, var(--ring) 45%, transparent)",
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
          /* use the same glassy surface as the rest of the app */
          style={{
            background: isOpen
              ? "color-mix(in srgb, var(--card) 88%, transparent)"
              : "transparent",
            border: isOpen ? "1px solid var(--border)" : "none",
            backdropFilter: isOpen ? "blur(10px) saturate(120%)" : "none",
            WebkitBackdropFilter: isOpen ? "blur(10px) saturate(120%)" : "none",
          }}
        >
          <ul className="flex flex-col md:flex-row items-start md:items-start gap-6 md:gap-8 text-sm md:text-base font-medium px-6 py-6 md:p-0">
            {navItems.map(({ label, href }) => {
              const isInternal = href.startsWith("/");
              const baseLinkClasses =
                "block w-full px-4 py-2 md:px-0 md:py-0 transition duration-200 rounded-md md:rounded-none";
              const baseLinkStyle: React.CSSProperties = {
                color: "color-mix(in srgb, var(--foreground) 78%, transparent)",
              };
              const hoverStyle: React.CSSProperties = {
                color: "var(--secondary)",
              };

              return (
                <li key={label} className="w-full md:w-auto">
                  {isInternal ? (
                    <Link
                      href={href}
                      className={baseLinkClasses}
                      style={baseLinkStyle}
                      onMouseEnter={(e) =>
                        ((e.currentTarget.style.color as any) = "var(--secondary)")
                      }
                      onMouseLeave={(e) =>
                        ((e.currentTarget.style.color as any) =
                          "color-mix(in srgb, var(--foreground) 78%, transparent)")
                      }
                    >
                      {label}
                    </Link>
                  ) : (
                    <a
                      href={href}
                      className={baseLinkClasses}
                      style={baseLinkStyle}
                      onMouseEnter={(e) =>
                        ((e.currentTarget.style.color as any) = "var(--secondary)")
                      }
                      onMouseLeave={(e) =>
                        ((e.currentTarget.style.color as any) =
                          "color-mix(in srgb, var(--foreground) 78%, transparent)")
                      }
                    >
                      {label}
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
