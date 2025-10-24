"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaFacebook, FaTiktok } from "react-icons/fa6";
import ThemeToggle from "./ThemeToggle";

export default function Footer() {
  return (
    <footer className="w-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-[var(--foreground)] py-16 px-8">
      <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
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
        </motion.div>

        {/* Social Media */}
        <motion.div
          className="flex flex-col gap-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h3 className="text-xl font-semibold mb-2">Follow Us</h3>
          <div className="flex gap-6">
            <a
              href="https://www.facebook.com/TransEuroCareers"
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
        </motion.div>

        {/* Powered By */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
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
          </ul>
        </motion.div>

        {/* Brand Ethos */}
        <motion.div
          className="text-sm flex flex-col justify-between"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
        >
          <div>
            <p className="mb-4">Helping you relocate without rage-quitting since 2025.</p>
          </div>
          <p className="text-xs text-gray-200">
            © 2025 UAB Skillaxis. Built with optimism, maintained with paperwork.
          </p>
        </motion.div>
      </div>

      <div className="mt-10 flex justify-center">
        <ThemeToggle />
      </div>
    </footer>
  );
}
