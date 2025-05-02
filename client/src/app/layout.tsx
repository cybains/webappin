import Link from "next/link";
import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/navbar"; // ✅ New import
import Hero from "@/components/hero";
import SearchMe from "@/components/SearchMe";

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
        <Navbar /> {/* ✅ Modular header */}
        <Hero />
        <SearchMe />
        {children}
      </body>
    </html>
  );
}
