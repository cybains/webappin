"use client";

import { motion } from "framer-motion";
import { FaLinkedin, FaInstagram, FaFacebook } from "react-icons/fa";

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
            <li><a href="/about" className="hover:underline">About Us</a></li>
            <li><a href="/contact" className="hover:underline">Contact</a></li>
            <li><a href="/faq" className="hover:underline">FAQs</a></li>
            <li><a href="/privacy-policy" className="hover:underline">Privacy Policy</a></li>
            <li><a href="/terms-conditions" className="hover:underline">Terms & Conditions</a></li>
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
            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
              <FaLinkedin size={24} className="hover:text-[var(--accent)] transition" />
            </a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
              <FaInstagram size={24} className="hover:text-[var(--accent)] transition" />
            </a>
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
              <FaFacebook size={24} className="hover:text-[var(--accent)] transition" />
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
          <p className="text-xs text-gray-200">&copy; {new Date().getFullYear()} Inquos. All rights reserved.</p>
        </motion.div>

      </div>
    </footer>
  );
}
