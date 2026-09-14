import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux.js";

import {
  loadWishlist,
  saveMovie,
  unsaveMovie,
} from "./wishlistActions.js";

export function useWishlist() {
  const dispatch = useAppDispatch();

  const movies = useAppSelector((state) => state.wishlist.movies);
  const status = useAppSelector((state) => state.wishlist.status);
  const error = useAppSelector((state) => state.wishlist.error);
  const pendingIds = useAppSelector(
    (state) => state.wishlist.pendingIds
  );

  const isSaved = useCallback(
    (movieId) => movies.some((movie) => movie.id === movieId),
    [movies]
  );

  const isPending = useCallback(
    (movieId) => pendingIds.includes(movieId),
    [pendingIds]
  );

  const toggleWishlist = useCallback(
    (movie) => {
      if (isPending(movie.id)) return;

      if (isSaved(movie.id)) {
        dispatch(unsaveMovie(movie.id));
      } else {
        dispatch(saveMovie(movie));
      }
    },
    [dispatch, isSaved, isPending]
  );

  const loadWishlistData = useCallback(() => {
    dispatch(loadWishlist());
  }, [dispatch]);

  return {
    movies,
    status,
    error,
    isSaved,
    isPending,
    toggleWishlist,
    loadWishlist: loadWishlistData,
  };
}