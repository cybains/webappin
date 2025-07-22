
import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/navbar"; // ✅ New import



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
        
        {children}
      </body>
    </html>
  );
}
