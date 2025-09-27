// src/hooks/useBootstrapTheme.js
import { useEffect } from "react";

export default function useBootstrapTheme() {
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
      if (theme === "auto") {
        document.documentElement.setAttribute(
          "data-mdb-theme",
          window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light"
        );
      } else {
        document.documentElement.setAttribute("data-mdb-theme", theme);
      }
    };

    const showActiveTheme = (theme, focus = false) => {
      const themeSwitcher = document.querySelector("#bd-theme");
      if (!themeSwitcher) return;

      const themeSwitcherText = document.querySelector("#bd-theme-text");
      const activeThemeIcon = document.querySelector(".theme-icon-active use");
      const btnToActive = document.querySelector(
        `[data-mdb-theme-value="${theme}"]`
      );
      const svgOfActiveBtn = btnToActive
        ?.querySelector("svg use")
        ?.getAttribute("href");

      document.querySelectorAll("[data-mdb-theme-value]").forEach((el) => {
        el.classList.remove("active");
        el.classList.remove("text-primary");
        el.setAttribute("aria-pressed", "false");
      });

      if (btnToActive) {
        btnToActive.classList.add("active");
        btnToActive.classList.add("text-primary");
        btnToActive.setAttribute("aria-pressed", "true");
        if (activeThemeIcon && svgOfActiveBtn) {
          activeThemeIcon.setAttribute("href", svgOfActiveBtn);
        }

        const themeSwitcherLabel = `${themeSwitcherText.textContent} (${theme})`;
        themeSwitcher.setAttribute("aria-label", themeSwitcherLabel);
        if (focus) themeSwitcher.focus();
      }
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
      const storedTheme = getStoredTheme();
      if (storedTheme !== "light" && storedTheme !== "dark") {
        const newTheme = getPreferredTheme();
        setTheme(newTheme);
        showActiveTheme(newTheme);
      }
    };

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", handleThemeChange);

    return () => {
      mediaQuery.removeEventListener("change", handleThemeChange);
    };
  }, []);
}
