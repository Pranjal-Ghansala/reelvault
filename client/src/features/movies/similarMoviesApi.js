
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export async function fetchSimilarMovies(movieId, page = 1, options = {}) {
  const params = new URLSearchParams({
    page: String(page),
  });

  let response;

  try {
    response = await fetch(
      `${API_BASE_URL}/movies/${movieId}/similar?${params.toString()}`,
      {
        credentials: "include",
        signal: options.signal,
      }
    );
  } catch (error) {
    if (error.name === "AbortError") {
      throw error;
    }

    throw new Error(
      "The movie service is currently unavailable. Please try again."
    );
  }

  let body = null;

  try {
    body = await response.json();
  } catch {
    throw new Error("The movie service returned an invalid response.");
  }

  if (!response.ok) {
    throw new Error(
      body?.error?.message ||
        "Similar movies couldn't be loaded. Please try again."
    );
  }

  return body;
}

