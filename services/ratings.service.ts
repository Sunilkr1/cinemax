const OMDB_API_KEY = process.env.EXPO_PUBLIC_OMDB_API_KEY;
const OMDB_BASE_URL = "http://www.omdbapi.com/";

export interface ContentRatings {
  imdb: string | null;
  rottenTomatoes: string | null;
  metacritic: string | null;
}

/**
 * Fetches additional ratings (IMDb, Rotten Tomatoes) from OMDb API.
 * Requires an OMDb API key.
 */
export const fetchExtraRatings = async (
  imdbId: string,
): Promise<ContentRatings> => {
  if (!imdbId) return { imdb: null, rottenTomatoes: null, metacritic: null };

  try {
    const response = await fetch(
      `${OMDB_BASE_URL}?i=${imdbId}&apikey=${OMDB_API_KEY}`,
    );
    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      console.warn("OMDb returned invalid JSON:", text.substring(0, 100));
      return { imdb: null, rottenTomatoes: null, metacritic: null };
    }

    if (data.Response === "False") {
      throw new Error(data.Error);
    }

    const ratings: ContentRatings = {
      imdb:
        data.imdbRating && data.imdbRating !== "N/A" ? data.imdbRating : null,
      rottenTomatoes: null,
      metacritic:
        data.Metascore && data.Metascore !== "N/A" ? data.Metascore : null,
    };

    // Find Rotten Tomatoes in the Ratings array
    if (data.Ratings && Array.isArray(data.Ratings)) {
      const rtRow = data.Ratings.find(
        (r: any) => r.Source === "Rotten Tomatoes",
      );
      if (rtRow) {
        ratings.rottenTomatoes = rtRow.Value;
      }
    }

    return ratings;
  } catch (error) {
    console.error("Failed to fetch OMDb ratings:", error);
    return { imdb: null, rottenTomatoes: null, metacritic: null };
  }
};
