// server.js
const express = require('express');
const mongoose = require("mongoose");
const path = require('path');
const cors = require("cors");
require("dotenv").config();

const app = express();
const authRoutes = require("./routes/auth");
const authMiddleware = require("./middleware/authMiddleware");
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log("MongoDB error:", err));

// Auth routes
app.use("/api/auth", authRoutes);

// Protected profile route
app.get("/api/user/profile", authMiddleware, (req, res) => {
    res.json({ message: "This is protected data!", userId: req.user.id });
});

// Serve all static files from /public (includes /assets, /css, /js, images)
app.use(express.static(path.join(__dirname, 'public')));

// Page routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/game', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'game.html'));
});

// Catch-all: redirect unknown routes to login
app.get('*', (req, res) => {
    res.redirect('/');
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

module.exports = app;