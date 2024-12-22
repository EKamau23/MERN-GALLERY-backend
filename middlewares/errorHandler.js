// Error handler middleware
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);  // Log the error stack

  // Check for specific error types and return appropriate responses
  if (err instanceof SyntaxError) {
      return res.status(400).json({ message: 'Invalid JSON' });
  }

  // Handle other errors with a generic message
  res.status(err.status || 500).json({
      message: err.message || 'Internal Server Error',
      error: err.stack
  });
};

module.exports = errorHandler;
