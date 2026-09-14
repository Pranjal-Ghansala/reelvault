import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import DiscoveryControls from "../../components/filters/DiscoveryControls.jsx";
import MovieGrid from "../../components/movie/MovieGrid.jsx";
import MovieGridSkeleton from "../../components/feedback/MovieGridSkeleton.jsx";
import ErrorState from "../../components/feedback/ErrorState.jsx";

import { useAppDispatch, useAppSelector } from "../../hooks/redux.js";

import {
  setQuery,
  setFilter,
  setSort,
  setPage,
  searchRetryRequested,
} from "../../features/search/searchSlice.js";

import { useMovieSearch } from "../../features/search/useMovieSearch.js";
import { useDebouncedValue } from "../../hooks/useDebouncedValue.js";

const sortOptions = [
  { value: "relevance", label: "Relevance" },
  { value: "popularity", label: "Popularity" },
  { value: "rating", label: "Highest Rated" },
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
];


function SearchResultsPage() {
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const [inputValue, setInputValue] = useState(
    searchParams.get("q") || ""
  );

  const query = useAppSelector((state) => state.search.query);
  const filters = useAppSelector((state) => state.search.filters);
  const sort = useAppSelector((state) => state.search.sort);
  const page = useAppSelector((state) => state.search.page);
  const items = useAppSelector((state) => state.search.items);
  const pagination = useAppSelector(
    (state) => state.search.pagination
  );
  const status = useAppSelector((state) => state.search.status);
  const error = useAppSelector((state) => state.search.error);

  const debouncedQuery = useDebouncedValue(inputValue, 350);

  /*
   * URL -> Redux.
   *
   * This runs whenever the URL changes, including browser
   * back/forward navigation.
   */
  useEffect(() => {
    const urlQuery = searchParams.get("q") || "";
    const urlGenre = searchParams.get("genre") || "";
    const urlYear = searchParams.get("year") || "";
    const urlRating = searchParams.get("rating") || "";
    const urlSort = searchParams.get("sort") || "relevance";
    const urlPage = Number(searchParams.get("page") || 1);

    setInputValue(urlQuery);

    if (urlQuery !== query) {
      dispatch(setQuery(urlQuery));
    }

    if (urlGenre !== filters.genre) {
      dispatch(setFilter({ key: "genre", value: urlGenre }));
    }

    if (urlYear !== filters.year) {
      dispatch(setFilter({ key: "year", value: urlYear }));
    }

    if (urlRating !== filters.rating) {
      dispatch(setFilter({ key: "rating", value: urlRating }));
    }

    if (urlSort !== sort) {
      dispatch(setSort(urlSort));
    }

    if (urlPage !== page && Number.isInteger(urlPage) && urlPage > 0) {
      dispatch(setPage(urlPage));
    }
  }, [searchParams]);

  /*
   * Debounced input -> URL.
   *
   * This prevents a request on every keystroke.
   */
  useEffect(() => {
    const trimmedQuery = debouncedQuery.trim();
    const currentQuery = searchParams.get("q") || "";

    if (trimmedQuery === currentQuery) return;

    const nextParams = new URLSearchParams(searchParams);

    if (trimmedQuery) {
      nextParams.set("q", trimmedQuery);
    } else {
      nextParams.delete("q");
    }

    nextParams.delete("page");

    setSearchParams(nextParams);
  }, [debouncedQuery]);

const reloadToken = useAppSelector(
  (state) => state.search.reloadToken
);


 useMovieSearch(
  {
    query,
    genre: filters.genre,
    year: filters.year,
    rating: filters.rating,
    sort,
    page,
  },
  reloadToken
);

  const hasQuery = query.trim().length > 0;
  const isInitialLoading =
    status === "loading" && items.length === 0;

  const resultSummary = useMemo(() => {
    if (!hasQuery) return "Search for a movie to begin";

    if (status === "succeeded") {
      return `${pagination.totalResults.toLocaleString()} ${
        pagination.totalResults === 1 ? "result" : "results"
      }`;
    }

    return `Results for “${query}”`;
  }, [
    hasQuery,
    pagination.totalResults,
    query,
    status,
  ]);

  function updateUrl(updates = {}) {
    const nextParams = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        nextParams.set(key, value);
      } else {
        nextParams.delete(key);
      }
    });

    if (!Object.prototype.hasOwnProperty.call(updates, "page")) {
      nextParams.delete("page");
    }

    setSearchParams(nextParams);
  }

  function handleFilterChange(key, value) {
    updateUrl({
      [key]: value,
      page: 1,
    });
  }

  function handleSortChange(value) {
    updateUrl({
      sort: value === "relevance" ? "" : value,
      page: 1,
    });
  }

  function handlePageChange(nextPage) {
    updateUrl({
      page: nextPage === 1 ? "" : nextPage,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

 function handleRetry() {
  dispatch(searchRetryRequested());
}

  function clearSearch() {
    setInputValue("");

    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete("q");
    nextParams.delete("page");

    setSearchParams(nextParams);
  }

  function resetFilters() {
    const nextParams = new URLSearchParams(searchParams);

    nextParams.delete("genre");
    nextParams.delete("year");
    nextParams.delete("rating");
    nextParams.delete("page");

    setSearchParams(nextParams);
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">
          Search
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          Find your next favorite
        </h1>
      </div>

      <div className="mb-8">
        <label
          htmlFor="movie-search"
          className="sr-only"
        >
          Search movies
        </label>

        <div className="relative">
          <input
            id="movie-search"
            type="search"
            value={inputValue}
            onChange={(event) =>
              setInputValue(event.target.value)
            }
            placeholder="Search movies, titles, or keywords..."
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-4 pr-12 text-sm text-white outline-none placeholder:text-white/30 focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/20"
          />

          {inputValue && (
            <button
              type="button"
              onClick={clearSearch}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-white/40 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {hasQuery && (
        <>
          <DiscoveryControls
            filters={filters}
            sort={sort}
            sortOptions={sortOptions}
            onFilterChange={handleFilterChange}
            onSortChange={handleSortChange}
          />

          <div className="mb-6 mt-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm text-white/40">
                {resultSummary}
              </p>

              <h2 className="mt-1 text-xl font-semibold">
                Results for “{query}”
              </h2>
            </div>
          </div>

          {status === "failed" && items.length === 0 && (
            <ErrorState
              title="Search unavailable"
              message="We couldn't retrieve movie information right now."
              actionLabel="Try Again"
              onAction={handleRetry}
            />
          )}

          {status === "failed" && items.length > 0 && (
            <div className="mb-6 rounded-lg border border-red-400/20 bg-red-400/5 px-4 py-3 text-sm text-white/70">
              <span>
                We couldn't update these results right now.
              </span>

              <button
                type="button"
                onClick={handleRetry}
                className="ml-3 font-semibold text-amber-400 hover:text-amber-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                Try Again
              </button>
            </div>
          )}

          {isInitialLoading && <MovieGridSkeleton />}

          {status === "loading" && items.length > 0 && (
            <p
              className="mb-4 text-sm text-white/40"
              aria-live="polite"
            >
              Updating results…
            </p>
          )}

          {status !== "failed" && items.length > 0 && (
            <MovieGrid movies={items} />
          )}

          {status === "succeeded" &&
            items.length === 0 && (
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] px-6 py-16 text-center">
                <h2 className="text-xl font-semibold">
                  No movies found
                </h2>

                <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-white/50">
                  We couldn't find anything matching “{query}”.
                  Try another title or broaden your filters.
                </p>

                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="rounded-lg bg-[#f5f1e8] px-4 py-2.5 text-sm font-semibold text-[#0d0d0f]"
                  >
                    Clear Search
                  </button>

                  <button
                    type="button"
                    onClick={resetFilters}
                    className="rounded-lg border border-white/10 px-4 py-2.5 text-sm font-semibold text-white/80 hover:bg-white/5"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            )}

          {pagination.totalPages > 1 &&
            status !== "failed" && (
              <nav
                aria-label="Search results pagination"
                className="mt-10 flex items-center justify-center gap-3"
              >
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => handlePageChange(page - 1)}
                  className="rounded-lg border border-white/10 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-30"
                >
                  Previous
                </button>

                <span className="text-sm text-white/50">
                  Page {page} of {pagination.totalPages}
                </span>

                <button
                  type="button"
                  disabled={page >= pagination.totalPages}
                  onClick={() => handlePageChange(page + 1)}
                  className="rounded-lg border border-white/10 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-30"
                >
                  Next
                </button>
              </nav>
            )}
        </>
      )}

      {!hasQuery && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] px-6 py-20 text-center">
          <h2 className="text-xl font-semibold">
            Search the library
          </h2>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-white/50">
            Search for a title, actor, keyword, or anything you're
            in the mood to watch.
          </p>
        </div>
      )}
    </section>
  );
}

export default SearchResultsPage;