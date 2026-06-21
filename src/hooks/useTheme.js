import { useEffect, useState } from "react";

export function useTheme() {
  const [theme, setTheme] = useState(() => localStorage.getItem("leapstart-theme") || "light");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("leapstart-theme", theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  }

  return { theme, toggleTheme };
}
