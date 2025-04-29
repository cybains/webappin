export default function Home() {
  return (
    <main className="min-h-screen text-gray-900 bg-white">
      {/* Hero Section */}
      <section className="text-center px-6 py-12 bg-blue-50">
        <h2 className="text-2xl font-semibold mb-3">Move Abroad with Confidence</h2>
        <p className="mb-6 text-base">Consultations, Job Matching, Visa Help & Relocation Support</p>
        <button className="bg-blue-600 text-white px-5 py-2 rounded-md">
          Book a Consultation
        </button>
      </section>

      {/* Services Section */}
      <section id="services" className="px-6 py-10">
        <h3 className="text-xl font-bold mb-4">Our Services</h3>
        <div className="space-y-4 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6 md:space-y-0">
          <div className="p-4 border rounded shadow-sm">Visa Assistance</div>
          <div className="p-4 border rounded shadow-sm">Job Matching</div>
          <div className="p-4 border rounded shadow-sm">Relocation Support</div>
        </div>
      </section>

      {/* Country Profiles */}
      <section id="countries" className="px-6 py-10 bg-gray-50">
        <h3 className="text-xl font-bold mb-4">Explore Country Profiles</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 border rounded">Germany</div>
          <div className="p-4 border rounded">Netherlands</div>
          <div className="p-4 border rounded">Sweden</div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 py-10">
        <h3 className="text-xl font-bold mb-4">What Our Clients Say</h3>
        <blockquote className="text-sm italic border-l-4 pl-4">
          “This service helped me land a job in Berlin and handle all my paperwork easily.”
        </blockquote>
      </section>

      {/* Call to Action */}
      <section className="px-6 py-10 text-center bg-blue-100">
        <h3 className="text-xl font-semibold mb-4">Ready to Start Your Journey?</h3>
        <button className="bg-blue-700 text-white px-5 py-2 rounded-md">
          Schedule a Free Call
        </button>
      </section>

      {/* You can skip footer here since it's global too if added in layout.tsx */}
    </main>
  );
}
