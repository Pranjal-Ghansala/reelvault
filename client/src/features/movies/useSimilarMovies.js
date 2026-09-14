
import { useEffect } from "react";

import { useAppDispatch } from "../../hooks/redux.js";
import { useAppSelector } from "../../hooks/redux.js";

import { fetchSimilarMovies } from "./similarMoviesApi.js";

import {
  similarMoviesRequestStarted,
  similarMoviesRequestSucceeded,
  similarMoviesRequestFailed,
} from "./similarMoviesSlice.js";

export function useSimilarMovies(movieId) {
  const dispatch = useAppDispatch();

  const items = useAppSelector((state) => state.similarMovies.items);
  const pagination = useAppSelector(
    (state) => state.similarMovies.pagination
  );
  const status = useAppSelector((state) => state.similarMovies.status);
  const error = useAppSelector((state) => state.similarMovies.error);

  useEffect(() => {
    if (!movieId) return;

    const controller = new AbortController();

    async function loadSimilarMovies() {
      dispatch(similarMoviesRequestStarted());

      try {
        const result = await fetchSimilarMovies(movieId, 1, {
          signal: controller.signal,
        });

        if (controller.signal.aborted) return;

        dispatch(similarMoviesRequestSucceeded(result));
      } catch (error) {
        if (error.name === "AbortError") return;
        if (controller.signal.aborted) return;

        dispatch(
          similarMoviesRequestFailed(
            error.message || "Similar movies couldn't be loaded."
          )
        );
      }
    }

    loadSimilarMovies();

    return () => {
      controller.abort();
    };
  }, [dispatch, movieId]);

  return {
    items,
    pagination,
    status,
    error,
  };
}

