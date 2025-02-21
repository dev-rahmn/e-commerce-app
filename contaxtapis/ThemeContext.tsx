// ThemeContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Appearance } from "react-native";

export type Theme = "light" | "dark";

interface ThemeContextProps {
  theme: Theme;
  toggleTheme: () => void;
  bgColor: string;
  textColor: string;
}

const ThemeContext = createContext<ThemeContextProps>({
  theme: "light",
  toggleTheme: () => {},
  bgColor: "white",
  textColor: "black",
});

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children } : ThemeProviderProps) => {
  // Initialize using the system color scheme
  const systemTheme = Appearance.getColorScheme() || "light";
  const [theme, setTheme] = useState<Theme>(systemTheme as Theme);

  useEffect(() => {
    // Listen for changes to the system theme
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setTheme(colorScheme === "dark" ? "dark" : "light");
    });
    return () => subscription.remove();
  }, []);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  const bgColor = theme === "light" ? "white" : "black";    // white : black
  const textColor = theme === "light" ? "black" : "white";  // black : white

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, bgColor, textColor }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
