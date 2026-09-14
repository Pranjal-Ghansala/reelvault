import { env } from "../config/env.js";

const TMDB_TIMEOUT_MS = 8000;

async function tmdbRequest(path, params = {}) {
  const searchParams = new URLSearchParams();

  searchParams.set("api_key", env.TMDB_API_KEY);
  searchParams.set("language", "en-US");

  Object.entries(params).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== null &&
      value !== ""
    ) {
      searchParams.set(key, String(value));
    }
  });

  const url =
    `${env.TMDB_BASE_URL}${path}?${searchParams.toString()}`;

  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, TMDB_TIMEOUT_MS);

  let response;

  try {
    response = await fetch(url, {
      signal: controller.signal,
    });
  } catch (error) {
    const serviceError = new Error(
      error.name === "AbortError"
        ? "Movie service timed out. Please try again."
        : "Movie service is currently unavailable."
    );

    serviceError.code =
      error.name === "AbortError"
        ? "MOVIE_SERVICE_TIMEOUT"
        : "MOVIE_SERVICE_UNAVAILABLE";

    serviceError.statusCode = 503;

    throw serviceError;
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    const body = await response.text();

    console.error("TMDB response error:", {
      status: response.status,
      body,
    });

    const serviceError = new Error(
      "Movie service returned an unsuccessful response."
    );

    serviceError.code = "MOVIE_SERVICE_UNAVAILABLE";
    serviceError.statusCode = 503;

    throw serviceError;
  }

  try {
    return await response.json();
  } catch {
    const serviceError = new Error(
      "Movie service returned invalid data."
    );

    serviceError.code = "MOVIE_SERVICE_INVALID_RESPONSE";
    serviceError.statusCode = 503;

    throw serviceError;
  }
}

function mapSortToTmdb(sort) {
  switch (sort) {
    case "rating":
      return "vote_average.desc";

    case "newest":
      return "primary_release_date.desc";

    case "oldest":
      return "primary_release_date.asc";

    case "popularity":
    default:
      return "popularity.desc";
  }
}

export function discoverMovies(params = {}) {
  return tmdbRequest("/discover/movie", {
    sort_by: mapSortToTmdb(params.sort),
    page: params.page || 1,
    with_genres: params.genre,
    primary_release_year: params.year,
    "vote_average.gte": params.rating,
    include_adult: "false",
  });
}

export async function searchMovies(params = {}) {
  const query = params.q || params.query;

  if (!query) {
    return {
      page: 1,
      total_pages: 0,
      total_results: 0,
      results: [],
    };
  }

  return tmdbRequest("/search/movie", {
    query,
    page: params.page || 1,
    include_adult: "false",
  });
}

export function getMovieDetails(movieId) {
  return tmdbRequest(`/movie/${movieId}`, {
    append_to_response: "credits",
  });
}