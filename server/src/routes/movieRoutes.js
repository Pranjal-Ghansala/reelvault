import { Router } from "express";
import { z } from "zod";

import {
  discoverMoviesController,
  searchMoviesController,
  getMovieDetailsController,
} from "../controllers/movieController.js";

import { validate } from "../middleware/validate.js";
import { searchRateLimiter } from "../middleware/rateLimiter.js";

const router = Router();

const discoverSchema = z.object({
  genre: z.string().regex(/^\d+$/).optional(),
  year: z.coerce.number().int().min(1900).max(2100).optional(),
  rating: z.coerce.number().min(0).max(10).optional(),
  sort: z
    .enum(["popularity", "rating", "newest", "oldest"])
    .default("popularity"),
  page: z.coerce.number().int().min(1).max(500).default(1),
});

const searchSchema = z.object({
  q: z.string().trim().min(1).max(100),
  page: z.coerce.number().int().min(1).max(500).default(1),
  sort: z
    .enum([
      "relevance",
      "popularity",
      "rating",
      "newest",
      "oldest",
    ])
    .default("relevance"),
  genre: z.string().regex(/^\d+$/).optional(),
  year: z.coerce.number().int().min(1900).max(2100).optional(),
  rating: z.coerce.number().min(0).max(10).optional(),
});

const movieIdSchema = z.object({
  id: z.coerce.number().int().positive(),
});

router.get(
  "/discover",
  validate(discoverSchema, "query"),
  discoverMoviesController
);

router.get(
  "/search",
  searchRateLimiter,
  validate(searchSchema, "query"),
  searchMoviesController
);

router.get(
  "/:id",
  validate(movieIdSchema, "params"),
  getMovieDetailsController
);

export default router;