// client/src/index.js
import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

// Global styles
import "./styles/global.css";
import "./styles/theme.css";

/**
 * Theme and Locale Contexts
 * Persisted to localStorage and applied to <html> for CSS hooks.
 */
export const ThemeContext = React.createContext({
  theme: "system",
  setTheme: () => {},
});

export const LocaleContext = React.createContext({
  locale: "en",
  setLocale: () => {},
});

function usePersistentState(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw !== null ? JSON.parse(raw) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* no-op */
    }
  }, [key, value]);

  return [value, setValue];
}

function applyTheme(theme) {
  const root = document.documentElement;

  const systemPrefersDark = window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  const resolved = theme === "system" ? (systemPrefersDark ? "dark" : "light") : theme;

  root.setAttribute("data-theme", resolved);
}

function ThemeProvider({ children }) {
  const [theme, setTheme] = usePersistentState("vf_theme", "system");

  useEffect(() => {
    applyTheme(theme);
    if (theme === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = () => applyTheme("system");
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    }
  }, [theme]);

  const value = useMemo(() => ({ theme, setTheme }), [theme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

function LocaleProvider({ children }) {
  const browserLocale =
    (navigator.languages && navigator.languages[0]) ||
    navigator.language ||
    "en";

  const defaultLang = String(browserLocale).split("_")[0].split("-")[0] || "en";
  const [locale, setLocale] = usePersistentState("vf_locale", defaultLang);

  // Apply to <html lang="..."> for a11y and correct hyphenation rules in CSS
  useEffect(() => {
    document.documentElement.setAttribute("lang", locale || "en");
  }, [locale]);

  const value = useMemo(() => ({ locale, setLocale }), [locale]);
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

function RootApp() {
  return (
    <React.StrictMode>
      <ThemeProvider>
        <LocaleProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </LocaleProvider>
      </ThemeProvider>
    </React.StrictMode>
  );
}

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<RootApp />);
