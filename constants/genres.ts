export const GENRES: Record<number, string> = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Sci-Fi",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
};

export const GENRE_EMOJIS: Record<number, string> = {
  28: "💥",
  12: "🗺️",
  16: "🎨",
  35: "😂",
  80: "🔫",
  99: "🎥",
  18: "🎭",
  10751: "👨‍👩‍👧",
  14: "🧙",
  36: "📜",
  27: "👻",
  10402: "🎵",
  9648: "🔍",
  10749: "❤️",
  878: "🚀",
  53: "😱",
  10752: "⚔️",
  37: "🤠",
};

export const GENRE_LIST = Object.entries(GENRES).map(([id, name]) => ({
  id: Number(id),
  name,
  emoji: GENRE_EMOJIS[Number(id)] || "🎬",
}));

// Popular genre groups
export const GENRE_GROUPS = {
  action: [28, 12, 878, 10752],
  family: [16, 10751, 14, 10402],
  thriller: [53, 27, 9648, 80],
  drama: [18, 36, 99, 10749],
} as const;
