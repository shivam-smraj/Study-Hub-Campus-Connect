// server/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { isLoggedIn, isAdmin } = require('../middleware/authMiddleware');
const Branch = require('../models/Branch');
const Subject = require('../models/Subject');
const File = require('../models/File');
const User = require('../models/User');
const Visitor = require('../models/Visitor');
const DailyStat = require('../models/DailyStat');

// @desc    A test route to check admin access
// @route   GET /api/admin/check
router.get('/check', isLoggedIn, isAdmin, (req, res) => {
    res.status(200).json({ message: 'Success! You have admin access.' });
});

// @desc    Get system statistics
// @route   GET /api/admin/stats
router.get('/stats', isLoggedIn, isAdmin, async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        const fileCount = await File.countDocuments();
        const subjectCount = await Subject.countDocuments();
        const branchCount = await Branch.countDocuments();

        // Analytics
        const now = new Date();
        const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
        const todayStr = new Date().toISOString().split('T')[0];
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

        // 1. Active Now (Unique Visitors in last 5 mins)
        const activeUsers = await Visitor.countDocuments({ lastActive: { $gte: fiveMinutesAgo } });

        // 2. Today's Stats (From DailyStat)
        const todayStats = await DailyStat.findOne({ date: todayStr });
        const dailyViews = todayStats ? todayStats.views : 0;
        const dailyVisitors = todayStats ? todayStats.visitorIds.length : 0;

        // 3. Monthly Stats
        // Monthly Unique Visitors (from Visitor collection - best for MAU)
        const monthlyVisitors = await Visitor.countDocuments({ lastActive: { $gte: monthStart } });
        
        // Monthly Views (Aggregate from DailyStat)
        const monthStartStr = monthStart.toISOString().split('T')[0];
        const monthlyViewsAgg = await DailyStat.aggregate([
            { $match: { date: { $gte: monthStartStr } } },
            { $group: { _id: null, totalViews: { $sum: "$views" } } }
        ]);
        const monthlyViews = monthlyViewsAgg.length > 0 ? monthlyViewsAgg[0].totalViews : 0;

        res.json({
            users: userCount,
            files: fileCount,
            subjects: subjectCount,
            branches: branchCount,
            analytics: {
                activeUsers,
                dailyViews,
                dailyVisitors,
                monthlyViews,
                monthlyVisitors
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Get all users
// @route   GET /api/admin/users
router.get('/users', isLoggedIn, isAdmin, async (req, res) => {
    try {
        const users = await User.find({}).sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Create a new branch
// @route   POST /api/admin/branches
router.post('/branches', isLoggedIn, isAdmin, async (req, res) => {
    try {
        const { name, shortName } = req.body;
        if (!name || !shortName) {
            return res.status(400).json({ message: 'Name and Short Name are required' });
        }
        const newBranch = new Branch({ name, shortName });
        await newBranch.save();
        res.status(201).json(newBranch);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Create a new subject
// @route   POST /api/admin/subjects
router.post('/subjects', isLoggedIn, isAdmin, async (req, res) => {
    try {
        const { name, courseCode, branches, isGlobal } = req.body;
        if (!name || !courseCode) {
            return res.status(400).json({ message: 'Name and Course Code are required' });
        }
        
        const newSubject = new Subject({
            name,
            courseCode,
            branches: branches || [], // Array of Branch IDs
            isGlobal: isGlobal || false
        });
        
        await newSubject.save();
        res.status(201).json(newSubject);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Upload a new file (metadata)
// @route   POST /api/admin/files
router.post('/files', isLoggedIn, isAdmin, async (req, res) => {
    try {
        const { fileName, driveFileId, fileUrl, relativePath, fileType, fileSize, description, subject } = req.body;
        
        if (!fileName || !driveFileId || !fileUrl || !subject) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const newFile = new File({
            fileName,
            driveFileId,
            fileUrl,
            relativePath: relativePath || 'Root',
            fileType: fileType || 'application/pdf',
            fileSize: fileSize || 'Unknown',
            description,
            subject
        });

        await newFile.save();
        res.status(201).json(newFile);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Update a branch
// @route   PUT /api/admin/branches/:id
router.put('/branches/:id', isLoggedIn, isAdmin, async (req, res) => {
    try {
        const { name, shortName } = req.body;
        const updatedBranch = await Branch.findByIdAndUpdate(
            req.params.id,
            { name, shortName },
            { new: true }
        );
        if (!updatedBranch) return res.status(404).json({ message: 'Branch not found' });
        res.json(updatedBranch);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Delete a branch
// @route   DELETE /api/admin/branches/:id
router.delete('/branches/:id', isLoggedIn, isAdmin, async (req, res) => {
    try {
        const branch = await Branch.findByIdAndDelete(req.params.id);
        if (!branch) return res.status(404).json({ message: 'Branch not found' });
        res.json({ message: 'Branch removed' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Update a subject
// @route   PUT /api/admin/subjects/:id
router.put('/subjects/:id', isLoggedIn, isAdmin, async (req, res) => {
    try {
        const { name, courseCode, branches, isGlobal } = req.body;
        const updatedSubject = await Subject.findByIdAndUpdate(
            req.params.id,
            { name, courseCode, branches, isGlobal },
            { new: true }
        );
        if (!updatedSubject) return res.status(404).json({ message: 'Subject not found' });
        res.json(updatedSubject);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Delete a subject
// @route   DELETE /api/admin/subjects/:id
router.delete('/subjects/:id', isLoggedIn, isAdmin, async (req, res) => {
    try {
        const subject = await Subject.findByIdAndDelete(req.params.id);
        if (!subject) return res.status(404).json({ message: 'Subject not found' });
        res.json({ message: 'Subject removed' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Update a file
// @route   PUT /api/admin/files/:id
router.put('/files/:id', isLoggedIn, isAdmin, async (req, res) => {
    try {
        const { fileName, driveFileId, fileUrl, relativePath, fileType, fileSize, description, subject } = req.body;
        const updatedFile = await File.findByIdAndUpdate(
            req.params.id,
            { fileName, driveFileId, fileUrl, relativePath, fileType, fileSize, description, subject },
            { new: true }
        );
        if (!updatedFile) return res.status(404).json({ message: 'File not found' });
        res.json(updatedFile);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Delete a file
// @route   DELETE /api/admin/files/:id
router.delete('/files/:id', isLoggedIn, isAdmin, async (req, res) => {
    try {
        const file = await File.findByIdAndDelete(req.params.id);
        if (!file) return res.status(404).json({ message: 'File not found' });
        res.json({ message: 'File removed' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;