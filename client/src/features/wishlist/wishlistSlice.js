import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  movies: [],
  status: "idle",
  error: null,
  pendingIds: [],
  mutationErrors: {},
};

const wishlistSlice = createSlice({
  name: "wishlist",

  initialState,

  reducers: {
    wishlistRequestStarted(state) {
      state.status = "loading";
      state.error = null;
    },

    wishlistLoaded(state, action) {
      state.movies = action.payload;
      state.status = "succeeded";
      state.error = null;
    },

    wishlistRequestFailed(state, action) {
      state.status = "failed";
      state.error = action.payload;
    },

    wishlistMutationStarted(state, action) {
      const movieId = action.payload;

      if (!state.pendingIds.includes(movieId)) {
        state.pendingIds.push(movieId);
      }

      delete state.mutationErrors[movieId];
    },

    wishlistMutationFailed(state, action) {
      const { id, message } = action.payload;

      state.mutationErrors[id] = message;
    },

    wishlistMutationFinished(state, action) {
      state.pendingIds = state.pendingIds.filter(
        (id) => id !== action.payload
      );
    },

    movieAddedToWishlist(state, action) {
      const exists = state.movies.some(
        (movie) => movie.id === action.payload.id
      );

      if (!exists) {
        state.movies.push(action.payload);
      }
    },

    movieRemovedFromWishlist(state, action) {
      state.movies = state.movies.filter(
        (movie) => movie.id !== action.payload
      );
    },

    clearWishlistMutationError(state, action) {
      delete state.mutationErrors[action.payload];
    },
  },
});

export const {
  wishlistRequestStarted,
  wishlistLoaded,
  wishlistRequestFailed,
  wishlistMutationStarted,
  wishlistMutationFailed,
  wishlistMutationFinished,
  movieAddedToWishlist,
  movieRemovedFromWishlist,
  clearWishlistMutationError,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;