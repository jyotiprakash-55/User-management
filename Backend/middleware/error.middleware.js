const ApiError = require('../utils/ApiError');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  if (error.code === 'ER_DUP_ENTRY') {
    error = new ApiError(400, 'Duplicate entry found');
  }

  res.status(error.statusCode || 500).json({
    status: error.status || 'error',
    message: error.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler; 