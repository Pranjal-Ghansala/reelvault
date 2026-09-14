import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { env } from "./config/env.js";

import movieRoutes from "./routes/movieRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import {
  apiRateLimiter,
} from "./middleware/rateLimiter.js";

import {
  notFound,
  errorHandler,
} from "./middleware/errorHandler.js";

const app = express();

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());

app.use(cookieParser(env.COOKIE_SECRET));

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "ReelVault API is running",
  });
});

app.use("/api", apiRateLimiter);

app.use("/api/movies", movieRoutes);
app.use("/api/wishlist", wishlistRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;