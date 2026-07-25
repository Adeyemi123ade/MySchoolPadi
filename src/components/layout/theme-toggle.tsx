"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/providers/theme-provider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Button
      type="button"
      variant="secondary"
      onClick={toggleTheme}
      aria-pressed={isDark}
      className="justify-start gap-2"
    >
      {isDark ? <Moon className="size-4" /> : <Sun className="size-4" />}
      {isDark ? "Dark mode" : "Light mode"}
    </Button>
  );
}
