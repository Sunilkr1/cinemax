import { COLORS } from "@/constants/theme";

export const getRatingColor = (rating: number): string => {
  if (rating >= 7) return COLORS.ratingGreen;
  if (rating >= 5) return COLORS.ratingYellow;
  return COLORS.ratingRed;
};

export const getRatingLabel = (rating: number): string => {
  if (rating >= 8) return "Excellent";
  if (rating >= 7) return "Good";
  if (rating >= 5) return "Average";
  if (rating >= 3) return "Poor";
  return "Bad";
};

export const getRatingBg = (rating: number): string => {
  if (rating >= 7) return "rgba(34,197,94,0.15)";
  if (rating >= 5) return "rgba(234,179,8,0.15)";
  return "rgba(239,68,68,0.15)";
};
