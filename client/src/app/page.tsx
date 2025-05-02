import Hero from "@/components/hero";
import SearchMe from "@/components/SearchMe";
import HowItWorks from "@/components/HowItWorks";
import coreservices from "@/components/coreServices";
import testimonials from "@/components/testimonials";
import khub from "@/components/khub";
import footer from "@/components/footer";



export default function Home() {
  return (
    <main className="min-h-screen bg-backgroundLight text-textLight dark:bg-backgroundDark dark:text-textDark">
      {/* Hero Section */}
      <Hero />
        <SearchMe />
        <HowItWorks />
        <coreservices />
        <testimonials />
        <khub />
        <footer />
    
    </main>
  );
}
