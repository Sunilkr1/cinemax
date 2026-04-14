import { getTVDetail } from "@/services/tv.service";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "./useLanguage";

export const useTVDetail = (id: number) => {
  const { tmdbLang } = useLanguage();

  return useQuery({
    queryKey: ["tv", "detail", id, tmdbLang],
    queryFn: () => getTVDetail(id, tmdbLang),
    enabled: !!id,
    staleTime: 1000 * 60 * 10,
  });
};
