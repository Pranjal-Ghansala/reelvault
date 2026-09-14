import {
  discoverMovies,
  searchMovies,
  getMovieDetails,
  getSimilarMovies,
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


export async function getSimilarMoviesController(req, res, next) {
  try {
    const result = await getSimilarMovies(
      req.validated.params.id,
      req.validated.query.page
    );

    res.json(result);
  } catch (error) {
    next(error);
  }
}

