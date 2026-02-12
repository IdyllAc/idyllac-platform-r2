// middleware/adminOnly.js

module.exports = function adminOnly(req, res, next) {

  console.log("ADMIN CHECK USER:", req.user);

    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ error: 'Admin access only' });
    }
    next();
  };
  
