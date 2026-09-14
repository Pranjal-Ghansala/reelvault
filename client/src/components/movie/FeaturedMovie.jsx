
import { Link, useLocation } from "react-router-dom";
import WishlistButton from "./WishlistButton.jsx";

function FeaturedMovie({ movie }) {
  const location = useLocation();
  const from = `${location.pathname}${location.search}`;

  if (!movie) return null;

  return (
    <section className="relative overflow-hidden border-b border-white/10">
      {movie.backdropUrl ? (
        <img
          src={movie.backdropUrl}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : null}

      <div className="absolute inset-0 bg-black/65" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0d0d0f] via-[#0d0d0f]/80 to-[#0d0d0f]/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0f] via-transparent to-black/20" />

      <div className="relative mx-auto flex min-h-[520px] max-w-7xl items-end px-4 py-14 sm:min-h-[580px] sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-400">
            Featured tonight
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            {movie.title}
          </h1>

          <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-white/65">
            {movie.year && <span>{movie.year}</span>}

            {typeof movie.rating === "number" && (
              <>
                <span className="text-white/25">•</span>
                <span className="text-amber-300">
                  ★ {movie.rating.toFixed(1)}
                </span>
              </>
            )}

            {movie.runtime && (
              <>
                <span className="text-white/25">•</span>
                <span>{movie.runtime} min</span>
              </>
            )}

            {movie.genres?.length > 0 && (
              <>
                <span className="text-white/25">•</span>
                <span>
                  {movie.genres
                    .slice(0, 3)
                    .map((genre) => genre.name)
                    .join(" · ")}
                </span>
              </>
            )}
          </div>

          {movie.overview && (
            <p className="mt-6 line-clamp-3 max-w-xl text-sm leading-7 text-white/60 sm:text-base">
              {movie.overview}
            </p>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to={`/movie/${movie.id}?from=${encodeURIComponent(from)}`}
              className="rounded-lg bg-[#f5f1e8] px-5 py-3 text-sm font-semibold text-[#0d0d0f] transition hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              View details
            </Link>

            <WishlistButton movie={movie} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeaturedMovie;
