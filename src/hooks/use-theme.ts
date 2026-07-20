"use client";

import { useCallback, useEffect, useState } from "react";

const THEME_KEY = "myschoolpadi:theme";
type Theme = "light" | "dark";

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

/** Real, persisted (localStorage) dark-mode toggle — the `.dark` CSS tokens already exist in globals.css, this just drives the class. */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const stored = window.localStorage.getItem(THEME_KEY) as Theme | null;
    setTheme(stored ?? "light");
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((current) => {
      const next = current === "dark" ? "light" : "dark";
      window.localStorage.setItem(THEME_KEY, next);
      applyTheme(next);
      return next;
    });
  }, []);

  return { theme, isDark: theme === "dark", toggleTheme };
}
