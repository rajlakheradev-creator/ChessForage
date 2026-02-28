// routes/auth.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.js");

const router = express.Router();

// Simple in-memory rate limiter (no extra dependencies needed)
// Tracks failed login attempts per IP
const loginAttempts = new Map();
const MAX_ATTEMPTS = 10;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function rateLimit(req, res, next) {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    const record = loginAttempts.get(ip);

    if (record) {
        // Clear old attempts outside the window
        record.attempts = record.attempts.filter(t => now - t < WINDOW_MS);

        if (record.attempts.length >= MAX_ATTEMPTS) {
            const retryAfter = Math.ceil((record.attempts[0] + WINDOW_MS - now) / 1000);
            return res.status(429).json({
                message: `Too many attempts. Try again in ${retryAfter} seconds.`
            });
        }

        record.attempts.push(now);
    } else {
        loginAttempts.set(ip, { attempts: [now] });
    }

    next();
}

// Input validation helper
function validateSignupInput({ name, email, password }) {
    if (!name || typeof name !== "string" || name.trim().length < 2) {
        return "Name must be at least 2 characters.";
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return "Invalid email address.";
    }
    if (!password || password.length < 8) {
        return "Password must be at least 8 characters.";
    }
    if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
        return "Password must contain at least one letter and one number.";
    }
    return null;
}

// POST /api/auth/signup
router.post("/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate input
        const validationError = validateSignupInput({ name, email, password });
        if (validationError) {
            return res.status(400).json({ message: validationError });
        }

        // Normalize email to lowercase
        const normalizedEmail = email.toLowerCase().trim();

        // Check for existing user
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(400).json({ message: "An account with this email already exists." });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = new User({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword
        });
        await newUser.save();

        res.status(201).json({ message: "Account created successfully!" });

    } catch (err) {
        console.error("Signup error:", err);
        res.status(500).json({ message: "Server error during signup. Please try again." });
    }
});

// POST /api/auth/login  (rate limited)
router.post("/login", rateLimit, async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required." });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const user = await User.findOne({ email: normalizedEmail });

        // Use the same error message for missing user AND wrong password
        // (prevents email enumeration attacks)
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password." });
        }

        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is not set!");
            return res.status(500).json({ message: "Server configuration error." });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({ token, name: user.name });

    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: "Server error during login. Please try again." });
    }
});

module.exports = router;