// server.js
const express = require('express');
const mongoose = require("mongoose");
const path = require('path');
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

console.log("ENV CHECK:", {
    MONGO_URI: process.env.MONGO_URI ? "SET" : "MISSING",
    JWT_SECRET: process.env.JWT_SECRET ? "SET" : "MISSING"
});

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
    .catch(err => console.error("❌ MongoDB connection error:", err.message));

const authRoutes = require("./routes/auth");
const authMiddleware = require("./middleware/authMiddleware");

app.use("/api/auth", authRoutes);

app.get("/api/user/profile", authMiddleware, (req, res) => {
    res.json({ message: "Protected!", userId: req.user.id });
});

app.get('/vendor/chess.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'vendor', 'chess.js'));
});

// Static files — serves everything in /public including home.html, game.html etc
app.use(express.static(path.join(__dirname, 'public')));

// Named routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

app.get('/game', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'game.html'));
});

// Catch-all — must be last
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});

module.exports = app;