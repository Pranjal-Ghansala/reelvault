import {
  discoverMovies,
  searchMovies,
  getMovieDetails,
} from "../services/movieService.js";

export async function discoverMoviesController(req, res, next) {
  try {
    const result = await discoverMovies(req.validated.query);

    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function searchMoviesController(req, res, next) {
  try {
    const result = await searchMovies(req.validated.query);

    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function getMovieDetailsController(req, res, next) {
  try {
    const result = await getMovieDetails(req.validated.params.id);

    res.json(result);
  } catch (error) {
    next(error);
  }
}