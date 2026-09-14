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
        className="block rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
      >
        <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-white/5">
          {showPoster ? (
            <img
              src={movie.posterUrl}
              alt={movie.title}
              loading="lazy"
              decoding="async"
              onError={() => setImageError(true)}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full items-center justify-center px-4 text-center text-sm text-white/40">
              No poster available
            </div>
          )}
        </div>

        <div className="mt-3">
          <h3 className="truncate text-sm font-semibold text-white">
            {movie.title}
          </h3>

          <div className="mt-1 flex items-center gap-2 text-xs text-white/50">
            {movie.year && <span>{movie.year}</span>}

            {typeof movie.rating === "number" && (
              <>
                <span>•</span>
                <span>★ {movie.rating.toFixed(1)}</span>
              </>
            )}
          </div>
        </div>
      </Link>

      <div className="absolute right-3 top-3 z-10">
        <WishlistButton movie={movie} />
      </div>
    </article>
  );
}

export default MovieCard;