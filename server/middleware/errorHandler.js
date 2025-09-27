// server/middleware/errorHandler.js

/**
 * Centralized error handling middleware
 * Captures any thrown errors and formats consistent API responses
 */
function errorHandler(err, req, res, next) {
  console.error("Error:", err);

  // Set default status code and message
  const statusCode = err.statusCode || 500;
  const message =
    err.message || "An unexpected error occurred. Please try again later.";

  // Provide detailed stack only in development
  const response = {
    error: message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  };

  res.status(statusCode).json(response);
}

module.exports = errorHandler;
