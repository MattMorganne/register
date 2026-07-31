const express = require("express");
const session = require("express-session");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cors = require("cors"); // 👈 ADD THIS
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

// ============================================
// 1. CORS MIDDLEWARE (Add this FIRST)
// ============================================

app.use(cors({
    origin: 'http://localhost:5173', // Your React app URL
    credentials: true, // Allow cookies/session
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// ============================================
// 2. SECURITY MIDDLEWARE
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
// 3. STANDARD MIDDLEWARE
// ============================================

// Parse JSON payloads
app.use(express.json());

// ============================================
// 4. ROUTES
// ============================================

app.use("/auth", authRoutes);
app.use("/users", userRoutes);

// ============================================
// 5. START SERVER
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