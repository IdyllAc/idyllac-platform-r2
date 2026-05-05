/***********************
 *  LOAD ENV & CORE
 ***********************/
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
console.log('🌍 NODE_ENV:', process.env.NODE_ENV);
console.log('🌍 R2_ACCOUNT_ID exists:', !!process.env.R2_ACCOUNT_ID);


const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
// const methodOverride = require('method-override');
const session = require('express-session');
const passport = require('passport');
const pgSession = require('connect-pg-simple')(session);
const flash = require('connect-flash');
const { Pool } = require('pg');
const { sequelize} = require('./models');
const initializePassport = require('./config/passport');
const jwtMiddleware = require('./middleware/jwtMiddleware');
const combinedAuth = require('./middleware/combinedAuth');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const inactivityMiddleware = require("./middleware/inactivityMiddleware");
const rateLimit = require('express-rate-limit').default;
const uploadRoutes = require('./routes/upload');

/***********************
 *  ROUTES
 ***********************/
const publicRoutes = require('./routes/public');        // EJS pages
const authRoutes = require('./routes/auth');            // JSON API
const userRoutes = require('./routes/user');            // Profile, settings
const subscribeRoutes = require('./routes/subscribe');
const messageRoutes = require('./routes/message');
const protectRoutes = require('./routes/protect');      // Docs, selfie
const profileRoutes = require('./routes/profile');
const dashboardRoutes = require('./routes/dashboard');
const socialAuthRoutes = require('./routes/authSocial');
const adminAuthRoutes = require('./routes/admin');



/***********************
 *  APP INIT
 ***********************/
const app = express();
const PORT = process.env.PORT || 3000;
/* ===============================
   RATE LIMITERS (DEFINE FIRST)
================================ */


const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 10,                 // 10 requests per IP
  message: 'Too many auth attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

 // app.use(limiter);


app.use('/api/auth/register', authLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/login', authLimiter);


// Enable trust proxy ONLY in production (needed if you’re behind Nginx/Render/Heroku/Cloudflare)
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}


// ensure and serve
['uploads', path.join('uploads','profile_photos')].forEach(dir => {
  const full = path.join(__dirname, dir);
  if (!fs.existsSync(full)) fs.mkdirSync(full, { recursive: true });
});


/***********************
 *  PASSPORT INIT
 ***********************/
// Initialize all strategies (local + social)
initializePassport(passport);

/***********************
 *  VIEW ENGINE
 ***********************/
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');



/***********************
 *  MIDDLEWARE, SECURITY + STATIC FILES
 ***********************/
app.use(helmet());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"], // only if you have inline <style>
      imgSrc: ["'self'", "data:", "blob"], // allow base64 images (e.g. selfie preview)
      connectSrc: [
        "'self'",
        "https://*.r2.cloudflarestorage.com"
], // for R2 uploads
objectSrc: ["'none'"],
baseUri: ["'self'"]
    },
  })
);

// console.log("NODE_ENV =", process.env.NODE_ENV);

/***********************
 *  SESSION STORE
 ***********************/
let pgPool;


// //  if (process.env.NODE_ENV === 'production') {
  if (process.env.DATABASE_URL) {
  // Render/Postgres in production
  pgPool = new Pool({
    connectionString: process.env.DATABASE_URL,
   ssl: { rejectUnauthorized: false },
  });
} else {
  // Local development DB
   pgPool = new Pool({
    host: process.env.DB_HOST || "127.0.0.1",
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || "stidyllac",
    password: process.env.DB_PASSWORD || null,
    database: process.env.DB_NAME || "idyllac_db_e081",
    ssl: false, // explicitly off in dev
  });
}

const store = new pgSession({
  pool: pgPool,
  tableName: "session",
  createTableIfMissing: true,  
});

/***********************
 *  CORE MIDDLEWARES
 ***********************/
app.use(cookieParser()); // ✅ parse cookies into req.cookies

// ✅ Using the store defined above with session middleware plug into Express
app.use(require('express-session')({
    store, // <-- your configured store (MySQL, Redis, PostgreSQL, etc.)
    secret: process.env.SESSION_SECRET || "super-secret-key", // 🔑 required
    resave: false,             // recommended
    saveUninitialized: false,  // recommended
    rolling: true, // 🔄 refresh cookie expiration on each request
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day (in ms)
      secure: process.env.NODE_ENV === "production", // ✅ cookie only over HTTPS in prod on different domains this become true
      httpOnly: true, // JS can’t touch cookies
      sameSite: process.env.NODE_ENV === "production" ? "None" : "lax", // 'None' for cross-site in prod (with HTTPS), 'lax' in dev
      // path: '/', // cookie valid for entire site
    },
  }));

// 3️⃣ Passport (after session)
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
// app.use(methodOverride('_method'));

// Apply before your protected routes
app.use(inactivityMiddleware);

/***********************
 *  GLOBAL LOCALS
 ***********************/
// 👇 make req.user available to all EJS templates
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});


app.use(flash());


// Make flash messages available in all templates
app.use((req, res, next) => {
  res.locals.messages = req.flash();
  next();
});

/***********************
 *  CORS
 ***********************/
app.use(cors({
  origin: [
    process.env.BASE_URL,
    'http://localhost:3000',
    'http://127.0.0.1:3000',
  ],
  credentials: true,
}));

/***********************
 *  SESSION HELPERS
 ***********************/
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return res.redirect('/dashboard');
  next();
}



/***********************
 *  LANGUAGE MIDDLEWARE
 ***********************/
app.use('/:lang', (req, res, next) => {
  const allowed = ['ar', 'en', 'fr'];
  const lang = allowed.includes(req.params.lang) ? req.params.lang : 'en';

  req.session.lang = lang;
  req.lang = lang;

  next();
});

/***********************
 *  ROOT REDIRECT
 ***********************/
app.get('/', (req, res) => {
  const lang = req.acceptsLanguages('ar', 'en', 'fr') || 'en';
  res.redirect(`/${lang}`);
});


/***********************
 *  PAGE RENDERERS
 ***********************/
// Auto language detection for root route
const renderPage = (page) => {
  return (req, res) => {
    const lang = req.params.lang || 'en';

    res.render(`${page}${lang === 'ar' ? 'AR' : lang.charAt(0).toUpperCase() + lang.slice(1)}`);
    //  res.render(`${page}${lang === 'ar' ? '' : lang.toUpperCase()}`);
    // res.render(`${page}${lang.toUpperCase()}`);
  };
};


// const serveStaticPage = (page) => {
//   return (req, res) => {
//     const lang = req.lang || 'en';

//     const fileMap = {
//       ar: `${page}.html`,
//       en: `${page}En.html`,
//       fr: `${page}Fr.html`
//     };

//     res.sendFile(path.join(__dirname, 'public', fileMap[lang])); // Serve the appropriate file based on detected language
//   };
// };
const serveStaticPage = (page) => {
  return (req, res) => {
    const lang = ['ar','en','fr'].includes(req.params.lang)
      ? req.params.lang
      : 'en';

    const fileMap = {
      ar: `${page}.html`,
      en: `${page}En.html`,
      fr: `${page}Fr.html`
    };

    const fileName = fileMap[lang];

    res.sendFile(path.join(__dirname, 'public', fileName));
  };
};

/***********************
 *  PUBLIC PAGES (NO AUTH)
 ***********************/
app.get('/:lang', serveStaticPage('index'));
app.get('/:lang/index', serveStaticPage('index'));
app.get('/:lang/subscribe', serveStaticPage('subscribe'));
app.get('/:lang/local', serveStaticPage('local'));
app.get('/:lang/international', serveStaticPage('international'));
app.get('/:lang/about', serveStaticPage('about'));
app.get('/:lang/contact', serveStaticPage('contact'));
app.get('/:lang/hours', serveStaticPage('hours'));
app.get('/:lang/menu', serveStaticPage('menu'));
app.get('/:lang/app', serveStaticPage('app'));

/***********************
 *  LEGAL PAGES
 ***********************/
app.get('/:lang/privacy', (req, res) => {
  const lang = req.lang || 'en';
  const file = lang === 'ar' ? 'privacy.html' : `privacy${lang.toUpperCase()}.html`;
  res.sendFile(path.join(__dirname, 'public/legal', file));
});

app.get('/:lang/tos', (req, res) => {
  const lang = req.lang || 'en';
  const file = lang === 'ar' ? 'tos.html' : `tos${lang.toUpperCase()}.html`;
  res.sendFile(path.join(__dirname, 'public/legal', file));
});

/***********************
 *  AUTH PAGES (WITH GUARD)
 ***********************/
app.get('/:lang/login', checkNotAuthenticated, renderPage('login'));
app.get('/:lang/register', checkNotAuthenticated, renderPage('register'));



/***********************
 *  ROUTE MOUNTING
 ***********************/
// Public HTML pages (EJS)
app.use('/', publicRoutes); // EJS routes (login, register, static pages)
app.use('/subscribe', subscribeRoutes); // subscription forms (email/social)
app.use('/auth', socialAuthRoutes);
app.use('/message', messageRoutes); // contact/message forms 
app.use('/admin', adminAuthRoutes); // admin login + review dashboard ???/??


// JSON API
app.use('/api/auth', authRoutes); // API Login/register/logout API
app.use('/api/user', jwtMiddleware, userRoutes); // user API
app.use('/', dashboardRoutes); // dashboard (session protected)
app.use('/protect', combinedAuth, protectRoutes);
app.use('/profile', combinedAuth, profileRoutes); // or app.use('/api', profileRoutes) depending on your structure
app.use('/api/upload', uploadRoutes);




/***********************
 *  ERROR HANDLER
 ***********************/
app.use((err, req, res, next) => {
  console.error('💥 Uncaught error:', err.stack);
  res.status(500).send('Something went wrong!');
});

/***********************
 *  DATABASE CONNECT
 ***********************/
sequelize.authenticate()
  .then(() => console.log('✅ Database connected'))
  .catch(err => console.error('❌ DB connection error:', err));

sequelize.sync()
  .then(() => console.log('✅ ALL models synced'))
  .catch(err => console.error('❌ Sync error:', err));

/***********************
 *  START SERVER
 ***********************/
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
