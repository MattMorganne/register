// middleware/auth.js
// Just the essentials - nothing fancy

/**
 * BASIC AUTH - Check if user is logged in
 * Use this for most protected routes
 */
function auth(req, res, next) {
    if (req.session && req.session.user) {
        // User is logged in, let them through
        next();
    } else {
        // Not logged in
        res.status(401).json({
            message: 'Please login first'
        });
    }
}

/**
 * ADMIN CHECK - Check if user is admin
 * Use this for admin-only routes
 */
function requireAdmin(req, res, next) {
    // First check if logged in
    if (!req.session || !req.session.user) {
        return res.status(401).json({
            message: 'Please login first'
        });
    }
    
    // Then check if admin
    if (req.session.user.role !== 'admin') {
        return res.status(403).json({
            message: 'Admin access required'
        });
    }
    
    next();
}

/**
 * OPTIONAL AUTH - Show user info if logged in
 * Use for public pages that can show user data
 */
function optionalAuth(req, res, next) {
    // Just attach user if available, don't block
    if (req.session && req.session.user) {
        req.user = req.session.user;
    }
    next();
}

module.exports = {
    auth,
    requireAdmin,
    optionalAuth
};