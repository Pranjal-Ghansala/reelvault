import { useEffect } from "react";

import { fetchMovieDetails } from "./moviesApi.js";

import {
  movieDetailsRequestStarted,
  movieDetailsRequestSucceeded,
  movieDetailsRequestFailed,
} from "./movieDetailsSlice.js";

import { useAppDispatch } from "../../hooks/redux.js";

export function useMovieDetails(movieId) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!movieId) return;

    const controller = new AbortController();

    async function loadMovie() {
      dispatch(movieDetailsRequestStarted());

      try {
        const result = await fetchMovieDetails(movieId, {
          signal: controller.signal,
        });

        if (controller.signal.aborted) return;

        dispatch(movieDetailsRequestSucceeded(result));
      } catch (error) {
        if (error.name === "AbortError") return;

        if (controller.signal.aborted) return;

        dispatch(
          movieDetailsRequestFailed(
            error.message ||
              "We couldn't load the information for this movie."
          )
        );
      }
    }

    loadMovie();

    return () => {
      controller.abort();
    };
  }, [dispatch, movieId]);
}