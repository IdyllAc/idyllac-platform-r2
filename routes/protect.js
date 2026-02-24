// routes/protect.js
const express = require('express');
const router = express.Router();

const jwtMiddleware = require('../middleware/jwtMiddleware');
const noCache = require('../middleware/noCache');

const combinedAuth = require('../middleware/combinedAuth');
const uploadController = require('../controllers/uploadController');
const personalInfoController = require('../controllers/personalInfoController');
const { completeRegistration, showCompletedPage } = require('../controllers/registrationController');
const registrationController = require('../controllers/registrationController');
const progressController = require('../controllers/progressController');
const { personalValidator } = require('../validators/personalValidator');
const { documentValidator } = require('../validators/documentValidator');
const uploadProfilePhoto = require('../middleware/uploadProfilePhoto');
const { saveSelfieValidator } = require('../validators/saveSelfieValidator');

// ✅ Show Personal Info form
router.get('/personal_info', combinedAuth, noCache, (req, res) => {
  res.render('personal', { user: req.user });
});

// ✅ Submit Personal Info form
router.post(
  '/personal_info', 
  combinedAuth,        // ✅ replaces jwtMiddleware
  noCache, 
  personalValidator,   // <---- added
  personalInfoController.submitPersonalInfo);


  router.post("/api/upload/presign", async (req, res ) => {
    combinedAuth,
    uploadController.getPresignedDocumentUrl
  });


// ✅ Show Upload Document form
router.get('/upload/document', combinedAuth, noCache, (req, res) => {
    res.render('document', { user: req.user });
  });
  

// ✅ Upload Documents
router.post(
  '/upload/document',
  combinedAuth,  // replaces jwtMiddleware
  noCache, 
  documentValidator,   // <---- added
  uploadController.uploadDocuments
);


// ✅ Show Upload Selfie form
router.get('/upload/selfie', combinedAuth, noCache, (req, res) => {
    res.render('selfie', { user: req.user });
  }
);


// ✅ Upload Selfie
router.post(
  '/selfie',
  combinedAuth,  // replaces jwtMiddleware
  noCache,
  saveSelfieValidator, // validates `key` 
  uploadController.saveSelfie
);


// ✅ Completed Page (from controller)
router.get('/completed', combinedAuth, noCache, registrationController.showCompletedPage);


// ✅ Final step: Complete Registration
router.post('/complete', combinedAuth, noCache, registrationController.completeRegistration);


// ✅ Review Progress (moved logic into controller)
router.get('/review-progress', combinedAuth, noCache, progressController.reviewProgress);


// ✅ Route for success page
router.get("/selfie/success", (req, res) => {
  res.render("success"); // looks for views/success.ejs
});


// // Dashboard page
 //    ... 
// });


module.exports = router;