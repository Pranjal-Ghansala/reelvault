import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  movie: null,
  status: "idle",
  error: null,
};

const movieDetailsSlice = createSlice({
  name: "movieDetails",
  initialState,
  reducers: {
    movieDetailsRequestStarted(state) {
      state.status = "loading";
      state.error = null;
    },

    movieDetailsRequestSucceeded(state, action) {
      state.status = "succeeded";
      state.movie = action.payload;
      state.error = null;
    },

    movieDetailsRequestFailed(state, action) {
      state.status = "failed";
      state.error = action.payload;
    },

    clearMovieDetails(state) {
      state.movie = null;
      state.status = "idle";
      state.error = null;
    },
  },
});

export const {
  movieDetailsRequestStarted,
  movieDetailsRequestSucceeded,
  movieDetailsRequestFailed,
  clearMovieDetails,
} = movieDetailsSlice.actions;

export default movieDetailsSlice.reducer;