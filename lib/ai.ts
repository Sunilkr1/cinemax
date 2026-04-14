// AI recommendations via Claude API
const AI_BASE_URL = "https://api.anthropic.com/v1/messages";

export interface AIRecommendationRequest {
  watchedMovies: string[];
  favoriteGenres: string[];
  mood?: string;
  language?: string;
}

export interface AIRecommendedMovie {
  title: string;
  year: number;
  reason: string;
  genre: string;
  mood: string;
}

export const getAIRecommendations = async (
  request: AIRecommendationRequest,
): Promise<AIRecommendedMovie[]> => {
  const prompt = `
    Recommend movies based on:
    Watched: ${request.watchedMovies.join(", ")}
    Genres: ${request.favoriteGenres.join(", ")}
    Language: ${request.language || "English"}
    
    Respond with JSON array only.
  `;

  try {
    const response = await fetch(AI_BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) throw new Error("AI Service Unavailable");

    const data = await response.json();
    const text = data.content?.[0]?.text || "[]";
    const clean = text.replace(/```json|```/g, "").trim();
    return JSON.parse(clean) as AIRecommendedMovie[];
  } catch (e) {
    console.log("🤖 AI Service Fallback active (No key or network error)");
    return getFallbackRecommendations(request.favoriteGenres);
  }
};

const getFallbackRecommendations = (genres: string[]): AIRecommendedMovie[] => {
  const allFallbacks: Record<string, AIRecommendedMovie[]> = {
    Action: [
      { title: "John Wick", year: 2014, reason: "You love high-octane action and stunts.", genre: "Action", mood: "Thrilling" },
      { title: "Mad Max: Fury Road", year: 2015, reason: "A masterpiece of visual storytelling and action.", genre: "Action", mood: "Intense" },
    ],
    Drama: [
      { title: "The Shawshank Redemption", year: 1994, reason: "The highest rated drama of all time.", genre: "Drama", mood: "Inspirational" },
      { title: "Parasite", year: 2019, reason: "A gripping social commentary with a twist.", genre: "Drama/Thriller", mood: "Shocking" },
    ],
    "Sci-Fi": [
      { title: "Inception", year: 2010, reason: "Mind-bending sci-fi for fans of complex plots.", genre: "Sci-Fi", mood: "Thought-provoking" },
      { title: "Interstellar", year: 2014, reason: "An emotional journey through space and time.", genre: "Sci-Fi", mood: "Epic" },
    ],
  };

  const selected = genres.length > 0 ? allFallbacks[genres[0]] : allFallbacks["Action"];
  return selected || allFallbacks["Action"];
};

export const getMoodMovieSuggestion = async (
  moodText: string,
): Promise<{ genres: number[]; keywords: string[]; description: string }> => {
  const prompt = `
    User says: "${moodText}"
    
    Based on this mood, suggest TMDB genre IDs and search keywords.
    Respond ONLY with JSON, no markdown:
    {
      "genres": [28, 12],
      "keywords": ["action", "adventure"],
      "description": "You seem to be in the mood for action-packed adventures!"
    }
    
    Available genre IDs: 28=Action, 12=Adventure, 16=Animation, 35=Comedy, 
    80=Crime, 18=Drama, 14=Fantasy, 27=Horror, 9648=Mystery, 10749=Romance, 
    878=Sci-Fi, 53=Thriller, 10752=War
  `;

  const response = await fetch(AI_BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 300,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const data = await response.json();
  const text = data.content?.[0]?.text || "{}";

  try {
    const clean = text.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
  } catch {
    return {
      genres: [28, 35],
      keywords: ["popular"],
      description: "Here are some great picks!",
    };
  }
};
