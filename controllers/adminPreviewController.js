// controllers/adminPreviewController.js
const { GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const r2 = require('../services/r2Client');
const { User, Document, Selfie } = require('../models');

exports.getPreviewUrls = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: 'Missing userId' });
    }

    const user = await User.findByPk(userId, {
      include: [
        { model: Document, as: 'document' },
        { model: Selfie, as: 'selfie' },
      ],
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const bucket = process.env.R2_BUCKET;

    const sign = async (key) => {
      if (!key) return null;

      console.log("Signing bucket:", bucket);
      console.log("Signing key:", key);

      const command = new GetObjectCommand({
        Bucket: bucket,
        Key: key,
      });

      return await getSignedUrl(r2, command, { expiresIn: 120 }); // 2 min TTL
    };

    const urls = {
      passportUrl: await sign(user.document?.passportKey),
      idCardUrl: await sign(user.document?.idCardKey),
      licenseUrl: await sign(user.document?.licenseKey),
      selfieUrl: await sign(user.selfie?.selfieKey),
    };

    res.json(urls);

  } catch (err) {
    console.error('❌ Preview URL error:', err);
    res.status(500).json({ error: 'Failed to generate preview URLs' });
  }
};



// const { GetObjectCommand } = require('@aws-sdk/client-s3');
// const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
// const r2 = require('../services/r2Client');

// exports.getPreviewUrl = async (req, res) => {
//   try {
//     const { key } = req.query;

//     if (!key) {
//       return res.status(400).json({ error: 'Missing key' });
//     }

//     const command = new GetObjectCommand({
//       Bucket: process.env.R2_BUCKET,
//       Key: key,
//     });

//     const url = await getSignedUrl(r2, command, {
//       expiresIn: 60,
//     });

//     res.json({ url });

//   } catch (err) {
//     console.error('❌ preview URL error:', err);
//     res.status(500).json({ error: 'Preview failed' });
//   }
// };





// // controllers/adminPreviewController.js
// const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
// const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

// const s3 = new S3Client({
//   region: 'auto',
//   endpoint: process.env.R2_ENDPOINT,
//   credentials: {
//     accessKeyId: process.env.R2_ACCESS_KEY,
//     secretAccessKey: process.env.R2_SECRET_KEY,
//   },
// });

// exports.getPreviewUrl = async (req, res) => {
//   try {
//     const { key } = req.query;

//     if (!key) {
//       return res.status(400).json({ error: 'Missing key' });
//     }

//     const command = new GetObjectCommand({
//       Bucket: process.env.R2_BUCKET,
//       Key: key,
//     });

//     const url = await getSignedUrl(s3, command, {
//       expiresIn: 60, // seconds
//     });

//     res.json({ url });

//   } catch (err) {
//     console.error('❌ preview URL error:', err);
//     res.status(500).json({ error: 'Preview failed' });
//   }
// };
