export interface CollectionMeta {
  id: number;
  name: string;
  emoji: string;
  color: string;
  description: string;
}

export const COLLECTIONS: CollectionMeta[] = [
  {
    id: 131292,
    name: "Iron Man",
    emoji: "🦾",
    color: "#C0392B",
    description: "Tony Stark Collection",
  },
  {
    id: 86311,
    name: "Avengers",
    emoji: "🛡️",
    color: "#2980B9",
    description: "Earth's Mightiest Heroes",
  },
  {
    id: 270946,
    name: "Spider-Man",
    emoji: "🕷️",
    color: "#E74C3C",
    description: "Your friendly neighborhood Spider-Man",
  },
  {
    id: 645,
    name: "James Bond",
    emoji: "🔫",
    color: "#2C3E50",
    description: "The 007 Collection",
  },
  {
    id: 1241,
    name: "Harry Potter",
    emoji: "⚡",
    color: "#8E44AD",
    description: "The Wizarding World",
  },
  {
    id: 10,
    name: "Star Wars",
    emoji: "⚔️",
    color: "#F39C12",
    description: "A galaxy far, far away",
  },
  {
    id: 2344,
    name: "The Dark Knight",
    emoji: "🦇",
    color: "#1A252F",
    description: "Nolan's Batman Trilogy",
  },
  {
    id: 748,
    name: "Fast & Furious",
    emoji: "🚗",
    color: "#E67E22",
    description: "Fast & Furious Franchise",
  },
  {
    id: 86837,
    name: "Guardians",
    emoji: "🌌",
    color: "#8E44AD",
    description: "Guardians of the Galaxy",
  },
  {
    id: 9485,
    name: "The Conjuring",
    emoji: "👁️",
    color: "#2C3E50",
    description: "The Conjuring Universe",
  },
];

export const COLLECTION_IDS = COLLECTIONS.map((c) => c.id);
