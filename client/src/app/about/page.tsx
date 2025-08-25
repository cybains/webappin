import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <>
      <main className="max-w-5xl mx-auto px-6 py-16 text-base leading-relaxed">
      <h1 className="text-4xl font-bold mb-10">About Us</h1>

      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
        <p className="mb-4">
          Sufoniq started with a simple idea: the future of work isn’t a shouting match, it’s a well-organized playlist. No static, no buzzwords—just straightforward, useful guidance. Think less rock concert, more curated Spotify mix.
        </p>
        <p>
          Imagine a rover—not a dog, don’t get excited—roaming Mars, collecting data point by point. That’s the vibe we’re going for. We help you navigate the chaos of today’s work world with a bit of calm, a dash of wit, and a healthy dose of common sense.
        </p>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
        <p>
          Our goal? To give job seekers, digital nomads, entrepreneurs, and expat families advice so clear and tailored, you’ll wonder how you managed before. The world changes fast, but finding your spot in it shouldn’t feel like rocket science. We’re here to help you figure it out—no fuss, just results. Onwards and upwards.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Our Technology Partners</h2>
        <p className="mb-4">
          To deliver on this mission, we collaborate with innovative tech partners who provide the tools and data we rely on:
        </p>
        <ul className="list-disc pl-6 space-y-3 mb-4">
          <li>
            <strong>Remotives API:</strong> Bringing you access to a wide range of remote job opportunities across industries and geographies.
          </li>
          <li>
            <strong>MapLibre:</strong> Powering our interactive maps with accurate, open-source geographic data to support your relocation and remote work decisions.
          </li>
          <li>
            <strong>World Bank API:</strong> Supplying global development and economic data for broader context.
          </li>
        </ul>
        <p>
          Together, these partners enable us to cut through the noise and deliver clear, aligned guidance — helping you take confident steps toward your future.
        </p>
      </section>
      </main>
      <Footer />
    </>
  );
}
