const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const dataRoutes = require('./routes/dataRoutes');
const mongoose = require('mongoose');
const session = require('express-session'); 
const passport = require('passport'); 
const MongoStore = require('connect-mongo'); 
const cookieParser = require('cookie-parser'); 

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

app.use(express.json());

const allowedOrigins = [
  'http://localhost:3000',
  process.env.CLIENT_URL // This comes from your .env file
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
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
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      // --- IMPORTANT FOR PRODUCTION ---
      secure: process.env.NODE_ENV === 'production', // Send cookie only over HTTPS
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // Necessary for cross-site cookies
    }
  })
);

// --- PASSPORT MIDDLEWARE ---
app.use(passport.initialize());
app.use(passport.session());

// --- MOUNT ROUTERS ---
// app.use('/api', dataRoutes);
app.use('/api/auth', authRoutes); 
app.use('/api/user', userRoutes); 
app.use('/api/collections', collectionRoutes);
// app.use('/api/search', searchRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));