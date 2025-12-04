const mongoose = require('mongoose');

const dailyStatSchema = new mongoose.Schema({
  date: { type: String, required: true, unique: true }, // Format: YYYY-MM-DD
  views: { type: Number, default: 0 },
  visitorIds: [{ type: String }] // To track unique daily visitors
});

module.exports = mongoose.model('DailyStat', dailyStatSchema);
