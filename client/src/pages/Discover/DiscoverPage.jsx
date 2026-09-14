import { useState } from "react";

import {
  useAppDispatch,
  useAppSelector,
} from "../../hooks/redux.js";

import FeaturedMovie from "../../components/movie/FeaturedMovie.jsx";
import MovieGrid from "../../components/movie/MovieGrid.jsx";
import MovieGridSkeleton from "../../components/feedback/MovieGridSkeleton.jsx";
import DiscoveryControls from "../../components/filters/DiscoveryControls.jsx";

import { useDiscoverMovies } from "../../features/movies/useDiscoverMovies.js";

import {
  moviesRetryRequested,
} from "../../features/movies/moviesSlice.js";

const sortOptions = [
  { value: "popularity", label: "Popularity" },
  { value: "rating", label: "Highest Rated" },
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
];

function SectionHeader({
  eyebrow,
  title,
  description,
}) {
  return (
    <div className="mb-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">
        {eyebrow}
      </p>

      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
        {title}
      </h2>

      {description && (
        <p className="mt-2 max-w-2xl text-sm leading-6 text-white/45">
          {description}
        </p>
      )}
    </div>
  );
}

function DiscoverPage() {
  const dispatch = useAppDispatch();

  const [filters, setFilters] = useState({
    genre: "",
    year: "",
    rating: "",
    sort: "popularity",
    page: 1,
  });

  const items = useAppSelector(
    (state) => state.movies.items
  );

  const status = useAppSelector(
    (state) => state.movies.status
  );

  const error = useAppSelector(
    (state) => state.movies.error
  );

  const pagination = useAppSelector(
    (state) => state.movies.pagination
  );

  const reloadToken = useAppSelector(
    (state) => state.movies.reloadToken
  );

  useDiscoverMovies(filters, reloadToken);

  function updateFilters(updates) {
    setFilters((current) => ({
      ...current,
      ...updates,
    }));
  }

  function handleFilterChange(key, value) {
    updateFilters({
      [key]: value,
      page: 1,
    });
  }

  function handleSortChange(value) {
    updateFilters({
      sort: value,
      page: 1,
    });
  }

  function handlePageChange(nextPage) {
    updateFilters({
      page: nextPage,
    });
  }

  function handleRetry() {
    dispatch(moviesRetryRequested());
  }

  return (
    <>
      {items[0] && (
        <FeaturedMovie movie={items[0]} />
      )}

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <DiscoveryControls
          filters={filters}
          sort={filters.sort}
          sortOptions={sortOptions}
          onFilterChange={handleFilterChange}
          onSortChange={handleSortChange}
        />

        <section>
          <SectionHeader
            eyebrow="Popular now"
            title="Worth watching"
            description="A selection of films worth discovering."
          />

          {status === "failed" && items.length === 0 && (
            <div className="rounded-2xl border border-red-400/20 bg-red-400/5 px-6 py-12 text-center">
              <p className="text-lg font-semibold text-white">
                Movies couldn't be loaded
              </p>

              <p className="mt-2 text-sm text-white/50">
                We couldn't retrieve movie information right now.
              </p>

              {error && (
                <p className="mt-2 text-xs text-white/30">
                  {error}
                </p>
              )}

              <button
                type="button"
                onClick={handleRetry}
                className="mt-6 rounded-lg bg-[#f5f1e8] px-4 py-2.5 text-sm font-semibold text-[#0d0d0f]"
              >
                Try Again
              </button>
            </div>
          )}

          {status === "loading" &&
            items.length === 0 && (
              <MovieGridSkeleton />
            )}

          {status === "loading" &&
            items.length > 0 && (
              <div
                className="mb-4 text-sm text-white/40"
                aria-live="polite"
              >
                Updating movies…
              </div>
            )}

          {status === "failed" &&
            items.length > 0 && (
              <div className="mb-6 rounded-lg border border-red-400/20 bg-red-400/5 px-4 py-3 text-sm text-white/70">
                <span>
                  We couldn't update the movies right now.
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

          {status !== "failed" &&
            items.length > 0 && (
              <MovieGrid movies={items} />
            )}

          {status === "succeeded" &&
            items.length === 0 && (
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-12 text-center">
                <p className="text-lg font-semibold text-white">
                  No movies found
                </p>

                <p className="mt-2 text-sm text-white/50">
                  Try adjusting your filters or exploring another page.
                </p>
              </div>
            )}

          {status === "succeeded" &&
            items.length > 0 &&
            pagination.totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-4">
                <button
                  type="button"
                  disabled={pagination.page <= 1}
                  onClick={() =>
                    handlePageChange(
                      pagination.page - 1
                    )
                  }
                  className="rounded-lg border border-white/10 px-4 py-2.5 text-sm text-white/70 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  Previous
                </button>

                <span className="text-sm text-white/45">
                  Page {pagination.page} of{" "}
                  {pagination.totalPages}
                </span>

                <button
                  type="button"
                  disabled={
                    pagination.page >=
                    pagination.totalPages
                  }
                  onClick={() =>
                    handlePageChange(
                      pagination.page + 1
                    )
                  }
                  className="rounded-lg border border-white/10 px-4 py-2.5 text-sm text-white/70 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  Next
                </button>
              </div>
            )}
        </section>
      </main>
    </>
  );
}

export default DiscoverPage;