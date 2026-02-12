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
});


module.exports = r2;




// // services/r2Service.js
// const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
// const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

// const client = new S3Client({
//   region: "auto",
//   endpoint: process.env.R2_ENDPOINT,
//   credentials: {
//     accessKeyId: process.env.R2_ACCESS_KEY,
//     secretAccessKey: process.env.R2_SECRET_KEY,
//   },
// });

// async function getPresignedUploadUrl(key, mime) {
//   const command = new PutObjectCommand({
//     Bucket: process.env.R2_BUCKET,
//     Key: key,
//     ContentType: mime,
//   });

//   return getSignedUrl(client, command, { expiresIn: 300 });
// }

// module.exports = { getPresignedUploadUrl };






