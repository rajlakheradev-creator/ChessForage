// server.js
const express = require('express');
const mongoose = require("mongoose");
const path = require('path');
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================================
// GUARD: Fail fast with a clear message if env vars are missing
// This prevents a cryptic crash that Vercel shows as a 500
// ============================================================
if (!process.env.MONGO_URI) {
    console.error("❌ FATAL: MONGO_URI environment variable is not set.");
    console.error("   Go to Vercel → your project → Settings → Environment Variables and add it.");
    process.exit(1);
}

if (!process.env.JWT_SECRET) {
    console.error("❌ FATAL: JWT_SECRET environment variable is not set.");
    console.error("   Go to Vercel → your project → Settings → Environment Variables and add it.");
    process.exit(1);
}

app.use(cors());
app.use(express.json());

// ============================================================
// MongoDB — connect once on startup
// ============================================================
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB connected"))
    .catch(err => {
        console.error("❌ MongoDB connection failed:", err.message);
        process.exit(1); // Don't run with a broken DB connection
    });

// ============================================================
// Routes
// ============================================================
const authRoutes = require("./routes/auth");
const authMiddleware = require("./middleware/authMiddleware");

app.use("/api/auth", authRoutes);

app.get("/api/user/profile", authMiddleware, (req, res) => {
    res.json({ message: "This is protected data!", userId: req.user.id });
});

// ============================================================
// Static files — serve everything in /public
// (covers /css, /js, /images, /assets/sounds, etc.)
// ============================================================
app.use(express.static(path.join(__dirname, 'public')));

// ============================================================
// Page routes
// ============================================================
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/game', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'game.html'));
});

// Catch-all: Express 5 requires a named wildcard parameter — '*' alone throws a PathError
app.get('*path', (req, res) => {
    res.redirect('/');
});

// ============================================================
// Start server (not needed for Vercel serverless but fine locally)
// ============================================================
app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
});

module.exports = app;