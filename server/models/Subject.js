// server/models/Subject.js
const mongoose = require('mongoose');
const slugify = require('slugify');
const { Schema } = mongoose;

const subjectSchema = new Schema({
    name: { type: String, required: true },
    courseCode: { type: String, required: true, unique: true },
    branches: [{ type: Schema.Types.ObjectId, ref: 'Branch' }],
    isGlobal: { type: Boolean, default: false },
    slug: { type: String, unique: true }
});

subjectSchema.pre('save', function(next) {
    if (!this.isModified('name')) {
        return next();
    }
    // Append courseCode to ensure uniqueness if names are similar
    this.slug = slugify(`${this.name}-${this.courseCode}`, { lower: true, strict: true });
    next();
});

// Add indexes for faster filtering
subjectSchema.index({ branches: 1 });
subjectSchema.index({ isGlobal: 1 });
subjectSchema.index({ slug: 1 });

module.exports = mongoose.model('Subject', subjectSchema);