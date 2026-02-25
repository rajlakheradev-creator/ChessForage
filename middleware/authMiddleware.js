const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {          // ✅ req before res
    const authHeader = req.headers.authorization;

    if (!authHeader) return res.status(401).json({ message: "No token" });

    // Header arrives as "Bearer <token>" — we only want the token part
    const token = authHeader.startsWith("Bearer ")    // ✅ strip the prefix
        ? authHeader.slice(7)
        : authHeader;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid token" });
    }
};