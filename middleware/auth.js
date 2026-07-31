// middleware/auth.js
const auth = (req, res, next) => {
  if (!req.session || !req.session.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required. Please login first.'
    });
  }
  next();
};



const requireAdmin = (req, res, next) => {
  if (!req.session || !req.session.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required. Please login first.'
    });
  }
  
  if (req.session.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin privileges required.'
    });
  }
  
  next();
};



module.exports = { auth, requireAdmin };