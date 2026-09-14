import {
  fetchWishlist,
  addToWishlist,
  removeFromWishlist,
} from "./wishlistApi.js";

import {
  wishlistRequestStarted,
  wishlistLoaded,
  wishlistRequestFailed,
  wishlistMutationStarted,
  wishlistMutationFailed,
  wishlistMutationFinished,
  movieAddedToWishlist,
  movieRemovedFromWishlist,
} from "./wishlistSlice.js";

import { addToast } from "../ui/uiSlice.js";

export function loadWishlist() {
  return async function loadWishlistThunk(dispatch) {
    dispatch(wishlistRequestStarted());

    try {
      const result = await fetchWishlist();

      dispatch(wishlistLoaded(result.data || []));
    } catch (error) {
      dispatch(
        wishlistRequestFailed(
          error.message || "Wishlist couldn't be loaded."
        )
      );
    }
  };
}

export function saveMovie(movie) {
  return async function saveMovieThunk(dispatch) {
    dispatch(wishlistMutationStarted(movie.id));

    try {
      const result = await addToWishlist(movie);

      dispatch(movieAddedToWishlist(result.data));

      dispatch(
        addToast({
          type: "success",
          message: "Added to your wishlist.",
        })
      );
    } catch (error) {
      const message =
        error.message || "Movie couldn't be saved.";

      dispatch(
        wishlistMutationFailed({
          id: movie.id,
          message,
        })
      );

      dispatch(
        addToast({
          type: "error",
          message,
        })
      );
    } finally {
      dispatch(wishlistMutationFinished(movie.id));
    }
  };
}

export function unsaveMovie(movieId) {
  return async function unsaveMovieThunk(dispatch) {
    dispatch(wishlistMutationStarted(movieId));

    try {
      await removeFromWishlist(movieId);

      dispatch(movieRemovedFromWishlist(movieId));

      dispatch(
        addToast({
          type: "success",
          message: "Removed from your wishlist.",
        })
      );
    } catch (error) {
      const message =
        error.message || "Movie couldn't be removed.";

      dispatch(
        wishlistMutationFailed({
          id: movieId,
          message,
        })
      );

      dispatch(
        addToast({
          type: "error",
          message,
        })
      );
    } finally {
      dispatch(wishlistMutationFinished(movieId));
    }
  };
}