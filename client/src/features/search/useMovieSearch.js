import { useEffect } from "react";

import { searchMovies } from "./searchApi.js";

import {
  searchRequestStarted,
  searchRequestSucceeded,
  searchRequestFailed,
} from "./searchSlice.js";

import { useAppDispatch } from "../../hooks/redux.js";

export function useMovieSearch(params = {}, reloadToken = 0) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const query = params.query?.trim() || "";

    if (!query) {
      return;
    }

    const controller = new AbortController();

    async function loadSearchResults() {
      dispatch(searchRequestStarted());

      try {
        const result = await searchMovies(
          {
            ...params,
            q: query,
          },
          {
            signal: controller.signal,
          }
        );

        if (controller.signal.aborted) return;

        dispatch(searchRequestSucceeded(result));
      } catch (error) {
        if (error.name === "AbortError") return;

        if (controller.signal.aborted) return;

        dispatch(
          searchRequestFailed(
            error.message || "Search couldn't be completed."
          )
        );
      }
    }

    loadSearchResults();

    return () => {
      controller.abort();
    };
  }, [
    dispatch,
    params.query,
    params.genre,
    params.year,
    params.rating,
    params.sort,
    params.page,
    reloadToken,
  ]);
}