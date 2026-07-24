// SIMPLEST AUTH MIDDLEWARE
function auth(req, res, next) {
    // Check if user is logged in (has a session or token)
    if (req.session && req.session.user) {
        // User is authenticated, continue to the route
        next();
    } else {
        // User is NOT authenticated, send error
        res.status(401).json({ 
            message: 'Please login first' 
        });
    }
}


const auth = require('./middleware/auth');

// Public route (no auth needed)
app.get('/login', (req, res) => {
    res.send('Login page');
});

// Protected route (auth required)
app.get('/dashboard', auth, (req, res) => {
    res.send('Welcome to your dashboard!');
});

// Protected route with user data
// app.get('/profile', auth, (req, res) => {
//     // You can access the user from session
//     res.json({ 
//         user: req.session.user 
//     });
// });

module.exports = auth;