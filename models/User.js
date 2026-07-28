// models/User.js
const db = require("../db");
const bcrypt = require("bcrypt");

const User = {
    // ============================================
    // 1. FIND ALL USERS (Public - no sensitive data)
    // ============================================
    findAll: async () => {
        const query = "SELECT id, username, email, role, created_at FROM users";
        const [rows] = await db.execute(query);
        return rows;
    },

    // ============================================
    // 2. FIND ALL USERS (Admin - with sensitive data)
    // ============================================
    findAllAdmin: async () => {
        const query = "SELECT * FROM users";
        const [rows] = await db.execute(query);
        return rows;
    },

    // ============================================
    // 3. FIND USER BY EMAIL
    // ============================================
    findByEmail: async (email) => {
        const query = "SELECT * FROM users WHERE email = ?";
        const [rows] = await db.execute(query, [email]);
        return rows[0]; // Returns user object or undefined
    },

    // ============================================
    // 4. FIND USER BY USERNAME (for login)
    // ============================================
    findByUsername: async (username) => {
        const query = "SELECT * FROM users WHERE username = ?";
        const [rows] = await db.execute(query, [username]);
        return rows[0]; // Returns user object or undefined
    },

    // ============================================
    // 5. FIND USER BY ID
    // ============================================
    findById: async (id) => {
        const query = "SELECT id, username, email, role, created_at FROM users WHERE id = ?";
        const [rows] = await db.execute(query, [id]);
        return rows[0]; // Returns user object or undefined
    },

    // ============================================
    // 6. FIND USER BY ID (Admin - with sensitive data)
    // ============================================
    findByIdAdmin: async (id) => {
        const query = "SELECT * FROM users WHERE id = ?";
        const [rows] = await db.execute(query, [id]);
        return rows[0];
    },

    // ============================================
    // 7. CREATE NEW USER (with password hashing)
    // ============================================
    create: async (userData) => {
        const { username, email, password } = userData;
        
        // Hash the password
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);
        
        const query = "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)";
        const [result] = await db.execute(query, [username, email, passwordHash]);
        return result; // Contains insertId
    },

    // ============================================
    // 8. UPDATE USER
    // ============================================
    update: async (id, userData) => {
        const { username, email, role } = userData;
        const query = "UPDATE users SET username = ?, email = ?, role = ? WHERE id = ?";
        const [result] = await db.execute(query, [username, email, role, id]);
        return result;
    },

    // ============================================
    // 9. UPDATE USER PASSWORD
    // ============================================
    updatePassword: async (id, newPassword) => {
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(newPassword, saltRounds);
        
        const query = "UPDATE users SET password_hash = ? WHERE id = ?";
        const [result] = await db.execute(query, [passwordHash, id]);
        return result;
    },

    // ============================================
    // 10. DELETE USER
    // ============================================
    delete: async (id) => {
        const query = "DELETE FROM users WHERE id = ?";
        const [result] = await db.execute(query, [id]);
        return result;
    },

    // ============================================
    // 11. CHECK IF USER EXISTS
    // ============================================
    exists: async (email) => {
        const query = "SELECT COUNT(*) as count FROM users WHERE email = ?";
        const [rows] = await db.execute(query, [email]);
        return rows[0].count > 0;
    },

    // ============================================
    // 12. GET USER COUNT
    // ============================================
    count: async () => {
        const query = "SELECT COUNT(*) as total FROM users";
        const [rows] = await db.execute(query);
        return rows[0].total;
    }
};

module.exports = User;