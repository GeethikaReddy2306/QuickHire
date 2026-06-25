const jwt = require("jsonwebtoken");
const { errorResponse } = require("../utils/response");

async function isAuthenticated(req, res, next) {
  try {
    const token = req.cookies.token;

    if (!token) {
      return errorResponse(res, 401, "User unauthorized");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded?.userId) {
      return errorResponse(res, 401, "Invalid token");
    }

    req.id = decoded.userId;
    req.role = decoded.role;
    next();
  } catch (error) {
    return errorResponse(res, 401, "Token expired or invalid");
  }
}

module.exports = isAuthenticated;
