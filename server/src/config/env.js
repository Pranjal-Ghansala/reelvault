import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().default(5000),
  CLIENT_URL: z.string().url().default("http://localhost:5173"),
  DATABASE_URL: z.string().min(1),
  TMDB_API_KEY: z.string().min(1),
  TMDB_BASE_URL: z.string().url().default("https://api.themoviedb.org/3"),
  COOKIE_SECRET: z.string().min(32),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error("Invalid environment configuration:");
  console.error(result.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = result.data;