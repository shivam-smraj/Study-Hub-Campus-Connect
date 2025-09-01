// server/models/Collection.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const collectionSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    files: [{
        type: Schema.Types.ObjectId,
        ref: 'File'
    }]
}, { timestamps: true });

module.exports = mongoose.model('Collection', collectionSchema);