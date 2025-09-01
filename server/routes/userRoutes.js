// server/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { isLoggedIn } = require('../middleware/authMiddleware');

// @desc    Get the logged-in user's bookmarked files
// @route   GET /api/user/bookmarks
router.get('/bookmarks', isLoggedIn, async (req, res) => {
    try {
        // Find the user and populate their bookmarkedFiles with the full file documents
        const user = await User.findById(req.user._id).populate('bookmarkedFiles');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user.bookmarkedFiles);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Add a file to the user's bookmarks
// @route   PUT /api/user/bookmarks/:fileId
router.put('/bookmarks/:fileId', isLoggedIn, async (req, res) => {
    try {
        const fileId = req.params.fileId;
        // Use the $addToSet operator to add the fileId to the array, preventing duplicates
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { $addToSet: { bookmarkedFiles: fileId } },
            { new: true }
        );
        res.status(200).json(user.bookmarkedFiles);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Remove a file from the user's bookmarks
// @route   DELETE /api/user/bookmarks/:fileId
router.delete('/bookmarks/:fileId', isLoggedIn, async (req, res) => {
    try {
        const fileId = req.params.fileId;
        // Use the $pull operator to remove the fileId from the array
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { $pull: { bookmarkedFiles: fileId } },
            { new: true }
        );
        res.status(200).json(user.bookmarkedFiles);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// router.get('/search', async (req, res) => {
//     try {
//         const { q, branch, subject } = req.query;

//         if (!q) {
//             return res.status(400).json({ message: 'Search query (q) is required' });
//         }

//         // --- Build the Search Filter ---
//         // We use a regex for a case-insensitive "contains" search
//         const searchQuery = { 
//             fileName: { $regex: q, $options: 'i' } 
//         };

//         // --- Build the Aggregation Pipeline ---
//         // Aggregation is powerful for complex queries like this
//         const pipeline = [
//             // Stage 1: Match files based on the search query
//             { $match: searchQuery },
//             // Stage 2: Look up the subject details for each file
//             {
//                 $lookup: {
//                     from: 'subjects',
//                     localField: 'subject',
//                     foreignField: '_id',
//                     as: 'subjectDetails'
//                 }
//             },
//             // Stage 3: Deconstruct the subjectDetails array field
//             { $unwind: '$subjectDetails' },
//             // Stage 4: Look up the branch details for each subject
//             {
//                 $lookup: {
//                     from: 'branches',
//                     localField: 'subjectDetails.branches',
//                     foreignField: '_id', // <-- THE FIX IS HERE
//                     as: 'branchDetails'
//                 }
//             },
//         ];

//         if (mongoose.Types.ObjectId.isValid(branch)) {
//             // Need to convert the branch string to an ObjectId for matching
//             pipeline.push({ $match: { 'branchDetails._id': new mongoose.Types.ObjectId(branch) } });
//         }
//         if (mongoose.Types.ObjectId.isValid(subject)) {
//             pipeline.push({ $match: { 'subjectDetails._id': new mongoose.Types.ObjectId(subject) } });
//         }

//         // --- Execute the Pipeline ---
//         const results = await File.aggregate(pipeline);

//         res.json(results);

//     } catch (err) {
//         console.error(err.message);
//         res.status(500).json({ message: 'Server Error' });
//     }
// });


module.exports = router;