const User = require('../models/User');
const Visitor = require('../models/Visitor');
const DailyStat = require('../models/DailyStat');
const crypto = require('crypto');

const trackActivity = async (req, res, next) => {
  try {
    // 1. Identify Visitor
    let visitorId = req.cookies.visitor_id;
    
    if (!visitorId) {
      visitorId = crypto.randomUUID();
      // Set a long-lived cookie (e.g., 1 year)
      res.cookie('visitor_id', visitorId, { 
        maxAge: 365 * 24 * 60 * 60 * 1000, 
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      });
    }

    // 2. Update Visitor Record (Real-time status)
    const updateData = {
      lastActive: new Date(),
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent')
    };

    if (req.user) {
      updateData.userId = req.user._id;
    }

    // Use upsert to create or update
    await Visitor.findOneAndUpdate(
      { visitorId: visitorId },
      updateData,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // 3. Update Daily Stats (Historical & Counts)
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    
    await DailyStat.findOneAndUpdate(
        { date: today },
        { 
            $inc: { views: 1 },
            $addToSet: { visitorIds: visitorId }
        },
        { upsert: true }
    );

    // 4. Update Registered User Record (if logged in)
    if (req.user) {
      await User.findByIdAndUpdate(req.user._id, { lastActive: new Date() }, { timestamps: false });
    }

  } catch (err) {
    console.error('Error tracking activity:', err);
  }
  
  next();
};

module.exports = trackActivity;
