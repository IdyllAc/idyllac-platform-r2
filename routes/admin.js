// // routes/admin.js
const express = require('express');
const router = express.Router();

const adminOnly = require('../middleware/adminOnly');
const adminReviewController = require('../controllers/adminReviewController');
const adminPreviewController = require('../controllers/adminPreviewController');

// PAGE
router.get('/reviews', adminOnly, adminReviewController.getReviewsPage);

// PREVIEW (FINAL SYSTEM)
router.get('/preview/:userId', adminOnly, adminPreviewController.getPreviewUrls);

// APPROVE / REJECT
router.post('/documents/:userId/approve', adminOnly, adminReviewController.approveDocuments);
router.post('/documents/:userId/reject', adminOnly, adminReviewController.rejectDocuments);

// DEBUG
router.get('/debug', (req, res) => res.json(req.user));

module.exports = router;




// const express = require('express');
// const router = express.Router();

// const adminOnly = require('../middleware/adminOnly');
// const adminReviewController = require('../controllers/adminReviewController');
// const adminPreviewController = require('../controllers/adminPreviewController');

// // PAGE
// router.get('/reviews', adminOnly, adminReviewController.getReviewsPage);

// // DATA
// // router.get('/reviews/data/:userId', adminOnly, adminReviewController.listPendingReviews);
// router.get('/reviews/data/:userId', adminOnly, adminReviewController.getReviewData);


// // // PREVIEW
// // router.get('/preview', adminOnly, adminReviewController.adminPreview);   // ???

// // APPROVE
// router.post('/documents/:userId/approve', adminOnly, adminReviewController.approveDocuments);

// // REJECT
// router.post('/documents/:userId/reject', adminOnly, adminReviewController.rejectDocuments);

// // PREVIEW
// router.get('/preview/:userId', adminOnly, adminPreviewController.getPreviewUrls);


// router.get('/debug', (req, res) => {
//     res.json(req.user);
//   });
  

// module.exports = router;
