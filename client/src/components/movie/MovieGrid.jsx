
import MovieCard from "./MovieCard.jsx";

function MovieGrid({ movies }) {
  if (!movies?.length) return null;

  return (
    <div className="grid w-full grid-cols-2 gap-x-3 gap-y-9 sm:grid-cols-3 sm:gap-x-5 sm:gap-y-10 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}

export default MovieGrid;

