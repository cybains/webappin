"use client";

import { useState } from "react";

export default function HowItWorks() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [resume, setResume] = useState<File | null>(null);
  const [linkedin, setLinkedin] = useState("");
  const [query, setQuery] = useState("");

  const isContactValid = email.trim() || phone.trim();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isContactValid) {
      alert("Please provide either a phone number or email address.");
      return;
    }

    // You can replace this with actual form submission logic
    alert("Form submitted! We'll be in touch soon.");
  };

  return (
    <section className="w-full bg-white py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10">How It Works</h2>

        {/* Step by Step Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Step 1 */}
          <div>
            <h3 className="text-xl font-semibold mb-2">Step 1: Provide Contact Information</h3>
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
          </div>

          {/* Step 2 */}
          <div>
            <h3 className="text-xl font-semibold mb-2">Step 2: Share Additional Information</h3>
            <div className="space-y-4">
              <input
                type="file"
                onChange={(e) => setResume(e.target.files?.[0] || null)}
                className="w-full"
              />
              <input
                type="url"
                placeholder="LinkedIn Profile (optional)"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              />
              <textarea
                placeholder="Your query or specific needs..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg min-h-[100px]"
              />
            </div>
          </div>

          {/* Step 3 */}
          <div className="text-center">
            <button
              type="submit"
              className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800"
            >
              Submit and Get Started
            </button>
          </div>
        </form>

        {/* Visual Steps */}
        <div className="mt-16 flex flex-col md:flex-row justify-between items-center text-center gap-8">
          <div className="flex-1">
            <div className="text-5xl mb-2">📥</div>
            <p>Intake Form</p>
          </div>
          <div className="text-2xl">➡️</div>
          <div className="flex-1">
            <div className="text-5xl mb-2">🧠</div>
            <p>Expert Analysis</p>
          </div>
          <div className="text-2xl">➡️</div>
          <div className="flex-1">
            <div className="text-5xl mb-2">📈</div>
            <p>Personalized Advice</p>
          </div>
        </div>
      </div>
    </section>
  );
}
