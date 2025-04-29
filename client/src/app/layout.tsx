import Link from "next/link";

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rovari",
  description: "Move abroad with confidence – consultations, jobs, relocation & more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
      <header className="w-full border-b bg-white">
  <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-center justify-between px-4 py-4">
    
    {/* ✅ Logo + Company Name in a Link */}
    <Link href="/" className="flex items-center space-x-3">
      <img src="/logo.svg" alt="Rovari Logo" className="h-10 w-auto" />
      <span className="text-3xl font-bold text-black-900">rovari</span>
    </Link>

    {/* Navigation */}
    <nav className="mt-4 md:mt-0">
      <ul className="flex flex-wrap justify-center md:justify-end gap-4 md:gap-8 text-sm md:text-base font-medium text-gray-700">
        <li><a href="#services" className="hover:text-blue-600">Services</a></li>
        <li><a href="#countries" className="hover:text-blue-600">Countries</a></li>
        <li><a href="#resources" className="hover:text-blue-600">Blog</a></li>
        <li><a href="#about" className="hover:text-blue-600">About Us</a></li>
        <li><a href="#contact" className="hover:text-blue-600">Contact</a></li>
        <li>
          <a
            href="#client-portal"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-black text-white hover:bg-gray-800 px-4 py-2 text-sm"
          >
            Client Portal
          </a>
        </li>
      </ul>
    </nav>
  </div>
</header>

        {children}
      </body>
    </html>
  );
}
