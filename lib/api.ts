import { DEFAULT_PARAMS, TMDB } from "@/constants/tmdb";
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: TMDB.BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${TMDB.TOKEN}`,
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Attach default params
    config.params = {
      ...DEFAULT_PARAMS,
      ...config.params,
    };
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      console.error(
        `TMDB API Error ${status}:`,
        data?.status_message || "Unknown error",
      );

      if (status === 401) {
        console.error("Invalid TMDB API key");
      }
      if (status === 404) {
        console.error("Resource not found");
      }
      if (status === 429) {
        console.error("Rate limit exceeded");
      }
    } else if (error.request) {
      console.error("Network error — no response received");
    }
    return Promise.reject(error);
  },
);

// Generic GET helper
export const get = async <T>(
  endpoint: string,
  params?: Record<string, unknown>,
  config?: AxiosRequestConfig,
): Promise<T> => {
  const response = await api.get<T>(endpoint, { params, ...config });
  return response.data;
};

export default api;
