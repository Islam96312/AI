"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import en from "@/i18n/messages/en.json";
import ar from "@/i18n/messages/ar.json";

type Language = "en" | "ar";
type Theme = "light" | "dark";
type Messages = typeof en;

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  t: (key: string) => string;
  isRTL: boolean;
  dir: "ltr" | "rtl";
}

const messages: Record<Language, Messages> = { en, ar };

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [theme, setThemeState] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedLang = localStorage.getItem("language") as Language;
    const savedTheme = localStorage.getItem("theme") as Theme;
    
    if (savedLang && (savedLang === "en" || savedLang === "ar")) {
      setLanguageState(savedLang);
    }
    
    if (savedTheme && (savedTheme === "light" || savedTheme === "dark")) {
      setThemeState(savedTheme);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setThemeState("dark");
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      document.documentElement.setAttribute("dir", language === "ar" ? "rtl" : "ltr");
      document.documentElement.setAttribute("lang", language);
    }
  }, [language, mounted]);

  useEffect(() => {
    if (mounted) {
      document.documentElement.classList.toggle("dark", theme === "dark");
    }
  }, [theme, mounted]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const t = (key: string): string => {
    const keys = key.split(".");
    let value: unknown = messages[language];
    
    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = (value as Record<string, unknown>)[k];
      } else {
        return key;
      }
    }
    
    return typeof value === "string" ? value : key;
  };

  const isRTL = language === "ar";
  const dir = isRTL ? "rtl" : "ltr";

  if (!mounted) {
    return null;
  }

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        theme,
        setTheme,
        toggleTheme,
        t,
        isRTL,
        dir,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
