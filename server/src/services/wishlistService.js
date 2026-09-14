import { query } from "../config/database.js";

export async function getWishlist(userId) {
  const result = await query(
    `
      SELECT
        movie_id,
        movie_snapshot,
        created_at
      FROM wishlist_movies
      WHERE user_id = $1
      ORDER BY created_at DESC
    `,
    [userId]
  );

  return result.rows.map((row) => row.movie_snapshot);
}

export async function addToWishlist(userId, movie) {
  const result = await query(
    `
      INSERT INTO wishlist_movies (
        user_id,
        movie_id,
        movie_snapshot
      )
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id, movie_id)
      DO UPDATE SET
        movie_snapshot = EXCLUDED.movie_snapshot
      RETURNING movie_snapshot
    `,
    [userId, movie.id, JSON.stringify(movie)]
  );

  return result.rows[0].movie_snapshot;
}

export async function removeFromWishlist(
  userId,
  movieId
) {
  const result = await query(
    `
      DELETE FROM wishlist_movies
      WHERE user_id = $1
        AND movie_id = $2
      RETURNING movie_id
    `,
    [userId, movieId]
  );

  return result.rowCount > 0;
}