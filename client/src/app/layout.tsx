import { siteMetadata } from "@/lib/seo";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/Footer";
const geist = localFont({ src: "./fonts/Geist-Variable.woff2", weight: "100 900", display: "swap", variable: "--font-geist", fallback: ["Arial"] });

export const metadata = siteMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={geist.variable}
      data-theme="light"
      style={{ transitionProperty: "none", marginRight: 0 }}
    >
      <body className="antialiased flex min-h-screen flex-col">
        <Navbar />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
