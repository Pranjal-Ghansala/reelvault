import { Link } from "react-router-dom";

import { useWishlist } from "../../features/wishlist/useWishlist.js";

import MovieGrid from "../../components/movie/MovieGrid.jsx";
import MovieGridSkeleton from "../../components/feedback/MovieGridSkeleton.jsx";
import ErrorState from "../../components/feedback/ErrorState.jsx";

function WishlistPage() {
  const {
    movies,
    status,
    error,
    loadWishlist,
  } = useWishlist();

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">
          Your collection
        </p>

        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Wishlist
        </h1>

        <p className="mt-3 text-sm leading-6 text-white/50">
          Movies you've saved to remember for later.
        </p>
      </header>

      <section className="mt-10">
        {status === "loading" && <MovieGridSkeleton />}

        {status === "failed" && (
          <ErrorState
            message={error}
            onRetry={loadWishlist}
          />
        )}

        {status === "succeeded" && movies.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-16 text-center">
            <h2 className="text-xl font-semibold text-white">
              Your wishlist is empty
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/45">
              Save movies you want to remember and they'll appear
              here.
            </p>

            <Link
              to="/"
              className="mt-6 inline-flex rounded-lg bg-amber-400 px-5 py-3 text-sm font-semibold text-[#17130b] transition hover:bg-amber-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              Discover Movies
            </Link>
          </div>
        )}

        {status === "succeeded" && movies.length > 0 && (
          <>
            <div className="mb-6">
              <p className="text-sm text-white/40">
                {movies.length}{" "}
                {movies.length === 1 ? "movie" : "movies"} saved
              </p>
            </div>

            <MovieGrid movies={movies} />
          </>
        )}
      </section>
    </main>
  );
}

export default WishlistPage;