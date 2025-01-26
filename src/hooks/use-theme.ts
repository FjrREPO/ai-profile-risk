import { useEffect, useMemo, useState } from "react";

const ThemeProps = {
  key: "theme",
  light: "light",
  dark: "dark",
} as const;

type Theme = typeof ThemeProps.light | typeof ThemeProps.dark;

export const useTheme = (defaultTheme?: Theme) => {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem(ThemeProps.key) as Theme | null;
      return storedTheme || (defaultTheme ?? ThemeProps.light);
    }
    return defaultTheme ?? ThemeProps.light;
  });

  const isDark = useMemo(() => theme === ThemeProps.dark, [theme]);
  const isLight = useMemo(() => theme === ThemeProps.light, [theme]);

  const _setTheme = (newTheme: Theme) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(ThemeProps.key, newTheme);
      document.documentElement.classList.remove(ThemeProps.light, ThemeProps.dark);
      document.documentElement.classList.add(newTheme);
      setTheme(newTheme);
    }
  };

  const setLightTheme = () => _setTheme(ThemeProps.light);
  const setDarkTheme = () => _setTheme(ThemeProps.dark);
  const toggleTheme = () => theme === ThemeProps.dark ? setLightTheme() : setDarkTheme();

  useEffect(() => {
    const initialTheme = localStorage.getItem(ThemeProps.key) as Theme | null;
    if (initialTheme) {
      _setTheme(initialTheme);
    } else {
      _setTheme(theme);
    }
  }, []);

  return { theme, isDark, isLight, setLightTheme, setDarkTheme, toggleTheme };
};