import {
  useParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import { useAppSelector } from "../../hooks/redux.js";
import { useMovieDetails } from "../../features/movies/useMovieDetails.js";

import MovieDetailsSkeleton from "../../components/feedback/MovieDetailsSkeleton.jsx";
import WishlistButton from "../../components/movie/WishlistButton.jsx";

function MovieDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

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
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={handleBack}
          className="mb-8 text-sm text-white/60 transition hover:text-white"
        >
          ← Back
        </button>

        <div className="rounded-2xl border border-red-400/20 bg-red-400/5 p-8">
          <h1 className="text-xl font-semibold text-white">
            We couldn't load this movie.
          </h1>

          <p className="mt-2 text-sm text-white/60">
            {error || "Something went wrong while loading the movie."}
          </p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-black transition hover:bg-amber-300"
          >
            Try again
          </button>
        </div>
      </section>
    );
  }

  if (!movie) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={handleBack}
          className="mb-8 text-sm text-white/60 transition hover:text-white"
        >
          ← Back
        </button>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">
          <h1 className="text-xl font-semibold text-white">
            Movie not found
          </h1>

          <p className="mt-2 text-sm text-white/60">
            We couldn't find the movie you're looking for.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <button
        type="button"
        onClick={handleBack}
        className="mb-6 text-sm text-white/60 transition hover:text-white"
      >
        ← Back
      </button>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
        <div className="relative min-h-[420px] overflow-hidden">
          {movie.backdropUrl ? (
            <img
              src={movie.backdropUrl}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-white/5" />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0f] via-[#0d0d0f]/70 to-transparent" />

          <div className="relative z-10 flex min-h-[420px] items-end p-6 sm:p-8 lg:p-10">
            <div className="flex w-full flex-col gap-8 md:flex-row md:items-end">
              <div className="hidden w-48 shrink-0 md:block">
                <div className="overflow-hidden rounded-xl bg-white/5 shadow-2xl">
                  {movie.posterUrl ? (
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      className="aspect-[2/3] w-full object-cover"
                    />
                  ) : (
                    <div className="flex aspect-[2/3] items-center justify-center text-sm text-white/40">
                      No poster
                    </div>
                  )}
                </div>
              </div>

              <div className="max-w-3xl">
                <div className="flex flex-wrap items-center gap-3 text-sm text-white/60">
                  {movie.year && <span>{movie.year}</span>}

                  {movie.runtime && (
                    <>
                      <span>•</span>
                      <span>{movie.runtime} min</span>
                    </>
                  )}

                  {typeof movie.rating === "number" && (
                    <>
                      <span>•</span>
                      <span>
                        ★ {movie.rating.toFixed(1)}
                      </span>
                    </>
                  )}
                </div>

                <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                  {movie.title}
                </h1>

                {movie.genres?.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {movie.genres.map((genre) => (
                      <span
                        key={genre.id}
                        className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs text-white/70"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-6">
                  <WishlistButton movie={movie} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-10 p-6 sm:p-8 lg:grid-cols-[1fr_280px] lg:p-10">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Overview
            </h2>

            <p className="mt-4 max-w-3xl text-base leading-7 text-white/65">
              {movie.overview || "No overview is available for this movie."}
            </p>
          </div>

          {movie.cast?.length > 0 && (
            <aside>
              <h2 className="text-lg font-semibold text-white">
                Cast
              </h2>

              <div className="mt-4 space-y-4">
                {movie.cast.map((person) => (
                  <div
                    key={person.id || person.name}
                    className="flex items-center gap-3"
                  >
                    <div className="h-12 w-9 shrink-0 overflow-hidden rounded-md bg-white/5">
                      {person.profileUrl ? (
                        <img
                          src={person.profileUrl}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-white/30">
                          —
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-white">
                        {person.name}
                      </p>

                      {person.character && (
                        <p className="truncate text-xs text-white/45">
                          {person.character}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </aside>
          )}
        </div>
      </div>
    </section>
  );
}

export default MovieDetailsPage;