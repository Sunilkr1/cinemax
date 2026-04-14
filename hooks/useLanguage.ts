import { LanguageCode } from "@/constants/tmdb";
import {
  LanguageState,
  loadLanguage,
  saveLanguage,
  toggleLanguage,
} from "@/store/language.store";
import { useCallback, useState } from "react";

export const useLanguage = () => {
  const [language, setLanguageState] = useState<LanguageState>(loadLanguage);

  const setLanguage = useCallback((code: LanguageCode) => {
    const next = saveLanguage(code);
    setLanguageState(next);
  }, []);

  const toggle = useCallback(() => {
    const next = toggleLanguage(language.code);
    setLanguageState(next);
  }, [language.code]);

  return {
    language,
    tmdbLang: language.tmdbLang,
    isHindi: language.code === "hi",
    setLanguage,
    toggle,
  };
};
