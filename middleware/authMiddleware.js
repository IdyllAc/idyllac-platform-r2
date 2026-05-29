// middleware/authMiddleware.js
function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated && req.isAuthenticated()) {
      const lang =
      ['ar', 'en', 'fr'].includes(req.session?.lang) 
      ? req.session.lang
      : 'en';
      
      return res.redirect(`/${lang}/dashboard`);
    }
    next();
  }


function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated && req.isAuthenticated()) {   // Passport adds this method
      return next();
    }
    res.redirect('/login');  // or res.status(401).json({ error: 'Unauthorized' });
  }
  
  module.exports = { checkNotAuthenticated,  checkAuthenticated };
  