// server.js
const express = require('express');
const mongoose = require("mongoose");
const path = require('path');
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

if (!process.env.MONGO_URI) {
    console.error("❌ FATAL: MONGO_URI is not set.");
    process.exit(1);
}
if (!process.env.JWT_SECRET) {
    console.error("❌ FATAL: JWT_SECRET is not set.");
    process.exit(1);
}

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB connected"))
    .catch(err => { console.error("❌ MongoDB failed:", err.message); process.exit(1); });

const authRoutes = require("./routes/auth");
const authMiddleware = require("./middleware/authMiddleware");

app.use("/api/auth", authRoutes);

app.get("/api/user/profile", authMiddleware, (req, res) => {
    res.json({ message: "Protected!", userId: req.user.id });
});

// Serve the browser-compatible (ESM/UMD) build of chess.js
// node_modules/chess.js/dist/esm/chess.js is the browser-safe build
app.get('/vendor/chess.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'node_modules', 'chess.js', 'dist', 'esm', 'chess.js'));
});

// Static files from /public
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/game', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'game.html'));
});

app.get('*path', (req, res) => {
    res.redirect('/');
});


// At the bottom of server.js
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
}



module.exports = app;