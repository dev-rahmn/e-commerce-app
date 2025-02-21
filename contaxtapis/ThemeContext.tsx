import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Appearance } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    // Load stored theme from AsyncStorage
    const loadTheme = async () => {
      const storedTheme = await AsyncStorage.getItem("theme");
      if (storedTheme) {
        setTheme(storedTheme as Theme);
      } else {
        // If no theme is stored, use system theme
        const systemTheme = Appearance.getColorScheme() || "light";
        setTheme(systemTheme as Theme);
      }
    };
    loadTheme();
  }, []);

  useEffect(() => {
    // Listen for system theme changes
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setTheme(colorScheme === "dark" ? "dark" : "light");
    });
    return () => subscription.remove();
  }, []);

  const toggleTheme = async () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    await AsyncStorage.setItem("theme", newTheme); // Save theme in AsyncStorage
  };

  const bgColor = theme === "light" ? "white" : "black";  
  const textColor = theme === "light" ? "black" : "white";  

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, bgColor, textColor }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
