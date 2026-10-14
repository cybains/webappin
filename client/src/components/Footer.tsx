import React from "react";
import Link from "next/link";

import { FaFacebook, FaTiktok } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="w-full bg-[var(--card)] border-t border-[color:var(--card-border)] text-[var(--foreground)] py-16 px-8">
      <div className="border-t border-[color:var(--card-border)]/60 mb-10" />
      <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/about" className="hover:underline">
                About Us
              </Link>
            </li>
            <li>
            <Link href="/#contact" className="hover:underline">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/methodology" className="hover:underline">
                Methodology
              </Link>
            </li>
            <li>
              <Link href="/privacy-policy" className="hover:underline">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms-conditions" className="hover:underline">
                Terms & Conditions
              </Link>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div
          className="flex flex-col gap-4"
        >
          <h3 className="text-xl font-semibold mb-2">Follow Us</h3>
          <div className="flex gap-6">
            <a
              href="https://www.facebook.com/profile.php?id=61588526631352"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="hover:text-[var(--accent)] transition"
            >
              <FaFacebook size={24} />
            </a>
            <a
              href="https://www.tiktok.com/@skillaxis?_t=ZN-8zJdztVDMko&_r=1"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="hover:text-[var(--accent)] transition"
            >
              <FaTiktok size={24} />
            </a>
          </div>
        </div>

        {/* Powered By */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Powered By</h3>
          <ul className="text-sm space-y-2">
            <li>
              <span className="font-semibold">Remotive API</span>: remote jobs, zero fluff.
            </li>
            <li>
              <span className="font-semibold">MapLibre</span>: maps with open-source manners.
            </li>
            <li>
              <span className="font-semibold">WorldData API</span>: global country & economic insights.
            </li>
            <li>
              <Link
                href="/countries"
                className="no-underline text-inherit hover:text-inherit"
              >
                <span className="font-semibold">Data Coverage</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Brand Ethos */}
        <div
          className="text-sm flex flex-col justify-between"
        >
          <div>
            <p className="mb-4">Helping you relocate without rage-quitting since 2025.</p>
          </div>
          <div className="mt-6 w-full">
            <div className="py-4 text-center text-sm">
              <p
                className="text-[var(--foreground)]"
                style={{ textShadow: "0 1px 3px rgba(15, 23, 42, 0.6)" }}
              >
                © {new Date().getFullYear()} UAB Skillaxis, trading as Sufoniq · Vilnius, Lithuania · Vienna, Austria · <a href="mailto:support@sufoniq.com" className="underline underline-offset-4">support@sufoniq.com</a>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto mt-10 border-t border-[color:var(--card-border)] pt-6 flex justify-center md:justify-end">
        <a
          href="https://amuidesign.org"
          aria-label="Developed by AMUI Design"
          className="inline-flex min-h-11 items-center gap-4 rounded-sm text-sm text-[var(--muted)] transition-colors hover:text-[var(--foreground)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--primary)]"
        >
          <span>Developed by:</span>
          <span
            aria-hidden="true"
            className="block h-[42px] w-[101px] shrink-0 bg-current"
            style={{
              maskImage: "url('/amui-logo.png')",
              WebkitMaskImage: "url('/amui-logo.png')",
              maskSize: "contain",
              WebkitMaskSize: "contain",
              maskRepeat: "no-repeat",
              WebkitMaskRepeat: "no-repeat",
              maskPosition: "center",
              WebkitMaskPosition: "center",
            }}
          />
        </a>
      </div>
    </footer>
  );
}
