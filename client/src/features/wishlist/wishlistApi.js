const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000/api";

async function request(path, options = {}) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
  } catch (error) {
    const networkError = new Error(
      "Network error. Please check your connection and try again."
    );

    networkError.code = "NETWORK_ERROR";
    throw networkError;
  }

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    const error = new Error(
      body?.error?.message ||
        "Something went wrong. Please try again."
    );

    error.code = body?.error?.code;
    error.status = response.status;

    throw error;
  }

  return body;
}

export function fetchWishlist(options = {}) {
  return request("/wishlist", {
    ...options,
  });
}

export function addToWishlist(movie, options = {}) {
  return request("/wishlist", {
    method: "POST",
    body: JSON.stringify(movie),
    ...options,
  });
}

export function removeFromWishlist(movieId, options = {}) {
  return request(`/wishlist/${movieId}`, {
    method: "DELETE",
    ...options,
  });
}