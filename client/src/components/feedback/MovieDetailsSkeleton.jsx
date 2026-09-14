function MovieDetailsSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading movie details"
      className="animate-pulse"
    >
      <div className="h-[420px] rounded-2xl bg-white/5 sm:h-[520px]" />

      <div className="mx-auto mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          <div className="aspect-[2/3] rounded-xl bg-white/5" />

          <div>
            <div className="h-10 w-3/4 rounded bg-white/5" />
            <div className="mt-5 h-4 w-1/3 rounded bg-white/5" />
            <div className="mt-8 space-y-3">
              <div className="h-4 rounded bg-white/5" />
              <div className="h-4 rounded bg-white/5" />
              <div className="h-4 w-4/5 rounded bg-white/5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetailsSkeleton;