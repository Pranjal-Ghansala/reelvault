import { configureStore } from "@reduxjs/toolkit";

import moviesReducer from "../features/movies/moviesSlice.js";
import searchReducer from "../features/search/searchSlice.js";
import movieDetailsReducer from "../features/movies/movieDetailsSlice.js";
import wishlistReducer from "../features/wishlist/wishlistSlice.js";
import uiReducer from "../features/ui/uiSlice.js";
import similarMoviesReducer from "../features/movies/similarMoviesSlice.js";

export const store = configureStore({
  reducer: {
    movies: moviesReducer,
    search: searchReducer,
    movieDetails: movieDetailsReducer,
    wishlist: wishlistReducer,
    ui: uiReducer,
    similarMovies: similarMoviesReducer,
  },
});