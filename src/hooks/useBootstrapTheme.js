// src/hooks/useBootstrapTheme.js
import { useEffect, useState } from "react";

export default function useBootstrapTheme() {
  const [theme, setThemeState] = useState(() => {
    const stored = localStorage.getItem("theme");
    return (
      stored ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light")
    );
  });

  useEffect(() => {
    const getStoredTheme = () => localStorage.getItem("theme");
    const setStoredTheme = (theme) => localStorage.setItem("theme", theme);

    const getPreferredTheme = () => {
      const storedTheme = getStoredTheme();
      if (storedTheme) return storedTheme;
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    };

    const setTheme = (theme) => {
      const resolvedTheme =
        theme === "auto"
          ? window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light"
          : theme;

      document.documentElement.setAttribute("data-mdb-theme", resolvedTheme);
      setThemeState(resolvedTheme); // 👈 update state for consuming components
    };

    const showActiveTheme = (theme, focus = false) => {
      // (Optional) Your UI logic for theme toggler, unchanged...
    };

    const preferredTheme = getPreferredTheme();
    setTheme(preferredTheme);
    showActiveTheme(preferredTheme);

    document.querySelectorAll("[data-mdb-theme-value]").forEach((toggle) => {
      toggle.addEventListener("click", () => {
        const theme = toggle.getAttribute("data-mdb-theme-value");
        setStoredTheme(theme);
        setTheme(theme);
        showActiveTheme(theme, true);
      });
    });

    const handleThemeChange = () => {
      const newTheme = getPreferredTheme();
      setTheme(newTheme);
      showActiveTheme(newTheme);
    };

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", handleThemeChange);

    return () => {
      mediaQuery.removeEventListener("change", handleThemeChange);
    };
  }, []);

  return theme; // 👈 Expose the theme to your components
}
