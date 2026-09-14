
import { useEffect, useState } from "react";
import { fetchHomepageMovies } from "./homepageApi.js";

export function useHomepageMovies() {
  const [data, setData] = useState({
    popular: [],
    topRated: [],
    newest: [],
  });

  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadHomepageMovies() {
      setStatus("loading");
      setError(null);

      try {
        const result = await fetchHomepageMovies({
          signal: controller.signal,
        });

        if (controller.signal.aborted) return;

        setData({
          popular: result.popular || [],
          topRated: result.topRated || [],
          newest: result.newest || [],
        });

        setStatus("succeeded");
      } catch (error) {
        if (error.name === "AbortError") return;
        if (controller.signal.aborted) return;

        setStatus("failed");
        setError(
          error.message || "Homepage movies couldn't be loaded."
        );
      }
    }

    loadHomepageMovies();

    return () => {
      controller.abort();
    };
  }, []);

  return {
    ...data,
    status,
    error,
    loading: status === "loading",
  };
}

