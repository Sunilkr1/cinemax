/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#E50914", // CineMax red
        background: "#0a0a0a", // Deep black
        surface: "#141414", // Card background
        surfaceLight: "#1f1f1f", // Elevated surface
        textPrimary: "#ffffff",
        textSecondary: "#a3a3a3",
        gold: "#F5C518", // IMDb gold rating
        success: "#22c55e", // Rating green
        warning: "#eab308", // Rating yellow
        danger: "#ef4444", // Rating red
      },
      fontFamily: {
        regular: ["Inter-Regular"],
        medium: ["Inter-Medium"],
        semibold: ["Inter-SemiBold"],
        bold: ["Inter-Bold"],
      },
    },
  },
  plugins: [],
};
