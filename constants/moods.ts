export interface Mood {
  id: string;
  label: string;
  emoji: string;
  color: string;
  description: string;
  genres: number[];
  keywords?: string[];
}

export const MOODS: Mood[] = [
  {
    id: "happy",
    label: "Happy",
    emoji: "😄",
    color: "#F59E0B",
    description: "Feel-good movies",
    genres: [35, 16, 10751, 10402],
    keywords: ["feel good", "uplifting", "comedy"],
  },
  {
    id: "sad",
    label: "Emotional",
    emoji: "😢",
    color: "#60A5FA",
    description: "Cry it out movies",
    genres: [18, 10749, 36],
    keywords: ["emotional", "drama", "touching"],
  },
  {
    id: "thriller",
    label: "Thrilled",
    emoji: "😱",
    color: "#EF4444",
    description: "Edge of your seat",
    genres: [53, 27, 9648, 80],
    keywords: ["suspense", "thriller", "mystery"],
  },
  {
    id: "adventure",
    label: "Adventurous",
    emoji: "🗺️",
    color: "#10B981",
    description: "Epic journeys await",
    genres: [12, 28, 878, 14],
    keywords: ["adventure", "epic", "journey"],
  },
  {
    id: "romantic",
    label: "Romantic",
    emoji: "❤️",
    color: "#EC4899",
    description: "Love is in the air",
    genres: [10749, 35, 18],
    keywords: ["romance", "love", "relationship"],
  },
  {
    id: "inspired",
    label: "Inspired",
    emoji: "💪",
    color: "#8B5CF6",
    description: "Motivational stories",
    genres: [36, 18, 99, 28],
    keywords: ["inspiring", "biography", "motivational"],
  },
  {
    id: "scifi",
    label: "Mind Blown",
    emoji: "🤯",
    color: "#06B6D4",
    description: "Reality-bending films",
    genres: [878, 14, 9648, 53],
    keywords: ["sci-fi", "mind bending", "futuristic"],
  },
  {
    id: "chill",
    label: "Chill",
    emoji: "😌",
    color: "#6EE7B7",
    description: "Easy watching",
    genres: [35, 16, 10751, 10402],
    keywords: ["lighthearted", "easy", "fun"],
  },
];
