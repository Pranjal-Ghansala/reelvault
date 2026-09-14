CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS wishlist_movies (
    id BIGSERIAL PRIMARY KEY,

    user_id UUID NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

    movie_id INTEGER NOT NULL,

    movie_snapshot JSONB NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT unique_user_movie
        UNIQUE (user_id, movie_id)
);

CREATE INDEX IF NOT EXISTS idx_wishlist_movies_user_id
    ON wishlist_movies(user_id);