// server.js (Move this to the root of your project)
const express = require('express');
const mongoose = require("mongoose");
const path = require('path');
const cors = require("cors");
require("dotenv").config();

const app = express();
const authRoutes = require("./routes/auth"); // Ensure auth.js is in a 'routes' folder
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

// Example of how to properly use authMiddleware (protecting data, not HTML)
app.get("/api/user/profile", authMiddleware, (req, res) => {
    res.json({ message: "This is protected data!", userId: req.user.id });
});

// Serve sounds and other static assets
app.use('/sounds', express.static(path.join(__dirname, 'sounds')));
app.use(express.static(__dirname));

// Serve the game page
app.get('/game', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Fallback: Send login page for root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

// At the bottom of server.js
module.exports = app;