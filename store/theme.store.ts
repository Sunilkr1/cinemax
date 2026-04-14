import { Storage, STORAGE_KEYS } from "@/lib/storage";
import { Appearance } from "react-native";

export type ThemeMode = "dark" | "light" | "system";

export interface ThemeState {
  mode: ThemeMode;
  isDark: boolean;
}

export const resolveIsDark = (mode: ThemeMode): boolean => {
  if (mode === "system") {
    return Appearance.getColorScheme() !== "light";
  }
  return mode === "dark";
};

export const loadTheme = (): ThemeState => {
  const saved = Storage.getString(STORAGE_KEYS.THEME) as ThemeMode | undefined;
  const mode: ThemeMode =
    saved && ["dark", "light", "system"].includes(saved) ? saved : "dark";
  return { mode, isDark: resolveIsDark(mode) };
};

export const saveTheme = (mode: ThemeMode): ThemeState => {
  Storage.setString(STORAGE_KEYS.THEME, mode);
  const isDark = resolveIsDark(mode);
  return { mode, isDark };
};

export const toggleTheme = (current: ThemeMode): ThemeState => {
  const next: ThemeMode = current === "dark" ? "light" : "dark";
  return saveTheme(next);
};
