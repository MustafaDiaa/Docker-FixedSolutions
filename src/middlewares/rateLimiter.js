const rateLimit = require('express-rate-limit');

// General API rate limiter
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    status: 429,
    message: "Too many requests from this IP, please try again later."
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Auth specific limiter (stricter)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: {
    status: 429,
    message: "Too many auth requests from this IP, please try again later."
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { generalLimiter, authLimiter };
