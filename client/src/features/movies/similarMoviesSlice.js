
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  pagination: {
    page: 1,
    totalPages: 0,
    totalResults: 0,
  },
  status: "idle",
  error: null,
};

const similarMoviesSlice = createSlice({
  name: "similarMovies",
  initialState,
  reducers: {
    similarMoviesRequestStarted(state) {
      state.status = "loading";
      state.error = null;
    },

    similarMoviesRequestSucceeded(state, action) {
      state.status = "succeeded";
      state.items = action.payload.data;
      state.pagination = action.payload.pagination;
      state.error = null;
    },

    similarMoviesRequestFailed(state, action) {
      state.status = "failed";
      state.error = action.payload;
    },

    clearSimilarMovies(state) {
      state.items = [];
      state.pagination = {
        page: 1,
        totalPages: 0,
        totalResults: 0,
      };
      state.status = "idle";
      state.error = null;
    },
  },
});

export const {
  similarMoviesRequestStarted,
  similarMoviesRequestSucceeded,
  similarMoviesRequestFailed,
  clearSimilarMovies,
} = similarMoviesSlice.actions;

export default similarMoviesSlice.reducer;

