// server/routes/searchRoutes.js

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const File = require('../models/File'); // Make sure to import the File model

// @desc    Search for files with optional filters
// @route   GET /api/search?q=...&branch=...&subject=...
router.get('/', async (req, res) => { // Route is now just '/' relative to where it's mounted
    try {
        const { q, branch, subject } = req.query;

        if (!q) {
            return res.status(400).json({ message: 'Search query (q) is required' });
        }

        const searchQuery = { 
            fileName: { $regex: q, $options: 'i' } 
        };

        const pipeline = [
            { $match: searchQuery },
            {
                $lookup: {
                    from: 'subjects',
                    localField: 'subject',
                    foreignField: '_id',
                    as: 'subjectDetails'
                }
            },
            { $unwind: '$subjectDetails' },
            {
                $lookup: {
                    from: 'branches',
                    localField: 'subjectDetails.branches',
                    foreignField: '_id',
                    as: 'branchDetails'
                }
            },
            {
                $project: {
                    fileName: 1,
                    fileType: 1,
                    fileSize: 1,
                    fileUrl: 1,
                    driveFileId: 1,
                    relativePath: 1,
                    likes: 1,
                    slug: 1,
                    'subjectDetails.name': 1,
                    'subjectDetails._id': 1,
                    'subjectDetails.slug': 1,
                    'branchDetails.name': 1
                }
            }
        ];

        if (mongoose.Types.ObjectId.isValid(branch)) {
            pipeline.push({ $match: { 'branchDetails._id': new mongoose.Types.ObjectId(branch) } });
        }
        if (mongoose.Types.ObjectId.isValid(subject)) {
            pipeline.push({ $match: { 'subjectDetails._id': new mongoose.Types.ObjectId(subject) } });
        }

        const results = await File.aggregate(pipeline);
        res.json(results);

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;