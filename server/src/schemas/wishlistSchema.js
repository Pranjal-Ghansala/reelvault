import { z } from "zod";

const genreSchema = z.object({
  id: z.number().int(),
  name: z.string().trim().min(1).max(100),
});

export const wishlistMovieSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().trim().min(1).max(300),
  overview: z.string().max(5000).default(""),
  releaseDate: z.string().nullable().optional(),
  year: z.number().int().min(1800).max(2200).nullable().optional(),
  rating: z.number().min(0).max(10).nullable().optional(),
  voteCount: z.number().int().min(0).optional(),
  posterUrl: z.string().url().nullable().optional(),
  backdropUrl: z.string().url().nullable().optional(),
  genres: z.array(genreSchema).max(10).default([]),
  runtime: z.number().int().positive().nullable().optional(),
  cast: z
    .array(
      z.object({
        id: z.number().int().positive().optional(),
        name: z.string().trim().min(1).max(200),
        character: z.string().max(200).optional(),
        profileUrl: z.string().url().nullable().optional(),
      })
    )
    .max(10)
    .default([]),
});