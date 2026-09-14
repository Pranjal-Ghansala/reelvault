import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  query: "",
  filters: { genre: "", year: "", rating: "" },
  sort: "relevance",
  page: 1,
  items: [],
  pagination: { page: 1, totalPages: 0, totalResults: 0 },
  status: "idle",
  error: null,
  reloadToken: 0,
};



const searchSlice = createSlice({
  name: "search",
  initialState,

  reducers: {
    setQuery(state, action) {
      state.query = action.payload;
      state.page = 1;
    },

    setFilter(state, action) {
      const { key, value } = action.payload;

      state.filters[key] = value;
      state.page = 1;
    },

    setSort(state, action) {
      state.sort = action.payload;
      state.page = 1;
    },

    setPage(state, action) {
      state.page = action.payload;
    },

    searchRequestStarted(state) {
      state.status = "loading";
      state.error = null;
    },

    searchRequestSucceeded(state, action) {
      state.status = "succeeded";
      state.items = action.payload.data;
      state.pagination = action.payload.pagination;
      state.error = null;
    },

    searchRequestFailed(state, action) {
      state.status = "failed";
      state.error = action.payload;
    },

   searchRetryRequested(state) {
  state.reloadToken += 1;
  state.error = null;
}, 
    clearSearch(state) {
      state.query = "";
      state.filters = {
        genre: "",
        year: "",
        rating: "",
      };
      state.sort = "relevance";
      state.page = 1;
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
  setQuery,
  setFilter,
  setSort,
  setPage,
  searchRequestStarted,
  searchRequestSucceeded,
  searchRequestFailed,
  clearSearch,
  searchRetryRequested,
} = searchSlice.actions;

export default searchSlice.reducer;