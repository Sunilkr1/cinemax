import { Share } from "react-native";

export const shareMovie = async (
  movieTitle: string,
  movieId: number,
  overview?: string,
): Promise<void> => {
  const shareUrl = `https://cinemax-app.com/movie/${movieId}`; // Placeholder URL for deep link
  const message = `🎬 *CineMax Invitation* 🍿\n\nHey! I'm planning to watch *${movieTitle}* (${new Date().getFullYear()}).\n\n"${overview?.slice(0, 100)}..."\n\nWant to join me?\nCheck it out on CineMax: ${shareUrl}`;

  try {
    await Share.share({
      title: `Watch ${movieTitle} with me!`,
      message,
      url: shareUrl,
    });
  } catch (error) {
    console.error("Share failed:", error);
  }
};

export const shareWatchlist = async (movieTitles: string[]): Promise<void> => {
  const list = movieTitles.map((t, i) => `${i + 1}. ${t}`).join("\n");
  const message = `My CineMax Watchlist 🎬\n\n${list}\n\nDownload CineMax app to create yours!`;

  try {
    await Share.share({ message, title: "My CineMax Watchlist" });
  } catch (error) {
    console.error("Share failed:", error);
  }
};
