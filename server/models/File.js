// server/models/File.js
const mongoose = require('mongoose');
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
    likes: { type: Number, default: 0 }
});

module.exports = mongoose.model('File', fileSchema);