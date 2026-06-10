const jwt = require("jsonwebtoken");
async function isAuthenticated(req, res, next) {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                message: "User unauthorized",
                success: false
            });
        }

        const decode = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        if (!decode) {
            return res.status(401).json({
                message: "Invalid token",
                success: false
            });
        }

        req.id = decode.userId;
        next();

    } catch (error) {
        return res.status(401).json({
            message: "Token expired or invalid",
            success: false
        });
    }
}

module.exports = isAuthenticated;