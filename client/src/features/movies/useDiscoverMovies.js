import { useEffect } from "react";

import { fetchDiscoverMovies } from "./moviesApi.js";

import {
  moviesRequestStarted,
  moviesRequestSucceeded,
  moviesRequestFailed,
} from "./moviesSlice.js";

import { useAppDispatch } from "../../hooks/redux.js";

export function useDiscoverMovies(params, reloadToken = 0) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const controller = new AbortController();

    async function loadMovies() {
      dispatch(moviesRequestStarted());

      try {
        const result = await fetchDiscoverMovies(params, {
          signal: controller.signal,
        });

        if (controller.signal.aborted) return;

        dispatch(moviesRequestSucceeded(result));
      } catch (error) {
        if (error.name === "AbortError") return;

        if (controller.signal.aborted) return;

        dispatch(
          moviesRequestFailed(
            error.message || "Movies couldn't be loaded."
          )
        );
      }
    }

    loadMovies();

    return () => {
      controller.abort();
    };
  }, [
    dispatch,
    params.genre,
    params.year,
    params.rating,
    params.sort,
    params.page,
    reloadToken,
  ]);
}