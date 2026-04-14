export const COLORS = {
  // Backgrounds
  background: "#0a0a0a",
  surface: "#141414",
  surfaceLight: "#1f1f1f",
  surfaceMid: "#1a1a1a",

  // Brand
  primary: "#E50914",
  primaryDark: "#b20710",
  primaryLight: "#ff1f2b",

  // Text
  textPrimary: "#ffffff",
  textSecondary: "#a3a3a3",
  textMuted: "#6b6b6b",
  textInverse: "#0a0a0a",

  // Rating colors
  ratingGreen: "#22c55e",
  ratingYellow: "#eab308",
  ratingRed: "#ef4444",

  // Accent
  gold: "#F5C518",
  blue: "#3b82f6",
  purple: "#8b5cf6",

  // Glass
  glass: "rgba(255,255,255,0.08)",
  glassBorder: "rgba(255,255,255,0.12)",
  glassStrong: "rgba(255,255,255,0.15)",

  // Overlay
  overlay: "rgba(0,0,0,0.6)",
  overlayDark: "rgba(0,0,0,0.85)",
  overlayLight: "rgba(0,0,0,0.3)",

  // Gradients (used as arrays)
  gradientDark: ["transparent", "#0a0a0a"],
  gradientPrimary: ["#E50914", "#b20710"],
  gradientSurface: ["#141414", "#0a0a0a"],

  // Border
  border: "rgba(255,255,255,0.08)",
  borderLight: "rgba(255,255,255,0.15)",

  // Status
  success: "#22c55e",
  warning: "#eab308",
  error: "#ef4444",
  info: "#3b82f6",

  // Light theme
  light: {
    background: "#f5f5f5",
    surface: "#ffffff",
    surfaceLight: "#f0f0f0",
    textPrimary: "#0a0a0a",
    textSecondary: "#525252",
    textMuted: "#a3a3a3",
    border: "rgba(0,0,0,0.08)",
    glass: "rgba(0,0,0,0.04)",
  },
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 999,
} as const;

export const FONT_SIZE = {
  xs: 10,
  sm: 12,
  base: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 28,
  display: 32,
  hero: 38,
} as const;

export const FONT_WEIGHT = {
  regular: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
  extrabold: "800",
} as const;

export const SHADOWS = {
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 12,
  },
  primary: {
    shadowColor: "#E50914",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
} as const;

export const ANIMATION = {
  fast: 200,
  normal: 300,
  slow: 500,
  verySlow: 800,
} as const;

export const CARD_DIMENSIONS = {
  // Portrait movie card
  portrait: {
    width: 130,
    height: 195,
  },
  // Wide movie card
  wide: {
    width: 220,
    height: 130,
  },
  // Hero slider
  hero: {
    height: 480,
  },
  // Top 10 card
  topTen: {
    width: 150,
    height: 220,
  },
  // Cast card
  cast: {
    width: 90,
    height: 90,
  },
} as const;
