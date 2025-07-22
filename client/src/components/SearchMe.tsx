"use client";

import { useState } from "react";
import { SendHorizonal } from "lucide-react";

const categories = ["Job Seeker", "Digital Nomad", "Entrepreneur", "Expat Family"];

export default function SearchMe() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [chat, setChat] = useState<{ user: string; bot: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const handleGo = async () => {
    if (!query.trim()) return;
    const currentQuery = query;
    setQuery("");
    setLoading(true);

    setChat((prev) => [...prev, { user: currentQuery, bot: "" }]);

    try {
      const res = await fetch("http://localhost:5000/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: currentQuery, category: selectedCategory }),
      });

      const data = await res.json();
      setChat((prev) =>
        prev.map((msg, i) =>
          i === prev.length - 1 ? { ...msg, bot: data.response } : msg
        )
      );
    } catch (error) {
      console.error("API error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full py-12 px-6 bg-[var(--backgroundSecondary)]">
      <div className="max-w-2xl mx-auto flex flex-col gap-6">
        {/* Category Selector */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-[var(--backgroundCard)] text-[var(--foreground)] focus:ring-2 focus:ring-indigo-400"
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

        {/* Chat Bubbles */}
        <div className="bg-[var(--backgroundCard)] rounded-xl p-6 h-[300px] overflow-y-auto flex flex-col gap-4 shadow-inner">
          {chat.map((entry, index) => (
            <div key={index}>
              <div className="text-right">
                <p className="bg-indigo-100 text-indigo-800 inline-block p-3 rounded-xl rounded-tr-none max-w-[80%]">
                  {entry.user}
                </p>
              </div>
              <div className="text-left mt-2">
                <p className="bg-gray-100 text-gray-800 inline-block p-3 rounded-xl rounded-tl-none max-w-[80%]">
                  {entry.bot}
                </p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="text-left">
              <p className="inline-block bg-gray-100 text-gray-600 p-3 rounded-xl rounded-tl-none max-w-[80%] animate-pulse">
                Searching...
              </p>
            </div>
          )}
        </div>

        {/* Chat Input */}
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={query}
            placeholder="Ask me anything..."
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleGo()}
            className="flex-1 px-4 py-3 rounded-full border border-gray-300 bg-[var(--backgroundCard)] text-[var(--foreground)] focus:ring-2 focus:ring-indigo-400"
          />
          <button
            onClick={handleGo}
            className="p-3 rounded-full bg-indigo-600 hover:bg-indigo-500 transition text-white"
          >
            <SendHorizonal size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}
