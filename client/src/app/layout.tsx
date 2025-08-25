
import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/navbar"; // ✅ Modular header
import ThemeToggle from "@/components/ThemeToggle";



export const metadata: Metadata = {
  title: "SUFONIQ",
  description: "Relocate without the panic — jobs, advice, and a plan that actually makes sense.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Navbar />
        <ThemeToggle />
        {children}
      </body>
    </html>
  );
}
