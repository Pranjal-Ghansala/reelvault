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
  reloadToken: 0,
};

const moviesSlice = createSlice({
  name: "movies",

  initialState,

  reducers: {
    moviesRequestStarted(state) {
      state.status = "loading";
      state.error = null;
    },

    moviesRequestSucceeded(state, action) {
      state.status = "succeeded";
      state.items = action.payload.data;
      state.pagination = action.payload.pagination;
      state.error = null;
    },

    moviesRequestFailed(state, action) {
      state.status = "failed";
      state.error = action.payload;
    },

    clearMovies(state) {
      state.items = [];

      state.pagination = {
        page: 1,
        totalPages: 0,
        totalResults: 0,
      };

      state.status = "idle";
      state.error = null;
    },

    moviesRetryRequested(state) {
      state.reloadToken += 1;
      state.error = null;
    },
  },
});

export const {
  moviesRequestStarted,
  moviesRequestSucceeded,
  moviesRequestFailed,
  moviesRetryRequested,
  clearMovies,
} = moviesSlice.actions;

export default moviesSlice.reducer;