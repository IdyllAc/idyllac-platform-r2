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

  await Document.update(
    { isVerified: true },
    { where: { userId } }
  );

  await User.update(
    { verificationStatus: 'approved' },
    { where: { id: userId } }
  );

  res.json({ success: true });
};




exports.rejectDocuments = async (req, res) => {
  const { userId } = req.params;

  await Document.update(
    { isVerified: false },
    { where: { userId } }
  );

  await User.update(
    { verificationStatus: 'rejected' },
    { where: { id: userId } }
  );

  res.json({ success: true });
};
  
  
  
