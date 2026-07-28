const bcrypt = require("bcrypt");
const User = require("../models/User");

// Login controller
exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // 1. Find user by username (or email)
        const user = await User.findByUsername(username);
        if (!user) {
            return res.status(401).json({
                message: 'Invalid credentials'
            });
        }

        // 2. Verify password
        const isValid = await bcrypt.compare(password, user.password_hash);
        if (!isValid) {
            return res.status(401).json({
                message: 'Invalid credentials'
            });
        }

        // 3. Regenerate session to prevent session fixation
        req.session.regenerate((err) => {
            if (err) {
                return res.status(500).json({
                    message: 'Login failed, please try again'
                });
            }

            // 4. Store user info in session (minimal data)
            req.session.user = {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role || 'user'
            };

            // 5. Save session before sending response
            req.session.save((err) => {
                if (err) {
                    return res.status(500).json({
                        message: 'Login failed, please try again'
                    });
                }

                res.json({
                    message: 'Login successful',
                    user: req.session.user
                });
            });
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            message: 'Internal server error'
        });
    }
};

// Logout controller
exports.logout = (req, res) => {
    // Check if user is authenticated
    if (!req.session?.user) {
        return res.status(401).json({
            message: 'No active session'
        });
    }

    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({
                message: 'Logout failed'
            });
        }

        res.clearCookie('connect.sid');
        res.json({
            message: 'Logged out successfully'
        });
    });
};