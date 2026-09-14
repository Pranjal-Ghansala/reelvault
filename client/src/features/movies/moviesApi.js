
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      Accept: "application/json",
      ...options.headers,
    },
    signal: options.signal,
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(
      data?.error?.message || "Something went wrong."
    );

    error.code = data?.error?.code;
    error.status = response.status;

    throw error;
  }

  return data;
}

export function fetchDiscoverMovies(params = {}, options = {}) {
  const searchParams = new URLSearchParams();

  if (params.genre) {
    searchParams.set("genre", params.genre);
  }

  if (params.year) {
    searchParams.set("year", params.year);
  }

  if (params.rating !== undefined && params.rating !== "") {
    searchParams.set("rating", params.rating);
  }

  if (params.sort) {
    searchParams.set("sort", params.sort);
  }

  searchParams.set("page", params.page || 1);

  return request(
    `/movies/discover?${searchParams.toString()}`,
    options
  );
}

export function fetchSearchMovies(params = {}, options = {}) {
  const searchParams = new URLSearchParams();

  const query = params.q || params.query || "";

  if (query.trim()) {
    searchParams.set("q", query.trim());
  }

  searchParams.set("page", params.page || 1);

  if (params.sort) {
    searchParams.set("sort", params.sort);
  }

  if (params.genre) {
    searchParams.set("genre", params.genre);
  }

  if (params.year) {
    searchParams.set("year", params.year);
  }

  if (params.rating !== undefined && params.rating !== "") {
    searchParams.set("rating", params.rating);
  }

  return request(
    `/movies/search?${searchParams.toString()}`,
    options
  );
}

export function fetchMovieDetails(movieId, options = {}) {
  return request(`/movies/${movieId}`, options);
}

