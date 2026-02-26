const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.js");

const router = express.Router();

// POST /api/auth/signup
router.post("/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check for existing user
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // FIX: was shadowing the imported `user` model with `const user = new User(...)`
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        res.json({ message: "User created successfully" });

    } catch (err) {
        console.error("Signup error:", err);
        res.status(500).json({ message: "Server error during signup" });
    }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
    try {
        // FIX: req.body destructuring was completely missing
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        // FIX: was res.statusCode(400) — not a function; correct is res.status(400)
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({ token });

    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: "Server error during login" });
    }
});

module.exports = router;