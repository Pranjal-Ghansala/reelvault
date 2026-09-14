
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import WishlistButton from "./WishlistButton.jsx";

function MovieCard({ movie }) {
  const location = useLocation();
  const [imageError, setImageError] = useState(false);

  const from = `${location.pathname}${location.search}`;
  const showPoster = movie.posterUrl && !imageError;

  return (
    <article className="group relative">
      <Link
        to={`/movie/${movie.id}?from=${encodeURIComponent(from)}`}
        className="block rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
      >
        <div className="relative aspect-[2/3] overflow-hidden rounded-2xl bg-white/5 shadow-lg shadow-black/20">
          {showPoster ? (
            <img
              src={movie.posterUrl}
              alt={movie.title}
              loading="lazy"
              decoding="async"
              onError={() => setImageError(true)}
              className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-[1.06]"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-white/10 to-white/[0.02] px-4 text-center text-sm text-white/40">
              No poster available
            </div>
          )}

          {/* Bottom readability gradient */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-70 transition duration-300 group-hover:opacity-100" />

          {/* Hover information */}
          <div className="absolute inset-x-0 bottom-0 translate-y-2 p-4 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <div className="flex flex-wrap items-center gap-2 text-xs text-white/75">
              {movie.year && <span>{movie.year}</span>}

              {typeof movie.rating === "number" && (
                <>
                  <span className="text-white/30">•</span>
                  <span className="text-amber-300">
                    ★ {movie.rating.toFixed(1)}
                  </span>
                </>
              )}
            </div>

            {movie.genres?.length > 0 && (
              <p className="mt-1 truncate text-xs text-white/50">
                {movie.genres
                  .slice(0, 2)
                  .map((genre) => genre.name)
                  .join(" · ")}
              </p>
            )}
          </div>
        </div>

        <div className="mt-3 px-0.5">
          <h3 className="truncate text-sm font-semibold text-white transition-colors duration-200 group-hover:text-amber-300">
            {movie.title}
          </h3>

          <div className="mt-1.5 flex items-center gap-2 text-xs text-white/45">
            {movie.year && <span>{movie.year}</span>}

            {typeof movie.rating === "number" && (
              <>
                <span className="text-white/20">•</span>
                <span>★ {movie.rating.toFixed(1)}</span>
              </>
            )}
          </div>
        </div>
      </Link>

      {/* Wishlist stays independent from the movie link */}
      <div className="absolute right-3 top-3 z-10">
        <WishlistButton movie={movie} />
      </div>
    </article>
  );
}

export default MovieCard;

