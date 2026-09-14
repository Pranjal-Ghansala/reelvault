# REELVAULT

A cinematic movie discovery application built with React, Node.js, Express, PostgreSQL, and TMDB.

REELVAULT is designed as a real movie discovery product rather than a simple API demo. Users can discover movies without searching, refine results using filters and sorting, search for specific titles, view detailed movie information, and maintain a persistent wishlist.

## Features

* Browse movies without entering a search
* Search movies by title or keyword
* Filter movies by:

  * Genre
  * Release year
  * Minimum rating
* Sort results by:

  * Relevance
  * Popularity
  * Rating
  * Newest
  * Oldest
* Paginated movie results
* Movie detail pages with:

  * Overview
  * Rating
  * Release information
  * Genres
  * Runtime
  * Cast
  * Poster and backdrop artwork
* Persistent wishlist
* Anonymous users with signed cookies
* PostgreSQL wishlist persistence
* Wishlist snapshot storage
* Context-preserving navigation between lists and movie details
* Responsive layout for different screen sizes
* Loading, empty, and error states
* Retry handling
* Request cancellation for rapidly changing searches and filters
* Backend caching
* In-flight request deduplication
* API rate limiting
* Request validation with Zod
* External API timeout handling
* Normalized movie data exposed by the backend

## Tech Stack

### Frontend

* React
* Vite
* JavaScript / JSX
* React Router
* Redux Toolkit
* React Redux
* Tailwind CSS
* Native Fetch API

### Backend

* Node.js
* Express
* JavaScript
* Zod
* PostgreSQL
* `pg`
* `cookie-parser`
* `cors`
* `express-rate-limit`

### External Service

* TMDB API

## Architecture

The frontend does not communicate directly with TMDB.

```text
React Frontend
      |
      | REST API
      v
Node.js / Express
      |
      +--------------------+
      |                    |
      v                    v
 PostgreSQL              TMDB API
      |
      v
 Wishlist
```

The backend acts as an abstraction layer between the frontend and TMDB.

This allows the application to:

* Keep the TMDB API key on the server
* Validate incoming requests
* Normalize external movie data
* Apply caching
* Deduplicate identical in-flight requests
* Handle external service failures consistently
* Control access to the external API
* Keep the frontend independent of the TMDB response format

## Movie Data Flow

For discovery and search requests:

```text
User interaction
      ↓
React page
      ↓
Redux / React state
      ↓
Frontend API module
      ↓
Express route
      ↓
Zod validation
      ↓
Controller
      ↓
Movie service
      ↓
Cache / request deduplication
      ↓
TMDB
      ↓
Movie normalization
      ↓
Frontend
```

Movie responses are converted into an application-specific format rather than exposing raw TMDB responses.

Example normalized movie:

```js
{
  id,
  title,
  overview,
  releaseDate,
  year,
  rating,
  voteCount,
  posterUrl,
  backdropUrl,
  genres,
  runtime,
  cast
}
```

## Wishlist Architecture

Wishlist data is persisted in PostgreSQL.

The application creates an anonymous user identifier and stores it in a signed HTTP-only cookie.

The database contains:

```text
users
  id
  created_at

wishlist_movies
  id
  user_id
  movie_id
  movie_snapshot
  created_at
```

A unique constraint on `(user_id, movie_id)` prevents duplicate wishlist entries.

Movie snapshots are stored rather than the complete raw TMDB response. This allows the wishlist to continue displaying the saved movie information without requiring TMDB to be queried every time the wishlist is opened.

## API

### Discover movies

```http
GET /api/movies/discover
```

Supported parameters include:

```text
genre
year
rating
sort
page
```

### Search movies

```http
GET /api/movies/search
```

Supported parameters include:

```text
q
genre
year
rating
sort
page
```

### Movie details

```http
GET /api/movies/:id
```

### Get wishlist

```http
GET /api/wishlist
```

### Add movie to wishlist

```http
POST /api/wishlist
```

### Remove movie from wishlist

```http
DELETE /api/wishlist/:movieId
```

### Health check

```http
GET /api/health
```

## Project Structure

```text
reelvault/
├── client/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── features/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.example
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── app.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
│
├── .gitignore
└── README.md
```

## Setup

### Requirements

* Node.js 18+
* PostgreSQL
* TMDB API key

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd reelvault
```

### 2. Install frontend dependencies

```bash
cd client
npm install
```

### 3. Install backend dependencies

```bash
cd ../server
npm install
```

### 4. Configure backend environment variables

Create:

```text
server/.env
```

Example:

```env
PORT=5000
CLIENT_URL=http://localhost:5173
DATABASE_URL=postgresql://username:password@localhost:5432/reelvault
TMDB_API_KEY=your_tmdb_api_key
TMDB_BASE_URL=https://api.themoviedb.org/3
COOKIE_SECRET=replace_with_a_long_random_secret
```

`COOKIE_SECRET` should be a long random value of at least 32 characters.

### 5. Configure frontend environment variables

Create:

```text
client/.env
```

Example:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 6. Create the PostgreSQL database

Create a PostgreSQL database named:

```text
reelvault
```

Run the project's database schema/migrations before starting the backend.

### 7. Start the backend

From `server/`:

```bash
npm run dev
```

The API should be available at:

```text
http://localhost:5000
```

### 8. Start the frontend

From `client/`:

```bash
npm run dev
```

The application should be available at:

```text
http://localhost:5173
```

## Environment Variables

Never commit real secrets.

### Backend

| Variable        | Purpose                      |
| --------------- | ---------------------------- |
| `PORT`          | Express server port          |
| `CLIENT_URL`    | Allowed frontend origin      |
| `DATABASE_URL`  | PostgreSQL connection string |
| `TMDB_API_KEY`  | TMDB authentication          |
| `TMDB_BASE_URL` | TMDB API base URL            |
| `COOKIE_SECRET` | Signed cookie secret         |

### Frontend

| Variable            | Purpose              |
| ------------------- | -------------------- |
| `VITE_API_BASE_URL` | Backend API base URL |

## Handling Real-World Scenarios

### Repeated requests

A lightweight server-side TTL cache stores successful movie responses.

Different TTLs are used for different request types:

* Discover: 5 minutes
* Search: 2 minutes
* Movie details: 10 minutes

### Duplicate requests

An in-flight request cache prevents multiple identical requests from reaching TMDB simultaneously.

### Rapid searches and filter changes

The frontend uses:

* Debounced search input
* `AbortController`
* Effect cleanup

This prevents unnecessary requests and ignores cancelled requests when users change their input quickly.

### Slow external service

TMDB requests have an 8-second timeout.

Timeouts are converted into application-level service errors rather than leaving requests hanging indefinitely.

### External service failures

TMDB failures are converted into controlled backend errors.

The frontend displays an appropriate error state with retry functionality.

### Incomplete external data

Movie normalization provides safe defaults for missing:

* Posters
* Backdrops
* Overview text
* Ratings
* Release dates
* Genres
* Runtime
* Cast information

### API limitations

The backend uses rate limiting to reduce excessive API usage.

There is also a stricter rate limit for search requests.

### Large result sets

Results are paginated rather than loading the complete result set at once.

The frontend also uses lazy-loaded movie poster images.

## Validation and Security

Incoming API requests are validated using Zod.

The TMDB API key is only used by the backend and is never exposed to the browser.

Wishlist identity is maintained using a signed, HTTP-only cookie.

CORS is configured to allow requests from the configured frontend origin.

API rate limiting is applied to reduce abuse and unnecessary external API usage.

## Design Approach

The visual direction was intentionally designed to feel like a movie discovery product rather than an administrative interface.

The interface uses:

* Dark cinematic surfaces
* Strong movie artwork
* Restrained accent color usage
* Clear typography hierarchy
* Responsive movie grids
* Minimal navigation
* Context-preserving detail navigation
* Explicit loading and failure feedback

The goal was to keep the interface editorial, focused, and image-led while still providing useful filtering and sorting controls.

## Assumptions

* Users do not need to create an account for the assignment.
* Wishlist identity is maintained anonymously through a signed cookie.
* Wishlist movie snapshots are sufficient for displaying saved movies.
* TMDB is the source of truth for movie information.
* The application does not attempt to mirror every TMDB feature.
* Pagination is sufficient for exploring large result sets.
* The application is intended primarily as a movie discovery experience rather than a full streaming platform.

## Known Limitations

* The anonymous wishlist is tied to the browser cookie and is not transferable between devices.
* The server cache is in-memory and therefore resets when the server restarts.
* The cache is local to a single backend instance and would need a shared cache such as Redis for multi-instance deployment.
* TMDB availability and rate limits can still affect movie discovery.
* There is no authenticated user account system.
* Wishlist snapshots can become outdated if movie information changes on TMDB.

## What I Would Improve With More Time

* Add richer discovery sections such as trending, upcoming, and genre-specific collections.
* Add URL-persisted discovery filters so browsing state can be shared and restored directly.
* Add more advanced pagination or infinite scrolling depending on usage patterns.
* Add automated frontend and backend tests.
* Add integration tests around the wishlist and movie API.
* Introduce Redis for distributed caching in production.
* Add structured logging and monitoring.
* Improve image handling with responsive image sizes.
* Add accessibility testing and keyboard-navigation refinements.
* Add production deployment configuration.
* Add authenticated accounts if cross-device wishlist synchronization becomes a requirement.

## AI Usage

AI-assisted development tools were used as supporting tools during implementation.

They were used to:

* Explore implementation approaches.
* Generate and refine initial boilerplate.
* Understand library and API behaviour.
* Troubleshoot frontend and backend errors.
* Review code structure.
* Improve error handling and edge-case behaviour.
* Refine UI and responsive behaviour.

The final architecture, database model, API structure, application behaviour, and implementation decisions were reviewed and adapted as part of the development process.

## License

This project was created as a full-stack development assignment.

```
```
