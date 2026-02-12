// controllers/dashboardController.js
const models = require('../models');
const { User } = models;

async function fetchDashboardData(userId) {
  return await User.findByPk(userId, { 
    attributes: ['id', 'name', 'email', 'isConfirmed'] 
  });
}

// 1️⃣ EJS Dashboard (session-based)
exports.getDashboardPage = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      req.flash('error', 'Not authenticated');
      return res.redirect('/login');
    }

    const userModel = await fetchDashboardData(req.user.id);
    if (!userModel) {
      req.flash('error', 'User not found');
      return res.redirect('/login');
    }

    const user = userModel.get ? userModel.get({ plain: true }) : userModel;
    const { PersonalInfo, Document, Selfie } = models;

    let personal = null, document = null, selfie = null;
    try {
      if (PersonalInfo) personal = await PersonalInfo.findOne({ where: { userId: user.id } });
      if (Document) document = await Document.findOne({ where: { userId: user.id } });
      if (Selfie) selfie = await Selfie.findOne({ where: { userId: user.id } });
    } catch (err) {
      console.warn('Dashboard optional model check failed:', err.message);
    }

    const steps = [user.isConfirmed, !!personal, !!document, !!selfie];
    const completed = steps.filter(Boolean).length;
    const progress = Math.round((completed / steps.length) * 100);

    res.render('dashboard', {
      user,
      progress,
      personalInfo: personal?.get ? personal.get({ plain: true }) : personal,
      documents: document?.get ? document.get({ plain: true }) : document,
      selfie: selfie?.get ? selfie.get({ plain: true }) : selfie,
      messages: req.flash(),
    });
  } catch (err) {
    console.error('Dashboard (EJS) error:', err);
    req.flash('error', 'Failed to load dashboard');
    res.status(500).render('error', { message: 'Failed to load dashboard' });
  }
};

// 2️⃣ JWT Dashboard (API)
exports.getDashboardApi = async (req, res) => {
  try {
    const user = await fetchDashboardData(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // console.log('✅ getDashboardApi called by', req.user?.email);

    const { Document, Selfie } = models;

    const documents = Document
  ? await models.Document.findOne({ where: { userId: user.id }, raw: true })
  : null;

const selfie = Selfie
  ? await models.Selfie.findOne({ where: { userId: user.id }, raw: true })
  : null;

    
    // const document = await models.Document.findOne({
    //   where: { userId: user.id },
    //   raw: true,
    // });


    // const selfie = await models.Selfie.findOne({
    //   where: { userId: user.id },
    //   raw: true,
    // });


    res.json({
      message: 'Welcome to your dashboard',

      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isConfirmed: user.isConfirmed,
      },

      verification: {
        documentsVerified: documents?.isVerified ?? false,
        selfieVerified: selfie?.isVerified ?? false,
      },
    });
  } catch (err) {
    console.error('Dashboard (API) error:', err);   // 
    res.status(500).json({ error: 'Failed to fetch dashboard data' });   // 'Dashboard error'
  }
};



// 3️⃣ Session Dashboard (API) → For dashboard.js when no JWT
exports.getSessionApi = async (req, res) => {
  try {
    if (!req.isAuthenticated || !req.user) {
      return res.status(401).json({ error: 'Not authenticated (no session)' });
    }

    const user = await fetchDashboardData(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const { Document, Selfie } = models;

    const documents = Document
      ? await Document.findOne({ where: { userId: user.id }, raw: true })
      : null;

    const selfie = Selfie
      ? await Selfie.findOne({ where: { userId: user.id }, raw: true })
      : null;

    // console.log('✅ getSessionApi called by', req.user.email);

    // const isVerified = Boolean(document?.isVerified);

    res.json({
      message: 'Session dashboard',

      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isConfirmed: user.isConfirmed,
      },

      // 🔑 THIS IS WHAT ENABLES PREVIEWS
      uploads: {
        passport: documents?.passportKey || null,
        idCard: documents?.idCardKey || null,
        license: documents?.licenseKey || null,
        selfie: selfie?.selfieKey || null,
      },

       // 🛡 SAFE READ-ONLY VERIFICATION FLAGS
      verification: {
        documentsVerified: documents?.isVerified ?? false,
        selfieVerified: selfie?.isVerified ?? false,
      },
    });
  } catch (err) {
    console.error('Dashboard (session API) error:', err);  // 'Session dashboard error:'
    res.status(500).json({ error: 'Failed to fetch session dashboard data' });  // 'Dashboard failed'
  }
};





