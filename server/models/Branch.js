// server/models/Branch.js
const mongoose = require('mongoose');
const branchSchema = new mongoose.Schema({
    name: { type: String, required: true },
    shortName: { type: String, required: true, unique: true }
});
module.exports = mongoose.model('Branch', branchSchema);