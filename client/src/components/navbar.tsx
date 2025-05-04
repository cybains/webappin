"use client";  // Add this directive to mark the component as a client component

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  // Toggle mobile menu
  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header className="w-full border-b" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
      <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-center justify-between px-4 py-4">
        
        {/* Logo + Company Name in a Link */}
        <Link href="/" className="flex items-center space-x-3 md:justify-start">
          <img src="/logo.svg" alt="Rovari Logo" className="h-10 w-auto" />
          <span className="text-3xl font-bold" style={{ color: 'var(--foreground)' }}>Rovari</span>
        </Link>
  
        {/* Hamburger Icon for Mobile (Visible on smaller screens) */}
        <button
          className="md:hidden text-3xl"
          onClick={toggleMenu}
          aria-label="Toggle Menu"
          style={{ color: 'var(--foreground)' }}
        >
          {isOpen ? "X" : "☰"}
        </button>
  
        {/* Navigation */}
        <nav className={`mt-4 md:mt-0 ${isOpen ? "block" : "hidden"} md:block`}>
          <ul className="flex flex-wrap justify-center md:justify-end gap-4 md:gap-8 text-sm md:text-base font-medium">
            <li><a href="#services" className="hover:text-primary" style={{ color: 'var(--foreground)' }}>Services</a></li>
            <li><a href="#countries" className="hover:text-primary" style={{ color: 'var(--foreground)' }}>Countries</a></li>
            <li><a href="#resources" className="hover:text-primary" style={{ color: 'var(--foreground)' }}>Blog</a></li>
            <li><a href="#about" className="hover:text-primary" style={{ color: 'var(--foreground)' }}>About Us</a></li>
            <li><a href="#contact" className="hover:text-primary" style={{ color: 'var(--foreground)' }}>Contact</a></li>
            <li>
              <a
                href="#client-portal"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-primary text-white hover:bg-secondary px-4 py-2 text-sm"
                style={{ backgroundColor: 'var(--primary)', color: 'white' }}
              >
                Client Portal
              </a>
            </li>
          </ul>
        </nav>
      </div>
  
      {/* Mobile Menu (Visible when isOpen is true) */}
      <div className={`overlay ${isOpen ? "open" : ""}`} onClick={toggleMenu}></div> {/* Overlay */}
      {isOpen && (
        <div className={`mobile-menu ${isOpen ? "open" : ""}`}>
          <ul className="space-y-4 text-center" style={{ color: 'var(--foreground)' }}>
            <li><a href="#services" className="hover:text-primary">Services</a></li>
            <li><a href="#countries" className="hover:text-primary">Countries</a></li>
            <li><a href="#resources" className="hover:text-primary">Blog</a></li>
            <li><a href="#about" className="hover:text-primary">About Us</a></li>
            <li><a href="#contact" className="hover:text-primary">Contact</a></li>
            <li>
              <a
                href="#client-portal"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-primary text-white hover:bg-secondary px-4 py-2 text-sm"
                style={{ backgroundColor: 'var(--primary)', color: 'white' }}
              >
                Client Portal
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
