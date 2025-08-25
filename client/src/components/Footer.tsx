"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { FaLinkedin, FaInstagram, FaFacebook } from "react-icons/fa";
import ThemeToggle from "./ThemeToggle";

export default function Footer() {
  // State & refs for running icons and messages
  const [runningIcon, setRunningIcon] = useState<null | number>(null); // which icon is running
  const [message, setMessage] = useState<string | null>(null);

  const iconRefs = [
    useRef<HTMLAnchorElement>(null),
    useRef<HTMLAnchorElement>(null),
    useRef<HTMLAnchorElement>(null),
  ];

  const originalPositions = useRef<{ x: number; y: number }[]>([
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
  ]);

  const animationFrameId = useRef<number | null>(null);
  const stopTimeout = useRef<NodeJS.Timeout | null>(null);

  // Position & velocity for animation
  const position = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const velocity = useRef<{ vx: number; vy: number }>({ vx: 0, vy: 0 });

  // Generate random velocity vector
  function getRandomVelocity() {
    const speed = 8; // tweak speed here
    const angle = Math.random() * 2 * Math.PI;
    return {
      vx: speed * Math.cos(angle),
      vy: speed * Math.sin(angle),
    };
  }

  // Start the runaway animation for icon at index
  const startRunning = (index: number) => {
    if (runningIcon !== null) return; // only one at a time

    const iconEl = iconRefs[index].current;
    if (!iconEl) return;

    // Save original position (viewport relative)
    const rect = iconEl.getBoundingClientRect();
    originalPositions.current[index] = { x: rect.left, y: rect.top };

    position.current = { x: rect.left, y: rect.top };
    velocity.current = getRandomVelocity();

    setRunningIcon(index);
    setMessage(null);

    const animate = () => {
      position.current.x += velocity.current.vx;
      position.current.y += velocity.current.vy;

      // Bounce off window edges
      const padding = 10;
      const iconWidth = iconEl.offsetWidth;
      const iconHeight = iconEl.offsetHeight;

      if (position.current.x < padding || position.current.x > window.innerWidth - padding - iconWidth) {
        velocity.current.vx = -velocity.current.vx;
        position.current.x = Math.min(Math.max(position.current.x, padding), window.innerWidth - padding - iconWidth);
      }
      if (position.current.y < padding || position.current.y > window.innerHeight - padding - iconHeight) {
        velocity.current.vy = -velocity.current.vy;
        position.current.y = Math.min(Math.max(position.current.y, padding), window.innerHeight - padding - iconHeight);
      }

      // Apply styles to icon for position
      if (iconEl) {
        iconEl.style.position = "fixed";
        iconEl.style.left = position.current.x + "px";
        iconEl.style.top = position.current.y + "px";
        iconEl.style.zIndex = "9999";
        iconEl.style.transition = "none";
        iconEl.style.pointerEvents = "auto";
      }

      animationFrameId.current = requestAnimationFrame(animate);
    };

    animate();

    // Stop animation after 6 seconds automatically
    stopTimeout.current = setTimeout(() => stopRunning(index), 6000);
  };

  // Stop animation and show witty message
  const stopRunning = (index: number) => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
    if (stopTimeout.current) {
      clearTimeout(stopTimeout.current);
      stopTimeout.current = null;
    }

    const iconEl = iconRefs[index].current;
    if (!iconEl) return;

    // Animate back to original place
    iconEl.style.transition = "all 0.5s ease";
    iconEl.style.left = originalPositions.current[index].x + "px";
    iconEl.style.top = originalPositions.current[index].y + "px";

    setTimeout(() => {
      if (iconEl) {
        iconEl.style.position = "";
        iconEl.style.left = "";
        iconEl.style.top = "";
        iconEl.style.zIndex = "";
        iconEl.style.transition = "";
      }
    }, 500);

    // Witty messages for each icon
    let witty = "";
    if (index === 0) witty = "We were never that into that particular social media.";
    else if (index === 1) witty = "I never got the idea of taking pictures of food and posting online.";
    else if (index === 2) witty = "You should definitely try the last one!";

    setMessage(witty);

    // Clear after 5 seconds
    setTimeout(() => {
      setMessage(null);
      setRunningIcon(null);
    }, 5000);
  };

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
            <li><a href="/methodology" className="hover:underline">Methodology</a></li>
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
          <div className="flex gap-6 relative">
            {[FaLinkedin, FaInstagram, FaFacebook].map((Icon, idx) => (
              <a
                key={idx}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (runningIcon === idx) {
                    stopRunning(idx);
                  } else {
                    startRunning(idx);
                  }
                }}
                ref={iconRefs[idx]}
                className="cursor-pointer"
                aria-label={["LinkedIn", "Instagram", "Facebook"][idx]}
                style={{
                  position: runningIcon === idx ? "fixed" : "static",
                  zIndex: runningIcon === idx ? 9999 : "auto",
                }}
              >
                <Icon size={24} className="hover:text-[var(--accent)] transition" />
              </a>
            ))}
          </div>
          {message && (
            <div className="mt-2 text-yellow-300 font-semibold text-center animate-fadeIn">
              {message}
            </div>
          )}
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
          <p className="text-xs text-gray-200">&copy; {new Date().getFullYear()} UAB SkillAxis. All rights reserved.</p>
        </motion.div>
      </div>

      <div className="mt-10 flex justify-center">
        <ThemeToggle />
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease forwards;
        }
      `}</style>
    </footer>
  );
}
