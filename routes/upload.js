// routes/upload.js
const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const combinedAuth = require('../middleware/combinedAuth');

console.log('combinedAuth type:', typeof combinedAuth);
console.log('getPresignedUrl type:', typeof uploadController.getPresignedUrl);


router.post('/presign', combinedAuth, uploadController.getPresignedUrl);
router.post('/selfie', combinedAuth, uploadController.saveSelfie);


router.get("/preview", combinedAuth, uploadController.getPreviewUrl);


module.exports = router;
