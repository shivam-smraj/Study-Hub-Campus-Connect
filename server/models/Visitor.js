const mongoose = require('mongoose');
const { Schema } = mongoose;

const visitorSchema = new Schema({
  visitorId: { type: String, required: true, unique: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User' }, // Optional link to registered user
  ip: { type: String },
  userAgent: { type: String },
  lastActive: { type: Date, default: Date.now }
}, { timestamps: true });

// Index for fast counting based on time
visitorSchema.index({ lastActive: 1 });

module.exports = mongoose.model('Visitor', visitorSchema);
