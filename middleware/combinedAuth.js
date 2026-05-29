// middlewares/combinedAuth.js
const jwt = require("jsonwebtoken");
const { User } = require("../models");

module.exports = async function combinedAuth(req, res, next) {

  console.log("COOKIE accessToken:", req.cookies?.accessToken);
  console.log("AUTH HEADER:", req.headers.authorization);
  console.log("COOKIES:", req.cookies);
 
  try {
    // 1️⃣ SESSION AUTH (Passport)
    if (req.isAuthenticated && req.isAuthenticated()) {
      console.log("✅ combinedAuth → session auth OK:", req.user?.email);
      return next();
    }

    // 2️⃣ JWT AUTH (API / fetch)
    const token =
      req.cookies?.accessToken ||
      req.headers.authorization?.split(" ")[1];

    if (!token) {
      console.warn("⚠️ combinedAuth → no session, no JWT");
      return res.status(401).json({ error: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({ error: "Invalid token user" });
    }

    if (!req.user) req.user = user;
    console.log("✅ combinedAuth → JWT auth OK:", user.email);
    next();
  } catch (err) {
    console.error("❌ combinedAuth error:", err.message);
    return res.status(401).json({ error: "Unauthorized" });
  }
};






// const jwt = require('jsonwebtoken');
// const { User } = require('../models');

// module.exports = async function combinedAuth(req, res, next) {

//   console.log("🔥 combinedAuth full req.user:", req.user);

  
//   // 1️⃣ Check Passport session first (EJS/session-based login)
//     if (req.isAuthenticated && req.isAuthenticated()) {

//       // 🛑 FIX: sometimes req.user becomes just the ID number after expiry
//     if (
//       typeof req.user !== "object" ||
//       !req.user.id ||
//       !req.user.email
//     ) {
//       console.warn("⚠️ combinedAuth → Session corrupted, forcing JWT instead:", req.user);

//       // destroy bad session
//       if (req.session) {
//         req.session.destroy(() => {});
//       }
//       req.logout?.();

//       // continue to JWT checks
//     } else {
//       console.log("🧭 combinedAuth → Valid Session user:", req.user.email);
//       return next(); // ✅ user authenticated via session
//     }
//   }

   
//     // 2️⃣ Next — check JWT (API/fetch-based login)
//     const authHeader = req.headers['authorization'];
//     const token = authHeader && authHeader.split(' ')[1];

//     if (!token) {
//       console.warn("⚠️ combinedAuth → No JWT or session found");
//       return res.status(401).json({ error: 'Unauthorized: no valid token or session' });
//     }

//     // Verify token
//     try {
//     const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
//     if (!decoded?.id) throw new Error('Invalid token payload');
     
//     // Attach user object (optional: check user exists in DB)
//     const user = await User.findByPk(decoded.id, {
//       attributes: ['id', 'email', 'name', 'isConfirmed'] 
//     });

//     if (!user) throw new Error('User not found');

//     req.user = user;

//     console.log("🧭 combinedAuth → JWT user:", user.email);
    
//     return next();

//   } catch (err) {
//     console.warn("⚠️ combinedAuth → Token error:", err.message);
//     return res.status(401).json({ error: 'Authentication failed: ' + err.message });
//   }
// };