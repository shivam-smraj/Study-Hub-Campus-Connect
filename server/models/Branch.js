// server/models/Branch.js
const mongoose = require('mongoose');
const slugify = require('slugify');

const branchSchema = new mongoose.Schema({
    name: { type: String, required: true },
    shortName: { type: String, required: true, unique: true },
    slug: { type: String, unique: true }
});

branchSchema.pre('save', function(next) {
    if (!this.isModified('name')) {
        return next();
    }
    this.slug = slugify(this.name, { lower: true, strict: true });
    next();
});

module.exports = mongoose.model('Branch', branchSchema);