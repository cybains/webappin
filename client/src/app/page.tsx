import Hero from "@/components/Hero";
import SearchMe from "@/components/SearchMe";
import HowItWorks from "@/components/HowItWorks";
import CoreServices from "@/components/CoreServices";

import Footer from "@/components/Footer";




export default function Home() {
  return (
    <main className="min-h-screen bg-backgroundLight text-textLight dark:bg-backgroundDark dark:text-textDark">
      {/* Hero Section */}
      <section id="hero">
        <Hero />
      </section>

      {/* Demographic Picker / Search Me Section */}
      <section id="search-me">
        <SearchMe />
      </section>

      {/* How It Works Section */}
      <section id="how-it-works">
        <HowItWorks />
      </section>

      {/* Core Services Section */}
      <section id="services">
        <CoreServices />
      </section>

      {/* Footer Section */}
      <footer id="footer">
        <Footer />
      </footer>

     
    </main>
  );
}
