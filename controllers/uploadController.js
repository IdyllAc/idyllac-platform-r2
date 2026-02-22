// controllers/uploadController.js
const { Document, Selfie } = require('../models'); 
const {  PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { v4: uuidv4 } = require("uuid");
const r2 = require("../services/r2Client");

// const BUCKET = process.env.R2_BUCKET;

exports.getPresignedUrl = async (req, res) => {
  console.log("📥 presign body:", req.body);

  try {
    const { type, subtype, mimeType } = req.body;
    const userId = req.user.id;

    if (!type || !mimeType) {
      return res.status(400).json({ error: 'Missing type or mimeType' });
    }

    const ext = mimeType.split('/')[1];
    const folder = subtype ? `${type}/${subtype}` : type;
    
    const key = `users/${userId}/${type}/${uuidv4()}.${ext}`;

    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET,
      Key: key,
      ContentType: mimeType,
      ChecksumAlgorithm: undefined,
    });
    
    const uploadUrl = await getSignedUrl(r2, command, {
      expiresIn: 300,
    });

    return res.json({ uploadUrl, key });
  } catch (err) {
    console.error('❌ Presign failed:', err);
    return res.status(500).json({ error: 'Presign failed' });
  }
};



// 📄 Save document references ONLY (R2-based)
exports.uploadDocuments = async (req, res) => {
  try {
    const userId = req.user.id;
    const { passportKey, idCardKey, licenseKey } = req.body;

    if (!passportKey && !idCardKey && !licenseKey) {
      return res.status(400).json({ error: "No document keys provided" });
    }

    // 1️⃣ Fetch existing document row
    const existing = await Document.findOne({ where: { userId } });

    // 2️⃣ LOCK CHECK — only block if verified
    if (existing?.isVerified) {
      return res.status(403).json({
        error: "Documents are verified and locked",
      });
    }

    // 3️⃣ Update or create (your original logic, untouched)
    if (existing) {
      await existing.update({
        passportKey: passportKey ?? existing.passportKey,
        idCardKey: idCardKey ?? existing.idCardKey,
        licenseKey: licenseKey ?? existing.licenseKey,
      });
    } else {
      await Document.create({
        userId,
        passportKey: passportKey ?? null,
        idCardKey: idCardKey ?? null,
        licenseKey: licenseKey ?? null,
      });
    }

    return res.json({ success: true });
  } catch (err) {
    console.error("❌ uploadDocuments error:", err);
    res.status(500).json({ error: "Documents save failed" });
  }
};

// exports.uploadDocuments = async (req, res) => {
//   try {
//     const userId = req.user.id;

//     const { passportKey, idCardKey, licenseKey } = req.body;

//     if (!passportKey && !idCardKey && !licenseKey) {
//       return res.status(400).json({ error: "No document keys provided" });
//     }


//     // remove existing documents (same logic as before)
//     const existing = await Document.findOne({ where: { userId } });

//     if (existing) {
//       await existing.update({
//         passportKey: passportKey ?? existing.passportKey,
//         idCardKey: idCardKey ?? existing.idCardKey,
//         licenseKey: licenseKey ?? existing.licenseKey,
//       });
//     } else {
//       await Document.create({
//         userId,
//         passportKey: passportKey ?? null,
//         idCardKey: idCardKey ?? null,
//         licenseKey: licenseKey ?? null,
//       });
//     }

//     return res.json({ success: true });
    
//   } catch (err) {
//     console.error("❌ uploadDocuments error:", err);
//     res.status(500).json({ error: "documents save Failed" });
//   }
// };

exports.saveSelfie = async (req, res) => {
  try {
    const userId = req.user.id;
    const { key } = req.body;

    if (!key) {
      return res.status(400).json({ error: "Missing R2 key" });
    }

    const existing = await Selfie.findOne({
      where: { userId },
    });

    // 🔒 Lock after verification
    if (existing?.isVerified) {
      return res.status(403).json({
        error: "Selfie is verified and locked",
      });
    }

    if (existing) {
      await existing.update({ selfieKey: key });
    } else {
      await Selfie.create({
        userId,
        selfieKey: key,
      });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("❌ saveSelfie error:", err);
    res.status(500).json({ error: "Save failed" });
  }
};

// exports.saveSelfie = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { key } = req.body;

//     if (!key) {
//       return res.status(400).json({ error: 'Missing R2 key' });
//     }

//     const existing = await Selfie.findOne({
//       where: { userId },  // ✅ JS attribute, not DB column
//     });

//     console.log("👤 req.user:", req.user);
//     console.log("🪪 req.session:", req.session);


//     if (existing) {
//       await existing.update({ selfieKey: key });
//     } else {
//       await Selfie.create({
//         userId,           // ✅ REQUIRED
//         selfieKey: key,   // ✅ REQUIRED
//       });
//     }

//     res.json({ success: true });
//   } catch (err) {
//     console.error('❌ saveSelfie error:', err);
//     res.status(500).json({ error: 'Save failed' });
//   }
// };




exports.getPreviewUrl = async (req, res) => {
  try {
    const { key } = req.query;
    if (!key) {
      return res.status(400).json({ error: "Missing key" });
    }

    const command = new GetObjectCommand({
      Bucket: process.env.R2_BUCKET,
      Key: key,
    });

    const url = await getSignedUrl(r2, command, { 
      expiresIn: 60 }); // 60s

    res.json({ url });
  } catch (err) {
    console.error("❌ preview error:", err);
    res.status(500).json({ error: "Preview failed" });
  }
};











