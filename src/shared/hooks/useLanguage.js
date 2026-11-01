import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { t as translateHelper } from "../i18n/index.js";

export const LanguageContext = createContext(null);

const STORAGE_KEY = "gate_dashboard_lang";

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) || "ar";
  });

  const dir = language === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = dir;
    localStorage.setItem(STORAGE_KEY, language);
  }, [language, dir]);

  const setLanguage = useCallback((newLang) => {
    if (newLang === "ar" || newLang === "en") {
      setLanguageState(newLang);
    }
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguageState((prev) => (prev === "ar" ? "en" : "ar"));
  }, []);

  const t = useCallback(
    (key, params) => translateHelper(language, key, params),
    [language]
  );

  const value = {
    language,
    dir,
    setLanguage,
    toggleLanguage,
    t,
  };

  return React.createElement(LanguageContext.Provider, { value }, children);
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
