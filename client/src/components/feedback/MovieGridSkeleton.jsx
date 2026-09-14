function MovieGridSkeleton({ count = 10 }) {
  return (
    <div
      className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:gap-x-5 lg:grid-cols-4 xl:grid-cols-5"
      aria-busy="true"
      aria-label="Loading movies"
    >
      {Array.from({ length: count }).map((_, index) => (
        <div key={index}>
          <div className="aspect-[2/3] animate-pulse rounded-xl bg-white/5" />

          <div className="mt-3 space-y-2">
            <div className="h-4 w-4/5 animate-pulse rounded bg-white/5" />
            <div className="h-3 w-2/5 animate-pulse rounded bg-white/5" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default MovieGridSkeleton;