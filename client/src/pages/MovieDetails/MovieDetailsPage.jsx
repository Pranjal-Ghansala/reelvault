
import { useState } from "react";
import {
  useParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import { useAppSelector } from "../../hooks/redux.js";
import { useMovieDetails } from "../../features/movies/useMovieDetails.js";

import MovieDetailsSkeleton from "../../components/feedback/MovieDetailsSkeleton.jsx";
import WishlistButton from "../../components/movie/WishlistButton.jsx";
import SimilarMovies from "../../components/movie/SimilarMovies.jsx";

function MovieDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [backdropError, setBackdropError] = useState(false);
  const [posterError, setPosterError] = useState(false);

  const from = searchParams.get("from");

  useMovieDetails(id);

  const movie = useAppSelector(
    (state) => state.movieDetails.movie
  );

  const status = useAppSelector(
    (state) => state.movieDetails.status
  );

  const error = useAppSelector(
    (state) => state.movieDetails.error
  );

  function handleBack() {
    if (from && from.startsWith("/")) {
      navigate(from);
      return;
    }

    navigate("/");
  }

  if (status === "loading" || status === "idle") {
    return <MovieDetailsSkeleton />;
  }

  if (status === "failed") {
    return (
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <button
          type="button"
          onClick={handleBack}
          className="mb-8 rounded-md px-1 py-1 text-sm text-white/55 transition hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
        >
          ← Back
        </button>

        <div
          role="alert"
          className="rounded-2xl border border-red-400/20 bg-red-400/5 p-6 sm:p-8"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-300/80">
            Something went wrong
          </p>

          <h1 className="mt-3 text-2xl font-semibold text-white">
            We couldn't load this movie.
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-white/55">
            {error ||
              "Something went wrong while loading the movie."}
          </p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 rounded-lg bg-[#f5f1e8] px-4 py-2.5 text-sm font-semibold text-[#0d0d0f] transition hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            Try again
          </button>
        </div>
      </section>
    );
  }

  if (!movie) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <button
          type="button"
          onClick={handleBack}
          className="mb-8 rounded-md px-1 py-1 text-sm text-white/55 transition hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
        >
          ← Back
        </button>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">
            Movie
          </p>

          <h1 className="mt-3 text-2xl font-semibold text-white">
            Movie not found
          </h1>

          <p className="mt-3 text-sm leading-6 text-white/55">
            We couldn't find the movie you're looking for.
          </p>
        </div>
      </section>
    );
  }

  const showBackdrop = movie.backdropUrl && !backdropError;
  const showPoster = movie.posterUrl && !posterError;

  return (
    <section className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={handleBack}
          className="rounded-md px-1 py-1 text-sm text-white/55 transition hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
        >
          ← Back to results
        </button>
      </div>

      <div className="relative mt-6 overflow-hidden border-y border-white/10">
        {showBackdrop ? (
          <img
            src={movie.backdropUrl}
            alt=""
            aria-hidden="true"
            onError={() => setBackdropError(true)}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-[#0d0d0f] to-[#0d0d0f]" />
        )}

        <div className="absolute inset-0 bg-[#0d0d0f]/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d0d0f] via-[#0d0d0f]/75 to-[#0d0d0f]/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0f] via-transparent to-[#0d0d0f]/30" />

        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-20">
          <div className="grid items-end gap-8 md:grid-cols-[220px_1fr] lg:grid-cols-[260px_1fr] lg:gap-12">
            <div className="mx-auto w-44 sm:w-52 md:mx-0 md:w-full">
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl shadow-black/50">
                {showPoster ? (
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    onError={() => setPosterError(true)}
                    className="aspect-[2/3] w-full object-cover"
                  />
                ) : (
                  <div className="flex aspect-[2/3] items-center justify-center px-4 text-center text-sm text-white/35">
                    No poster available
                  </div>
                )}
              </div>
            </div>

            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-400">
                Movie details
              </p>

              <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                {movie.title}
              </h1>

              <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-white/60">
                {movie.year && <span>{movie.year}</span>}

                {movie.runtime && (
                  <>
                    <span className="text-white/25">•</span>
                    <span>{movie.runtime} min</span>
                  </>
                )}

                {typeof movie.rating === "number" && (
                  <>
                    <span className="text-white/25">•</span>
                    <span className="font-semibold text-amber-300">
                      ★ {movie.rating.toFixed(1)}
                    </span>
                  </>
                )}

                {movie.voteCount > 0 && (
                  <>
                    <span className="text-white/25">•</span>
                    <span>
                      {movie.voteCount.toLocaleString()} votes
                    </span>
                  </>
                )}
              </div>

              {movie.genres?.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {movie.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-xs font-medium text-white/70 backdrop-blur-sm"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-7">
                <WishlistButton movie={movie} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-8 lg:py-16">
        <main>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">
              The story
            </p>

            <h2 className="mt-2 text-2xl font-semibold text-white">
              Overview
            </h2>

            <p className="mt-5 max-w-3xl text-base leading-8 text-white/60">
              {movie.overview ||
                "No overview is available for this movie."}
            </p>
          </div>

          {movie.cast?.length > 0 && (
            <section className="mt-14">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">
                  The cast
                </p>

                <h2 className="mt-2 text-2xl font-semibold text-white">
                  Cast & crew
                </h2>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {movie.cast.map((person) => (
                  <div
                    key={person.id || person.name}
                    className="group rounded-xl border border-white/10 bg-white/[0.03] p-3 transition hover:border-white/15 hover:bg-white/[0.05]"
                  >
                    <div className="overflow-hidden rounded-lg bg-white/5">
                      {person.profileUrl ? (
                        <img
                          src={person.profileUrl}
                          alt={person.name}
                          loading="lazy"
                          decoding="async"
                          className="aspect-[3/4] w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <div className="flex aspect-[3/4] items-center justify-center text-xs text-white/30">
                          No photo
                        </div>
                      )}
                    </div>

                    <div className="mt-3">
                      <p className="truncate text-sm font-semibold text-white">
                        {person.name}
                      </p>

                      {person.character && (
                        <p className="mt-1 truncate text-xs text-white/40">
                          {person.character}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
          <SimilarMovies movieId={movie.id} />
        </main>

        <aside className="h-fit rounded-2xl border border-white/10 bg-white/[0.03] p-5 lg:sticky lg:top-24">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/35">
            Movie information
          </p>

          <dl className="mt-5 space-y-5">
            {movie.releaseDate && (
              <div>
                <dt className="text-xs text-white/35">
                  Release date
                </dt>
                <dd className="mt-1 text-sm text-white/80">
                  {movie.releaseDate}
                </dd>
              </div>
            )}

            {movie.runtime && (
              <div>
                <dt className="text-xs text-white/35">
                  Runtime
                </dt>
                <dd className="mt-1 text-sm text-white/80">
                  {movie.runtime} minutes
                </dd>
              </div>
            )}

            {typeof movie.rating === "number" && (
              <div>
                <dt className="text-xs text-white/35">
                  Rating
                </dt>
                <dd className="mt-1 text-sm font-semibold text-amber-300">
                  ★ {movie.rating.toFixed(1)} / 10
                </dd>
              </div>
            )}

            {movie.genres?.length > 0 && (
              <div>
                <dt className="text-xs text-white/35">
                  Genres
                </dt>
                <dd className="mt-2 flex flex-wrap gap-2">
                  {movie.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="rounded-md bg-white/5 px-2 py-1 text-xs text-white/60"
                    >
                      {genre.name}
                    </span>
                  ))}
                </dd>
              </div>
            )}
          </dl>
        </aside>
      </div>
    </section>
  );
}

export default MovieDetailsPage;

