"use client";

import { motion } from "framer-motion";
import { FaLinkedin, FaInstagram, FaFacebook } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="w-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-[var(--foreground)] py-12 px-6">
      <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Quick Links */}
        <motion.div
          className="flex flex-col gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        >
          <h3 className="text-2xl font-semibold">Quick Links</h3>
          <ul className="space-y-2">
            <li><a href="/about" className="hover:underline">About Us</a></li>
            <li><a href="/contact" className="hover:underline">Contact</a></li>
            <li><a href="/faq" className="hover:underline">FAQs</a></li>
            <li><a href="/privacy-policy" className="hover:underline">Privacy Policy</a></li>
            <li><a href="/terms-conditions" className="hover:underline">Terms & Conditions</a></li>
          </ul>
        </motion.div>

        {/* Social Media Icons */}
        <motion.div
          className="flex gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        >
          <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
            <FaLinkedin size={30} className="hover:text-[var(--primary)] transition duration-300 ease-in-out" />
          </a>
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
            <FaInstagram size={30} className="hover:text-[var(--primary)] transition duration-300 ease-in-out" />
          </a>
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
            <FaFacebook size={30} className="hover:text-[var(--primary)] transition duration-300 ease-in-out" />
          </a>
        </motion.div>

        {/* Copyright Information */}
        <motion.div
          className="text-center md:text-right"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        >
          <p>&copy; {new Date().getFullYear()} Rovari. All Rights Reserved.</p>
        </motion.div>
      </div>
    </footer>
  );
}
