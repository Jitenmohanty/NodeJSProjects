import { createContext, useContext, useEffect, useState } from "react";

// Define the color themes
const colorThemes = [
  { light: "#F3E5C3", dark: "#174E4F" },
  { light: "#F87060", dark: "#102542" },
  { light: "#F8FFE5", dark: "#06D6A0" },
  { light: "#FAEBD7", dark: "#CC8899" },
];

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("darkmode");
    return savedTheme ? JSON.parse(savedTheme) : true;
  });

  const [currentTheme, setCurrentTheme] = useState(() => {
    const savedThemeIndex = localStorage.getItem("themeIndex");
    return savedThemeIndex ? JSON.parse(savedThemeIndex) : 0;
  });

  useEffect(() => {
    localStorage.setItem("darkmode", JSON.stringify(darkMode));
    localStorage.setItem("themeIndex", JSON.stringify(currentTheme));

    // Apply the selected theme
    const { light, dark } = colorThemes[currentTheme];
    document.documentElement.style.setProperty("--color-light", light);
    document.documentElement.style.setProperty("--color-dark", dark);

    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode, currentTheme]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  const changeTheme = (index) => {
    setCurrentTheme(index);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode, currentTheme, changeTheme, colorThemes }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);