// routes/dashboard.js
const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { checkAuthenticated } = require('../middleware/authMiddleware'); // Adjust path as needed
const noCache = require('../middleware/noCache');

// EJS session (passport) dashboard 
router.get('/dashboard', checkAuthenticated, noCache, dashboardController.getDashboardPage);


module.exports = router;
