import rateLimit from "express-rate-limit";

const apiRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,

  message: {
    error: {
      code: "RATE_LIMITED",
      message: "Too many requests. Please try again shortly.",
    },
  },
});

const searchRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 30,
  standardHeaders: "draft-7",
  legacyHeaders: false,

  message: {
    error: {
      code: "SEARCH_RATE_LIMITED",
      message: "Too many searches. Please try again shortly.",
    },
  },
});

export {
  apiRateLimiter,
  searchRateLimiter,
};