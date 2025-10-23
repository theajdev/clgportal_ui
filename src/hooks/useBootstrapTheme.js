// src/hooks/useBootstrapTheme.js
import { useEffect, useState } from "react";

export default function useBootstrapTheme() {
  const [storedTheme, setStoredThemeState] = useState(() => {
    return localStorage.getItem("theme") || "auto";
  });

  const [resolvedTheme, setResolvedTheme] = useState(() => {
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    return isDark ? "dark" : "light";
  });

  useEffect(() => {
    const getSystemTheme = () =>
      window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";

    const setTheme = (themeValue) => {
      const resolved = themeValue === "auto" ? getSystemTheme() : themeValue;

      document.documentElement.setAttribute("data-mdb-theme", resolved);
      setStoredThemeState(themeValue);
      setResolvedTheme(resolved);
    };

    // Initialize on mount
    const initial = localStorage.getItem("theme") || "auto";
    setTheme(initial);

    // Handle user clicks
    const toggles = document.querySelectorAll("[data-mdb-theme-value]");
    toggles.forEach((toggle) => {
      const listener = () => {
        const val = toggle.getAttribute("data-mdb-theme-value");
        localStorage.setItem("theme", val);
        setTheme(val);
      };
      toggle.addEventListener("click", listener);
    });

    // Listen for system theme change
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (localStorage.getItem("theme") === "auto") {
        setTheme("auto");
      }
    };
    mq.addEventListener("change", handleChange);

    return () => {
      mq.removeEventListener("change", handleChange);
    };
  }, []);

  // 👇 Return both values so component knows if it's "auto"
  return { storedTheme, resolvedTheme };
}
