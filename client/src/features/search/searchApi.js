
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000/api";

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

export function searchMovies(params = {}, options = {}) {
  const searchParams = new URLSearchParams();

  const query = params.query || params.q || "";

  if (!query.trim()) {
    throw new Error("Please enter a movie name.");
  }

  searchParams.set("q", query.trim());

  if (params.genre) {
    searchParams.set("genre", String(params.genre));
  }

  if (params.year) {
    searchParams.set("year", String(params.year));
  }

  if (params.rating !== undefined && params.rating !== "") {
    searchParams.set("rating", String(params.rating));
  }

  if (params.sort) {
    searchParams.set("sort", params.sort);
  }

  searchParams.set("page", String(params.page || 1));

  return request(
    `/movies/search?${searchParams.toString()}`,
    options
  );
}

