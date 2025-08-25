
import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/navbar"; // ✅ Modular header



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
      <body className="antialiased flex min-h-screen flex-col">
        <Navbar />

        <div className="flex-1">{children}</div>
      </body>
    </html>
  );
}
