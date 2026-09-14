import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../services/wishlistService.js";

export async function getWishlistController(
  req,
  res,
  next
) {
  try {
    const movies = await getWishlist(req.userId);

    res.json({
      data: movies,
    });
  } catch (error) {
    next(error);
  }
}

export async function addToWishlistController(req, res, next) {
  try {
    const movie = await addToWishlist(
      req.userId,
      req.validated.body
    );

    res.status(201).json({
      data: movie,
    });
  } catch (error) {
    next(error);
  }
}

export async function removeFromWishlistController(
  req,
  res,
  next
) {
  try {
    const movieId = Number(req.params.movieId);

    if (!Number.isInteger(movieId)) {
      return res.status(400).json({
        error: {
          code: "INVALID_MOVIE_ID",
          message: "Movie ID must be a valid number.",
        },
      });
    }

    const removed = await removeFromWishlist(
      req.userId,
      movieId
    );

    if (!removed) {
      return res.status(404).json({
        error: {
          code: "WISHLIST_MOVIE_NOT_FOUND",
          message: "Movie is not in the wishlist.",
        },
      });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}