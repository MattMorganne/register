const express = require("express");
const session = require("express-session"); // 👈 NEW
const helmet = require("helmet"); // 👈 NEW
const rateLimit = require("express-rate-limit"); // 👈 NEW
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes"); // 👈 NEW auth routes

const app = express();

// ============================================
// 1. SECURITY MIDDLEWARE (Applied globally)
// ============================================

// Helmet - Security headers
app.use(helmet());

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-super-secret-key-change-this',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// ============================================
// 2. STANDARD MIDDLEWARE
// ============================================

// Parse JSON payloads
app.use(express.json());

// ============================================
// 3. ROUTES (Mounted separately)
// ============================================

// Auth routes (login, logout) - NO auth required
app.use("/auth", authRoutes);

// User routes - Some protected, some public (see userRoutes.js)
app.use("/users", userRoutes);

// ============================================
// 4. START SERVER
// ============================================

const port = 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`
    Available routes:
    POST /auth/login       (public)
    POST /auth/logout      (protected)
    GET  /users            (public)
    GET  /users/:email     (protected)
    POST /users            (public)
    `);
});

module.exports = app;