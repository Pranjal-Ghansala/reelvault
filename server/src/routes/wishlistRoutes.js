import { Router } from "express";
import { z } from "zod";

import {
  getWishlistController,
  addToWishlistController,
  removeFromWishlistController,
} from "../controllers/wishlistController.js";

import { anonymousUser } from "../middleware/anonymousUser.js";
import { validate } from "../middleware/validate.js";
import { wishlistMovieSchema } from "../schemas/wishlistSchema.js";

const router = Router();

router.use(anonymousUser);

// GET /api/wishlist
router.get("/", getWishlistController);

// POST /api/wishlist
router.post(
  "/",
  validate(wishlistMovieSchema, "body"),
  addToWishlistController
);

// DELETE /api/wishlist/:movieId
router.delete(
  "/:movieId",
  validate(
    z.object({
      movieId: z.coerce.number().int().positive(),
    }),
    "params"
  ),
  removeFromWishlistController
);

export default router;