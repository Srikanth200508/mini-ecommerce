// Centralized Error Handling Middleware

function notFoundHandler(req, res, next) {
  res.status(404).json({
    success: false,
    message: `Resource not found: ${req.method} ${req.originalUrl}`,
  });
}

function globalErrorHandler(err, req, res, next) {
  console.error('Unhandled Server Error:', err);
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'An unexpected internal server error occurred.',
  });
}

module.exports = {
  notFoundHandler,
  globalErrorHandler,
};

