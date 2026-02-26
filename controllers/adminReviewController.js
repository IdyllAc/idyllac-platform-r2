// controllers/adminReviewController.js
const { User, Document, Selfie } = require('../models');


exports.getReviewsPage = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'email'],

      include: [
        {
          model: Document,
          as: 'document', // ✅ matches User.hasOne(... as:'document')
          attributes: ['isVerified', 'passportKey', 'idCardKey', 'licenseKey'],
          required: false,
        },
        {
          model: Selfie,
          as: 'selfie', // ✅ matches User.hasOne(... as:'selfie')
          attributes: ['isVerified', 'selfieKey'],
          required: false,
        },
      ],

      order: [['id', 'DESC']],
    });

    const reviews = users.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,

      documentsUploaded: !!(
        u.document?.passportKey ||
        u.document?.idCardKey ||
        u.document?.licenseKey
      ),
      documentsVerified: u.document?.isVerified ?? false,

      selfieUploaded: !!u.selfie?.selfieKey,
      selfieVerified: u.selfie?.isVerified ?? false,
    }));

    res.render('admin/reviews', { reviews });

  } catch (err) {
    console.error('❌ getReviewsPage error:', err);
    res.status(500).send('Something went wrong!');
  }
};


exports.approveDocuments = async (req, res) => {
  const { userId } = req.params;

  try {

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // 🔒 DECISION GUARD
    if (user.verificationStatus !== 'pending') {
      return res.status(409).json({
        error: "Verification already decided",
      });
    }

    await Document.update(
      { isVerified: true },
      { where: { userId } }
    );

    await Selfie.update(
      { isVerified: true },
      { where: { userId } }
    );

    await user.update({
      verificationStatus: 'approved'
    });

    return res.json({ success: true });

  } catch (err) {
    console.error("❌ approveDocuments:", err);
    res.status(500).json({ error: "Approve failed" });
  }
};


// exports.approveDocuments = async (req, res) => {
//   const { userId } = req.params;

//   await Document.update(
//     { isVerified: true },
//     { where: { userId } }
//   );

//   await Selfie.update(
//     { isVerified: true },
//     { where: { userId } }
//   );

//   await User.update(
//     { verificationStatus: 'approved' },
//     { where: { id: userId } }
//   );

//   res.json({ success: true });     // res.json({ success: true, status: 'approved' });
// };


exports.rejectDocuments = async (req, res) => {   // Reject should NOT do this anymore: it should NOT set isVerified to false, because that would allow the user to re-upload and bypass the rejection. Instead, we keep isVerified as true (indicating that the documents were reviewed), but we set the user's verificationStatus to 'rejected' to indicate the final decision.
  const { userId } = req.params;

  try {

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // 🔒 DECISION GUARD
    if (user.verificationStatus !== 'pending') {
      return res.status(409).json({
        error: "Verification already decided",
      });
    }

    // Keep evidence VERIFIED
    await Document.update(
      { isVerified: true },
      { where: { userId } }
    );

    await Selfie.update(
      { isVerified: true },
      { where: { userId } }
    );

    await user.update({
      verificationStatus: 'rejected'
    });

    return res.json({ success: true });

  } catch (err) {
    console.error("❌ rejectDocuments:", err);
    res.status(500).json({ error: "Reject failed" });
  }
};

// exports.rejectDocuments = async (req, res) => {
//   const { userId } = req.params;

//   await Document.update(
//     { isVerified: true },   // 👈 IMPORTANT
//     { where: { userId } }
//   );

//   await Selfie.update(
//     { isVerified: true },   // 👈 IMPORTANT
//     { where: { userId } }
//   );

//   await User.update(
//     { verificationStatus: 'rejected' },
//     { where: { id: userId } }
//   );

//   res.json({ success: true });          // res.json({ success: true, status: 'rejected' });
// };
  
  
  
