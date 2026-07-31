// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { auth, requireAdmin } = require("../middleware/auth");

// ============================================
// PUBLIC ROUTES (No auth needed)
// ============================================

// Get all users (public)
router.get("/",  requireAdmin, userController.getAllUsers);

// Create a new user (public registration)
router.post("/", userController.createUser);

// ============================================
// PROTECTED ROUTES (Auth required)
// ============================================

// Get user by email (must be logged in)
router.get("/:email", auth, userController.getUserByEmail);

// Update own profile (must be logged in)
router.put("/:id", auth, userController.updateUser);

// Delete user (admin only - but auth middleware checks first)
router.delete("/:id", auth, userController.deleteUser);

// ============================================
// ADMIN ONLY ROUTES (Auth + Admin role)
// ============================================

// Get all users with sensitive data (admin only)
router.get("/admin/users", requireAdmin, userController.getAllUsersAdmin);

// Get user by ID with sensitive data (admin only)
router.get("/admin/:id", requireAdmin, userController.getUserByIdAdmin);

// Update any user (admin only)
router.put("/admin/:id", requireAdmin, userController.updateUserAdmin);

// Get user statistics (admin only)
router.get("/admin/stats", requireAdmin, userController.getUserStats);

// Get current user info (protected)
router.get("/me", auth, userController.getCurrentUser);

module.exports = router;