"use client";

import { useState } from "react";

const categories = [
  "Job Seeker",
  "Digital Nomad",
  "Entrepreneur",
  "Expat Family",
];

export default function SearchMe() {
  const [query, setQuery] = useState("");

  const handleGo = () => {
    if (!query.trim()) return;
    // You can replace this with actual navigation logic
    alert(`Navigating to results for: ${query}`);
  };

  return (
    <section className="w-full bg-gray-100 py-12 px-4">
      <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-start gap-8">
        {/* Categories */}
        <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-visible">
          {categories.map((cat) => (
            <button
              key={cat}
              className="min-w-max px-4 py-2 bg-white shadow-md rounded-full hover:bg-blue-100 text-sm font-medium"
              onClick={() => setQuery(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="flex-1">
          <label className="block mb-2 text-lg font-semibold text-gray-700">What are you looking for?</label>
          <div className="relative">
            <input
              type="text"
              placeholder="e.g., Job opportunities in Lisbon"
              className="w-full px-4 py-3 pr-20 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ cursor: 'url("/rover-cursor.png"), auto' }} // Add this image to /public
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              className="absolute top-1/2 right-2 -translate-y-1/2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
              onClick={handleGo}
            >
              Go
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
