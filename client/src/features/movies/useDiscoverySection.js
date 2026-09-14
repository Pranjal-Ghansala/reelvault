
import { useEffect, useState } from "react";
import { fetchDiscoverMovies } from "./moviesApi.js";

export function useDiscoverySection(params) {
  const [movies, setMovies] = useState([]);
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    const controller = new AbortController();

    async function loadMovies() {
      setStatus("loading");

      try {
        const result = await fetchDiscoverMovies(
          {
            ...params,
            page: 1,
          },
          {
            signal: controller.signal,
          }
        );

        if (controller.signal.aborted) return;

        setMovies(result.data || []);
        setStatus("succeeded");
      } catch (error) {
        if (error.name === "AbortError") return;
        if (controller.signal.aborted) return;

        setMovies([]);
        setStatus("failed");
      }
    }

    loadMovies();

    return () => {
      controller.abort();
    };
  }, [
    params.genre,
    params.year,
    params.rating,
    params.sort,
  ]);

  return {
    movies,
    status,
    loading: status === "loading",
  };
}

