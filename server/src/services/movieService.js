import {
  discoverMovies as tmdbDiscoverMovies,
  searchMovies as tmdbSearchMovies,
  getMovieDetails as tmdbGetMovieDetails,
   getSimilarMovies as tmdbGetSimilarMovies,
} from "./tmdbService.js";

import {
  getCached,
  setCached,
} from "./cacheService.js";

import { dedupeRequest } from "./requestCache.js";

const TMDB_GENRES = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Science Fiction",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
};

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

function getImageUrl(path, size = "w500") {
  if (!path) {
    return null;
  }

  return `${IMAGE_BASE_URL}/${size}${path}`;
}

function getYear(releaseDate) {
  if (!releaseDate) {
    return null;
  }

  const year = Number.parseInt(releaseDate.slice(0, 4), 10);

  return Number.isNaN(year) ? null : year;
}

function normalizeGenre(genre) {
  return {
    id: genre.id,
    name: genre.name,
  };
}

function normalizeMovie(movie) {
  let genres = [];

  if (Array.isArray(movie.genres)) {
    genres = movie.genres.map(normalizeGenre);
  } else if (Array.isArray(movie.genre_ids)) {
    genres = movie.genre_ids
      .map((id) => ({
        id,
        name: TMDB_GENRES[id] || "Unknown",
      }))
      .filter((genre) => genre.name !== "Unknown");
  }

  return {
    id: movie.id,
    title: movie.title || movie.name || "Untitled",
    overview: movie.overview || "",
    releaseDate: movie.release_date || null,
    year: getYear(movie.release_date),

    rating:
      typeof movie.vote_average === "number"
        ? movie.vote_average
        : null,

    voteCount:
      typeof movie.vote_count === "number"
        ? movie.vote_count
        : 0,

    posterUrl: getImageUrl(movie.poster_path, "w500"),
    backdropUrl: getImageUrl(movie.backdrop_path, "original"),

    genres,

    runtime:
      typeof movie.runtime === "number"
        ? movie.runtime
        : null,

    cast: [],
  };
}

function normalizeCredits(credits) {
  if (!credits?.cast || !Array.isArray(credits.cast)) {
    return [];
  }

  return credits.cast.slice(0, 10).map((person) => ({
    id: person.id,
    name: person.name,
    character: person.character || null,
    profileUrl: getImageUrl(person.profile_path, "w185"),
  }));
}

export async function discoverMovies(params = {}) {
  const cacheKey = `discover:${JSON.stringify(params)}`;

  const cached = getCached(cacheKey);

  if (cached) {
    return cached;
  }

  return dedupeRequest(cacheKey, async () => {
    const secondCacheCheck = getCached(cacheKey);

    if (secondCacheCheck) {
      return secondCacheCheck;
    }

    const response = await tmdbDiscoverMovies(params);

    const result = {
      data: Array.isArray(response.results)
        ? response.results.map(normalizeMovie)
        : [],

      pagination: {
        page: response.page || 1,
        totalPages: response.total_pages || 1,
        totalResults: response.total_results || 0,
      },
    };

    setCached(cacheKey, result, 5 * 60 * 1000);

    return result;
  });
}

export async function searchMovies(params) {
  const cacheKey = `search:${JSON.stringify(params)}`;

  const cached = getCached(cacheKey);

  if (cached) {
    return cached;
  }

  return dedupeRequest(cacheKey, async () => {
    const secondCacheCheck = getCached(cacheKey);

    if (secondCacheCheck) {
      return secondCacheCheck;
    }

    const response = await tmdbSearchMovies(params);

    const result = {
      data: Array.isArray(response.results)
        ? response.results.map(normalizeMovie)
        : [],

      pagination: {
        page: response.page || 1,
        totalPages: response.total_pages || 1,
        totalResults: response.total_results || 0,
      },
    };

    setCached(cacheKey, result, 2 * 60 * 1000);

    return result;
  });
}

export async function getMovieDetails(movieId) {
  const cacheKey = `movie:${movieId}`;

  const cached = getCached(cacheKey);

  if (cached) {
    return cached;
  }

  return dedupeRequest(cacheKey, async () => {
    const secondCacheCheck = getCached(cacheKey);

    if (secondCacheCheck) {
      return secondCacheCheck;
    }

    const response = await tmdbGetMovieDetails(movieId);

    const movie = normalizeMovie(response);

    const result = {
      ...movie,
      cast: normalizeCredits(response.credits),
    };

    setCached(cacheKey, result, 10 * 60 * 1000);

    return result;
  });
}

export async function getSimilarMovies(movieId, page = 1) {
  const cacheKey = `similar:${movieId}:${page}`;

  const cached = getCached(cacheKey);

  if (cached) {
    return cached;
  }

  const result = await dedupeRequest(cacheKey, async () => {
    const response = await tmdbGetSimilarMovies(movieId, page);

    const data = (response.results || []).map(normalizeMovie);

    const normalized = {
      data,
      pagination: {
        page: response.page || page,
        totalPages: response.total_pages || 0,
        totalResults: response.total_results || 0,
      },
    };

    setCached(cacheKey, normalized, 10 * 60 * 1000);

    return normalized;
  });

  return result;
}

