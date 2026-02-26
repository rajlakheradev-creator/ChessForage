// middleware/authMiddleware.js
// Usage: apply to any route that requires a logged-in user
// e.g. router.get("/protected", authMiddleware, (req, res) => { ... })

const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) return res.status(401).json({ message: "No token provided" });

    // Header arrives as "Bearer <token>" — strip the prefix
    const token = authHeader.startsWith("Bearer ")
        ? authHeader.slice(7)
        : authHeader;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid or expired token" });
    }
};