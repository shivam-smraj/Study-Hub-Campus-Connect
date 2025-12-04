const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const dataRoutes = require('./routes/dataRoutes');
const mongoose = require('mongoose');
const session = require('express-session'); 
const passport = require('passport'); 
const MongoStore = require('connect-mongo'); 
const cookieParser = require('cookie-parser'); 
const trackActivity = require('./middleware/activityMiddleware');

const authRoutes = require('./routes/authRoutes'); 
const userRoutes = require('./routes/userRoutes');
const collectionRoutes = require('./routes/collectionRoutes');
const searchRoutes = require('./routes/searchRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Load env vars
dotenv.config();

// Connect to database
connectDB();
// const connectDB = require('./config/db');
require('./config/passport-setup'); // <-- IMPORTANT: This runs the passport config code
// const dataRoutes = require('./routes/dataRoutes');
// const authRoutes = require('./routes/authRoutes'); 

const app = express();

// --- SECURITY & PERFORMANCE MIDDLEWARE ---
app.use(helmet()); // Set security HTTP headers
app.use(compression()); // Compress all responses

// Rate limiting: 100 requests per 15 minutes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

app.use(express.json());

app.use(cors({
  origin: [process.env.CLIENT_URL, 'http://localhost:3000', 'https://iiestians.tech','https://www.iiestians.tech'],
  credentials: true
}));
app.use(cookieParser());


// --- SESSION MIDDLEWARE ---
app.use(
  session({
    secret: process.env.COOKIE_KEY,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
    }
  })
);

// --- PASSPORT MIDDLEWARE ---
app.use(passport.initialize());
app.use(passport.session());

// --- ACTIVITY TRACKING ---
app.use(trackActivity);

// --- MOUNT ROUTERS ---
app.use('/api', dataRoutes);
app.use('/api/auth', authRoutes); 
app.use('/api/user', userRoutes); 
app.use('/api/collections', collectionRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;