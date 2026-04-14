import { IMAGE_SIZES, TMDB } from "@/constants/tmdb";

export const getPosterUrl = (
  path: string | null | undefined,
  size: keyof typeof IMAGE_SIZES.poster = "large",
): string | null => {
  if (!path) return null;
  return `${TMDB.IMAGE_BASE}/${IMAGE_SIZES.poster[size]}${path}`;
};

export const getBackdropUrl = (
  path: string | null | undefined,
  size: keyof typeof IMAGE_SIZES.backdrop = "large",
): string | null => {
  if (!path) return null;
  return `${TMDB.IMAGE_BASE}/${IMAGE_SIZES.backdrop[size]}${path}`;
};

export const getProfileUrl = (
  path: string | null | undefined,
  size: keyof typeof IMAGE_SIZES.profile = "medium",
): string | null => {
  if (!path) return null;
  return `${TMDB.IMAGE_BASE}/${IMAGE_SIZES.profile[size]}${path}`;
};

export const getLogoUrl = (
  path: string | null | undefined,
  size: keyof typeof IMAGE_SIZES.logo = "medium",
): string | null => {
  if (!path) return null;
  return `${TMDB.IMAGE_BASE}/${IMAGE_SIZES.logo[size]}${path}`;
};
