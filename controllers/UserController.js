// controllers/userController.js
const User = require("../models/User");
const bcrypt = require("bcrypt");

// ============================================
// PUBLIC ROUTES (No auth needed)
// ============================================

/**
 * GET /users
 * Get all users (public - no sensitive data)
 */
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch users',
            error: error.message
        });
    }
};

/**
 * POST /users
 * Create a new user (public registration)
 */
exports.createUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validate input
        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required: username, email, password'
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email format'
            });
        }

        // Check if user already exists
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        // Create user
        const result = await User.create({ username, email, password });
        
        res.status(201).json({
            success: true,
            message: 'User created successfully',
            userId: result.insertId
        });
    } catch (error) {
        console.error('Create user error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create user',
            error: error.message
        });
    }
};

// ============================================
// PROTECTED ROUTES (Auth required)
// ============================================

/**
 * GET /users/:email
 * Get user by email (protected - must be logged in)
 */
exports.getUserByEmail = async (req, res) => {
    try {
        const { email } = req.params;

        // Check if user is authenticated
        if (!req.session || !req.session.user) {
            return res.status(401).json({
                success: false,
                message: 'Please login first'
            });
        }

        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Remove sensitive data
        delete user.password_hash;

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Get user by email error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch user',
            error: error.message
        });
    }
};

/**
 * PUT /users/:id
 * Update user (protected - own profile or admin)
 */
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, role } = req.body;

        // Check if user is authenticated
        if (!req.session || !req.session.user) {
            return res.status(401).json({
                success: false,
                message: 'Please login first'
            });
        }

        // Check if user exists
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Check permissions: only own profile or admin
        const isOwnProfile = req.session.user.id === parseInt(id);
        const isAdmin = req.session.user.role === 'admin';

        if (!isOwnProfile && !isAdmin) {
            return res.status(403).json({
                success: false,
                message: 'You can only update your own profile'
            });
        }

        // Prepare update data
        const updateData = { username, email, role };
        
        // If not admin, don't allow role change
        if (!isAdmin) {
            delete updateData.role;
        }

        await User.update(id, updateData);

        res.status(200).json({
            success: true,
            message: 'User updated successfully'
        });
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update user',
            error: error.message
        });
    }
};

/**
 * DELETE /users/:id
 * Delete user (protected - admin only)
 */
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if user is authenticated
        if (!req.session || !req.session.user) {
            return res.status(401).json({
                success: false,
                message: 'Please login first'
            });
        }

        // Check if admin
        if (req.session.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Admin access required to delete users'
            });
        }

        // Prevent admin from deleting themselves
        if (req.session.user.id === parseInt(id)) {
            return res.status(400).json({
                success: false,
                message: 'You cannot delete your own account'
            });
        }

        // Check if user exists
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        await User.delete(id);

        res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete user',
            error: error.message
        });
    }
};

// ============================================
// ADMIN ROUTES (Auth + Admin role)
// ============================================

/**
 * GET /users/admin/users
 * Get all users with sensitive data (admin only)
 */
exports.getAllUsersAdmin = async (req, res) => {
    try {
        // Check if user is authenticated
        if (!req.session || !req.session.user) {
            return res.status(401).json({
                success: false,
                message: 'Please login first'
            });
        }

        // Check if admin
        if (req.session.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Admin access required'
            });
        }

        const users = await User.findAllAdmin();

        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        console.error('Admin get all users error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch users',
            error: error.message
        });
    }
};

/**
 * GET /users/admin/:id
 * Get user by ID with sensitive data (admin only)
 */
exports.getUserByIdAdmin = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if user is authenticated
        if (!req.session || !req.session.user) {
            return res.status(401).json({
                success: false,
                message: 'Please login first'
            });
        }

        // Check if admin
        if (req.session.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Admin access required'
            });
        }

        const user = await User.findByIdAdmin(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Admin get user error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch user',
            error: error.message
        });
    }
};

/**
 * PUT /users/admin/:id
 * Update any user (admin only)
 */
exports.updateUserAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, role } = req.body;

        // Check if user is authenticated
        if (!req.session || !req.session.user) {
            return res.status(401).json({
                success: false,
                message: 'Please login first'
            });
        }

        // Check if admin
        if (req.session.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Admin access required'
            });
        }

        // Check if user exists
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        await User.update(id, { username, email, role });

        res.status(200).json({
            success: true,
            message: 'User updated successfully'
        });
    } catch (error) {
        console.error('Admin update user error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update user',
            error: error.message
        });
    }
};

/**
 * GET /users/stats
 * Get user statistics (admin only)
 */
exports.getUserStats = async (req, res) => {
    try {
        // Check if user is authenticated
        if (!req.session || !req.session.user) {
            return res.status(401).json({
                success: false,
                message: 'Please login first'
            });
        }

        // Check if admin
        if (req.session.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Admin access required'
            });
        }

        const totalUsers = await User.count();
        const allUsers = await User.findAllAdmin();

        // Count users by role
        const roleCount = {};
        allUsers.forEach(user => {
            const role = user.role || 'user';
            roleCount[role] = (roleCount[role] || 0) + 1;
        });

        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                roleCount,
                lastUpdated: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error('Get user stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch stats',
            error: error.message
        });
    }
};