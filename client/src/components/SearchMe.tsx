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
  const [response, setResponse] = useState(""); // To store the response from API
  const [loading, setLoading] = useState(false); // To handle loading state

  const handleGo = async () => {
    if (!query.trim()) return;
    
    setLoading(true);  // Set loading to true when API call starts
    
    try {
      // Sending a POST request to Flask API
      const res = await fetch("http://localhost:5000/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: query,
          category: selectedCategory,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setResponse(data.response);  // Update response state with API response
      } else {
        console.error("Failed to fetch data from API");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);  // Set loading to false after API call is complete
    }
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
            <option value="" disabled>
              Select a category
            </option>
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
            className="bg-indigo-600 text-white px-6 py-4 rounded-lg shadow-lg transition duration-300 ease-in-out"
            onClick={handleGo}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            style={{
              backgroundColor: "var(--primary)", // Primary color for button
              borderColor: "var(--primary)", // Border color matches the theme
              transition: "background-color 0.3s ease", // Adding a smooth transition
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = "var(--secondary)"} // Amber hover effect
            onMouseLeave={(e) => e.target.style.backgroundColor = "var(--primary)"} // Reset to primary
          >
            {loading ? "Loading..." : "Search Me!"}
          </motion.button>
        </motion.div>
      </div>

      {/* Display API response */}
      {response && (
        <div className="mt-6 text-lg font-semibold">
          <p>{response}</p>
        </div>
      )}
    </section>
  );
}
