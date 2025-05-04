"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const categories = [
  "Job Seeker",
  "Digital Nomad",
  "Entrepreneur",
  "Expat Family",
];

export default function SearchMe() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleGo = () => {
    if (!query.trim()) return;
    // You can replace this with actual navigation logic
    alert(`Navigating to results for: ${query}`);
  };

  return (
    <section
      className="w-full py-12 px-6"
      style={{
        background: "var(--backgroundSecondary)", // Light to dark gradient for dynamic theme
      }}
    >
      <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-center gap-8">
        {/* Left half: Dropdown Menu */}
        <motion.div
          className="flex-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        >
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-5 py-4 rounded-lg border border-gray-300 text-gray-800 bg-white focus:ring-2 focus:ring-indigo-400 focus:outline-none transition-all duration-300 ease-in-out"
            style={{
              backgroundColor: "var(--backgroundCard)",
              color: "var(--foreground)", // Adjusting text color for consistency with theme
            }}
          >
            <option value="" disabled>Select a category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </motion.div>

        {/* Right half: Search Bar and Go Button */}
        <motion.div
          className="flex items-center gap-4 flex-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        >
          <div className="flex-1">
            <motion.input
              type="text"
              placeholder="Type in"
              className="w-full px-5 py-4 pr-16 rounded-lg border border-gray-300 text-gray-800 bg-white focus:ring-2 focus:ring-indigo-400 focus:outline-none transition-all duration-300 ease-in-out"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                cursor: "pointer", // Temporary custom cursor style
                backgroundColor: "var(--backgroundCard)", // Adjust background based on theme
                color: "var(--foreground)", // Adjust text color based on theme
              }}
              whileFocus={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Search Me! Button */}
          <motion.button
            className="bg-indigo-600 text-white px-6 py-4 rounded-lg shadow-lg hover:bg-indigo-700 transition duration-300 ease-in-out"
            onClick={handleGo}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            style={{
              backgroundColor: "var(--primary)", // Primary color for button
              borderColor: "var(--primary)", // Border color matches the theme
            }}
          >
            Search Me!
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
