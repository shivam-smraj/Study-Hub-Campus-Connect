// server/models/User.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  googleId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  displayName: { type: String, required: true },
  firstName: { type: String, required: true },
  image: { type: String },
  collections: [{ type: Schema.Types.ObjectId, ref: 'Collection' }],
  bookmarkedFiles: [{ type: Schema.Types.ObjectId, ref: 'File' }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);