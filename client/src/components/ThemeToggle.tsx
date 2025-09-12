"use client";

import { useEffect, useState } from "react";
import { applyTheme } from "@/lib/theme";

type Mode = "light" | "dark";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Mode>("light");

  // On first load, pick stored or system, then APPLY ONCE via attribute only
  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = (localStorage.getItem("theme") as Mode | null);
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const preferred: Mode = stored ?? (systemPrefersDark ? "dark" : "light");

    setTheme(preferred);
    applyTheme(preferred);              // <- attribute only, removes .dark
    localStorage.setItem("theme", preferred);
  }, []);

  const toggleTheme = () => {
    const next: Mode = theme === "light" ? "dark" : "light";
    setTheme(next);
    applyTheme(next);                   // <- attribute only, removes .dark
    localStorage.setItem("theme", next);
  };

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      className={`relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none ${
        theme === "dark" ? "bg-[var(--secondary)]" : "bg-gray-300"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-300 ${
          theme === "dark" ? "translate-x-6 bg-[var(--primary)]" : ""
        }`}
      />
    </button>
  );
}
