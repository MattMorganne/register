const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const rateLimit = require("express-rate-limit");

// Rate limiting for login attempts
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // 10 attempts
    message: 'Too many login attempts, please try again later'
});

// Login route (with rate limiting)
router.post("/login", loginLimiter, authController.login);

// Logout route (requires auth)
router.post("/logout", authController.logout);

module.exports = router;