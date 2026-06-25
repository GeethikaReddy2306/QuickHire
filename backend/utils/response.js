function successResponse(res, statusCode, message, data = {}) {
  return res.status(statusCode).json({
    message,
    success: true,
    ...data
  });
}

function errorResponse(res, statusCode, message, data = {}) {
  return res.status(statusCode).json({
    message,
    success: false,
    ...data
  });
}

module.exports = {
  successResponse,
  errorResponse
};
