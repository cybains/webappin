export default function Home() {
  return (
    <main className="min-h-screen bg-backgroundLight text-textLight dark:bg-backgroundDark dark:text-textDark">
      {/* Hero Section */}
      <section className="text-center px-6 py-12 bg-primaryAccentLight dark:bg-primaryAccentDark">
      <h2 className="text-4xl font-semibold mb-4 text-primary dark:text-primary">
  Move Abroad with Confidence
</h2>
        <p className="mb-6 text-lg text-secondaryAccentLight dark:text-secondaryAccentDark">
          Consultations, Job Matching, Visa Help & Relocation Support
        </p>
        <button className="bg-textLight text-backgroundLight px-6 py-3 rounded-lg hover:opacity-90 transition duration-200 dark:bg-textDark dark:text-backgroundDark">
          Book a Consultation
        </button>
      </section>

      {/* Services Section */}
      <section id="services" className="px-6 py-10 bg-backgroundLight dark:bg-backgroundDark">
        <h3 className="text-3xl font-bold mb-8 text-center">Our Services</h3>
        <div className="space-y-4 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6 md:space-y-0">
          <div className="p-6 border rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-center bg-white dark:bg-[#1f1f1f]">
            <h4 className="font-semibold text-lg mb-3">Visa Assistance</h4>
            <p className="text-secondaryAccentLight dark:text-secondaryAccentDark">
              Helping you with visa applications, documentation, and more.
            </p>
          </div>
          <div className="p-6 border rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-center bg-white dark:bg-[#1f1f1f]">
            <h4 className="font-semibold text-lg mb-3">Job Matching</h4>
            <p className="text-secondaryAccentLight dark:text-secondaryAccentDark">
              Connecting you with job opportunities abroad.
            </p>
          </div>
          <div className="p-6 border rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-center bg-white dark:bg-[#1f1f1f]">
            <h4 className="font-semibold text-lg mb-3">Relocation Support</h4>
            <p className="text-secondaryAccentLight dark:text-secondaryAccentDark">
              Guiding you through your move and settling in.
            </p>
          </div>
        </div>
      </section>

      {/* Country Profiles */}
      <section id="countries" className="px-6 py-10 bg-gray-100 dark:bg-[#121212]">
        <h3 className="text-3xl font-bold mb-8 text-center">Explore Country Profiles</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-6 border rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-[#1f1f1f] text-center">
            <img src="/germany-flag.png" alt="Germany" className="w-20 mx-auto mb-4" />
            <h4 className="font-semibold text-lg">Germany</h4>
          </div>
          <div className="p-6 border rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-[#1f1f1f] text-center">
            <img src="/netherlands-flag.png" alt="Netherlands" className="w-20 mx-auto mb-4" />
            <h4 className="font-semibold text-lg">Netherlands</h4>
          </div>
          <div className="p-6 border rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-[#1f1f1f] text-center">
            <img src="/sweden-flag.png" alt="Sweden" className="w-20 mx-auto mb-4" />
            <h4 className="font-semibold text-lg">Sweden</h4>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 py-10 bg-backgroundLight dark:bg-backgroundDark">
        <h3 className="text-3xl font-bold mb-8 text-center">What Our Clients Say</h3>
        <blockquote className="text-sm italic border-l-4 pl-4 border-gray-400 dark:border-gray-600">
          “This service helped me land a job in Berlin and handle all my paperwork easily.”
        </blockquote>
      </section>

      {/* Call to Action */}
      <section className="px-6 py-10 text-center bg-primaryAccentLight dark:bg-primaryAccentDark">
        <h3 className="text-3xl font-semibold mb-6">Ready to Start Your Journey?</h3>
        <button className="bg-textLight text-backgroundLight px-6 py-3 rounded-lg hover:opacity-90 transition duration-200 dark:bg-textDark dark:text-backgroundDark">
          Schedule a Free Call
        </button>
      </section>
    </main>
  );
}
