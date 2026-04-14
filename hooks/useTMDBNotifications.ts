import { Storage } from "@/lib/storage";
import axios from "axios";
import { useEffect } from "react";

const TMDB_API_KEY = process.env.EXPO_PUBLIC_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export function useTMDBNotifications() {
  useEffect(() => {
    const checkUpcomingMovies = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/movie/upcoming`, {
          params: { api_key: TMDB_API_KEY, language: "en-US", page: 1 },
        });

        const movies = response.data.results;
        if (movies && movies.length > 0) {
          const latestMovie = movies[0];
          // Only notify for genuinely high-rated or high-voted content (Blockbusters)
          if (latestMovie.vote_average >= 7.0 || latestMovie.popularity > 500) {
            const lastNotifiedId = Storage.getString("last_tmdb_notif_id");

            if (lastNotifiedId !== String(latestMovie.id)) {
              const currentLocal =
                Storage.getJSON<any[]>("local_notifications") || [];

              const newNotif = {
                id: `tmdb-${latestMovie.id}`,
                title: "Blockbuster Alert! 💎",
                message: `"${latestMovie.title}" is trending on CineMax with a massive ${latestMovie.vote_average.toFixed(1)} rating. Check it out now!`,
                type: "news",
                date: new Date().toISOString().split("T")[0],
                read: false,
              };

              // Save and update the marker
              Storage.setJSON("local_notifications", [
                newNotif,
                ...currentLocal.slice(0, 15),
              ]);
              Storage.setString("last_tmdb_notif_id", String(latestMovie.id));
              console.log(
                "🚀 Custom Discovery alert added:",
                latestMovie.title,
              );
            }
          }
        }
      } catch (error) {
        console.log("TMDB Smart Alerts Error:", error);
      }
    };

    checkUpcomingMovies();
  }, []);
}
