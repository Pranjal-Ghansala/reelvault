import { Link, useLocation } from "react-router-dom";

function FeaturedMovie({ movie }) {
  const location = useLocation();

const from = `${location.pathname}${location.search}`;
const detailsUrl = `/movie/${movie.id}?from=${encodeURIComponent(from)}`;
  return (
    <section className="relative overflow-hidden border-b border-white/10">
      {movie.backdropUrl && (
        <img
          src={movie.backdropUrl}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}

      <div className="absolute inset-0 bg-[#0d0d0f]/75" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0d0d0f] via-[#0d0d0f]/80 to-[#0d0d0f]/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0f] via-transparent to-[#0d0d0f]/20" />

      <div className="relative mx-auto flex min-h-[520px] max-w-7xl items-end px-4 py-16 sm:px-6 sm:py-20 lg:min-h-[600px] lg:px-8 lg:py-24">
        <div className="max-w-2xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-amber-400">
            Featured film
          </p>

          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
            {movie.title}
          </h1>

          <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-white/60">
            {movie.year && <span>{movie.year}</span>}

            {movie.rating && (
              <>
                <span aria-hidden="true">•</span>
                <span className="text-amber-400">
                  ★ {movie.rating.toFixed(1)}
                </span>
              </>
            )}

           {movie.genres?.length > 0 && (
  <>
    <span aria-hidden="true">•</span>

    <span>
      {movie.genres
        .slice(0, 2)
        .map((genre) => genre.name)
        .join(" · ")}
    </span>
  </>
)}
          </div>

          <p className="mt-6 line-clamp-3 max-w-xl text-sm leading-7 text-white/65 sm:text-base">
            {movie.overview}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
  to={detailsUrl}
  className="inline-flex rounded-lg bg-[#f5f1e8] px-5 py-3 text-sm font-semibold text-[#0d0d0f] transition hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
>
  View Details
</Link>

            <button
              type="button"
              className="rounded-lg border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              ♡ Add to Wishlist
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeaturedMovie;