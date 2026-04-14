import { LanguageCode, LANGUAGES } from "@/constants/tmdb";
import { Storage, STORAGE_KEYS } from "@/lib/storage";

export interface LanguageState {
  code: LanguageCode;
  tmdbLang: string;
  label: string;
  flag: string;
}

// ─── Load from MMKV ──────────────────────────────────────────
export const loadLanguage = (): LanguageState => {
  const saved = Storage.getString(STORAGE_KEYS.LANGUAGE) as
    | LanguageCode
    | undefined;
  const code: LanguageCode = saved && LANGUAGES[saved] ? saved : "hi";
  return buildLanguageState(code);
};

// ─── Save to MMKV ────────────────────────────────────────────
export const saveLanguage = (code: LanguageCode): LanguageState => {
  Storage.setString(STORAGE_KEYS.LANGUAGE, code);
  return buildLanguageState(code);
};

// ─── Toggle en <-> hi ────────────────────────────────────────
export const toggleLanguage = (current: LanguageCode): LanguageState => {
  const next: LanguageCode = current === "en" ? "hi" : "en";
  return saveLanguage(next);
};

// ─── Build full state object ──────────────────────────────────
const buildLanguageState = (code: LanguageCode): LanguageState => {
  const lang = LANGUAGES[code];
  return {
    code,
    tmdbLang: lang.code,
    label: lang.label,
    flag: lang.flag,
  };
};
