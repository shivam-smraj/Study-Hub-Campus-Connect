// server/models/File.js
const mongoose = require('mongoose');
const slugify = require('slugify');
const { Schema } = mongoose;

const fileSchema = new Schema({
    fileName: { type: String, required: true },
    driveFileId: { type: String, required: true },
    fileUrl: { type: String, required: true },
    relativePath: { type: String, required: true },
    fileType: { type: String, required: true },
    fileSize: { type: String, required: true },
    uploadDate: { type: Date, default: Date.now },
    description: { type: String },
    subject: { type: Schema.Types.ObjectId, ref: 'Subject', required: true },
    likes: { type: Number, default: 0 },
    slug: { type: String, unique: true, sparse: true } // sparse because old files might not have it immediately, though we will backfill
});

fileSchema.pre('save', function(next) {
    if (!this.isModified('fileName')) {
        return next();
    }
    // Use nanoid or just append a random string/timestamp to ensure uniqueness for files
    // or just rely on fileName if we trust it. Let's append a short random string or part of ID if available.
    // Since we don't have ID before save sometimes, let's use timestamp.
    this.slug = slugify(`${this.fileName}-${Date.now()}`, { lower: true, strict: true });
    next();
});

// Add a compound index to speed up queries that filter by subject and sort by relativePath
fileSchema.index({ subject: 1, relativePath: 1 });
fileSchema.index({ slug: 1 });

module.exports = mongoose.model('File', fileSchema);