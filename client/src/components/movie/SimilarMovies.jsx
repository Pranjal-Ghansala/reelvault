
import MovieCard from "./MovieCard.jsx";
import { useSimilarMovies } from "../../features/movies/useSimilarMovies.js";

function SimilarMovies({ movieId }) {
  const { items, status, error } = useSimilarMovies(movieId);

  if (status === "loading" || status === "idle") {
    return (
      <section className="mt-16">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">
            You might also like
          </p>

          <h2 className="mt-2 text-2xl font-semibold text-white">
            Similar movies
          </h2>
        </div>

        <div className="mt-6 flex gap-4 overflow-hidden">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="w-36 shrink-0 animate-pulse sm:w-44"
            >
              <div className="aspect-[2/3] rounded-2xl bg-white/10" />
              <div className="mt-3 h-4 rounded bg-white/10" />
              <div className="mt-2 h-3 w-2/3 rounded bg-white/5" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (status === "failed") {
    return (
      <section className="mt-16">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">
            You might also like
          </p>

          <h2 className="mt-2 text-2xl font-semibold text-white">
            Similar movies
          </h2>
        </div>

        <div
          role="alert"
          className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6"
        >
          <p className="text-sm font-semibold text-white">
            Recommendations unavailable
          </p>

          <p className="mt-2 text-sm leading-6 text-white/45">
            {error || "We couldn't load similar movies right now."}
          </p>
        </div>
      </section>
    );
  }

  if (!items.length) {
    return null;
  }

  return (
    <section className="mt-16 border-t border-white/10 pt-12">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">
            You might also like
          </p>

          <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
            Similar movies
          </h2>
        </div>

        <p className="hidden text-xs text-white/35 sm:block">
          More films to explore
        </p>
      </div>

      <div className="mt-7 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex gap-4 sm:gap-5">
          {items.map((movie) => (
            <div
              key={movie.id}
              className="w-36 shrink-0 sm:w-44 md:w-48"
            >
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SimilarMovies;

