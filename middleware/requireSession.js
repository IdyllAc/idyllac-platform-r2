// middleware/requireSession.js
module.exports = function requireSession(req, res, next) {
    if (req.isAuthenticated && req.isAuthenticated()) {
      return next();
    }
  
    // API request
    if (req.headers.accept?.includes('application/json')) {
      return res.status(401).json({ error: 'Not authenticated (session required)' });
    }
  
    // Browser request
    req.flash('error', 'Please login first');
    return res.redirect('/login');
  };



  
//   module.exports = function requireSession(req, res, next) {
//     try {
//       if (req.isAuthenticated && req.isAuthenticated()) {
//         return next();
//       }
  
//       // For API calls, return JSON
//       if (req.headers.accept?.includes("application/json")) {
//         return res.status(401).json({
//           message: "Authentication required",
//           redirect: "/login",
//         });
//       }
  
//       return res.redirect("/login");
//     } catch (e) {
//       console.error("Require session middleware error:", e);
//       next(e);
//     }
//   };
  