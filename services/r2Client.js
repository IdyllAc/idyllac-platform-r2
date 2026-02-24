// services/r2Client.js
const { S3Client } = require('@aws-sdk/client-s3');

if (!process.env.R2_ACCOUNT_ID) {
  throw new Error('❌ R2_ACCOUNT_ID is missing from env');
}

if (!process.env.R2_BUCKET) {
  throw new Error('❌ R2_BUCKET is missing from env');
}

console.log(
  '🪣 R2 endpoint:',
  `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`
);

const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
  requestChecksumCalculation: "WHEN_REQUIRED",
  responseChecksumValidation: "WHEN_REQUIRED",
});

module.exports = r2;




