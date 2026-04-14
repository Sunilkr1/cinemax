import { COLORS } from "@/constants/theme";
import {
  ThemeMode,
  ThemeState,
  loadTheme,
  saveTheme,
} from "@/store/theme.store";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Appearance } from "react-native";

// ─── Theme Colors Type ────────────────────────────────────────
export interface ThemeColors {
  background: string;
  surface: string;
  surfaceLight: string;
  surfaceMid: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  glass: string;
  primary: string;
  gold: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  purple: string;
  blue: string;
}

// ─── Get colors based on isDark ───────────────────────────────
export const getThemeColors = (isDark: boolean): ThemeColors => ({
  background: isDark ? COLORS.background : COLORS.light.background,
  surface: isDark ? COLORS.surface : COLORS.light.surface,
  surfaceLight: isDark ? COLORS.surfaceLight : COLORS.light.surfaceLight,
  surfaceMid: isDark ? COLORS.surfaceMid : "#e5e5e5",
  textPrimary: isDark ? COLORS.textPrimary : COLORS.light.textPrimary,
  textSecondary: isDark ? COLORS.textSecondary : COLORS.light.textSecondary,
  textMuted: isDark ? COLORS.textMuted : "#9e9e9e",
  border: isDark ? COLORS.border : COLORS.light.border,
  glass: isDark ? COLORS.glass : COLORS.light.glass,
  primary: COLORS.primary,
  gold: COLORS.gold,
  success: COLORS.success,
  warning: COLORS.warning,
  error: COLORS.error,
  info: COLORS.info,
  purple: COLORS.purple,
  blue: COLORS.blue,
});

// ─── Context Type ─────────────────────────────────────────────
interface ThemeContextType {
  theme: ThemeState;
  colors: ThemeColors;
  isDark: boolean;
  setMode: (mode: ThemeMode) => void;
  toggle: () => void;
}

// ─── Context with default dark values ────────────────────────
export const ThemeContext = createContext<ThemeContextType>({
  theme: { mode: "dark", isDark: true },
  colors: getThemeColors(true),
  isDark: true,
  setMode: () => {},
  toggle: () => {},
});

// ─── useTheme Hook ────────────────────────────────────────────
export const useTheme = () => {
  const [theme, setTheme] = useState<ThemeState>(loadTheme);

  // Listen for system theme changes
  useEffect(() => {
    if (theme.mode !== "system") return;
    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      setTheme((prev) => ({
        ...prev,
        isDark: colorScheme === "dark",
      }));
    });
    return () => sub.remove();
  }, [theme.mode]);

  const setMode = useCallback((mode: ThemeMode) => {
    const next = saveTheme(mode);
    setTheme(next);
  }, []);

  const toggle = useCallback(() => {
    const next = saveTheme(theme.mode === "dark" ? "light" : "dark");
    setTheme(next);
  }, [theme.mode]);

  const colors = getThemeColors(theme.isDark);

  return {
    theme,
    colors,
    setMode,
    toggle,
    isDark: theme.isDark,
  };
};

// ─── useThemeColors — use anywhere ───────────────────────────
export const useThemeColors = () => {
  return useContext(ThemeContext).colors;
};
