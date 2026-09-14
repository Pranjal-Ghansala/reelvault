
import MovieCard from "./MovieCard.jsx";

function DiscoveryRow({
  title,
  eyebrow,
  movies = [],
  loading = false,
}) {
  if (!loading && !movies.length) {
    return null;
  }

  return (
    <section className="mt-14">
      <div className="flex items-end justify-between gap-4">
        <div>
          {eyebrow && (
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">
              {eyebrow}
            </p>
          )}

          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            {title}
          </h2>
        </div>

        {!loading && (
          <span className="hidden text-xs text-white/30 sm:block">
            Explore more
          </span>
        )}
      </div>

      <div className="mt-7 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex gap-4 sm:gap-5">
          {loading
            ? Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="w-36 shrink-0 animate-pulse sm:w-44 md:w-48"
                >
                  <div className="aspect-[2/3] rounded-2xl bg-white/10" />
                  <div className="mt-3 h-4 rounded bg-white/10" />
                  <div className="mt-2 h-3 w-2/3 rounded bg-white/5" />
                </div>
              ))
            : movies.map((movie) => (
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

export default DiscoveryRow;

