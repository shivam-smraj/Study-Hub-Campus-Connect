// server/models/Subject.js
const mongoose = require('mongoose');
const { Schema } = mongoose;
const subjectSchema = new Schema({
    name: { type: String, required: true },
    courseCode: { type: String, required: true, unique: true },
    branches: [{ type: Schema.Types.ObjectId, ref: 'Branch' }],
    isGlobal: { type: Boolean, default: false }
});
module.exports = mongoose.model('Subject', subjectSchema);