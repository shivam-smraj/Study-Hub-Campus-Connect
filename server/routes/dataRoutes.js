// server/routes/dataRoutes.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Import models
const Branch = require('../models/Branch');
const Subject = require('../models/Subject');
const File = require('../models/File');

// @desc    Get all branches
// @route   GET /api/branches
router.get('/branches', async (req, res) => {
  try {
    // We only need the name and shortName for the frontend, plus the _id
    const branches = await Branch.find({}).select('name shortName');
    res.json(branches);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Get subjects for a specific branch OR global subjects
// @route   GET /api/subjects?branchId=... OR /api/subjects?global=true
router.get('/subjects', async (req, res) => {
  try {
    const { branchId, global } = req.query;
    let subjects;

    if (branchId) {
      if (!mongoose.Types.ObjectId.isValid(branchId)) {
        return res.status(400).json({ message: 'Invalid Branch ID' });
      }
      // Find subjects that contain the given branchId in their 'branches' array
      subjects = await Subject.find({ branches: branchId }).select('name courseCode');
    } else if (global === 'true') {
      // Find subjects marked as global (e.g., Syllabus, Question Papers)
      subjects = await Subject.find({ isGlobal: true }).select('name courseCode');
    } else {
      return res.status(400).json({ message: 'A branchId or global=true query parameter is required' });
    }
    
    res.json(subjects);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Get all files for a specific subject
// @route   GET /api/files?subjectId=...
router.get('/files', async (req, res) => {
  try {
    const { subjectId } = req.query;

    if (!subjectId) {
      return res.status(400).json({ message: 'Subject ID is required' });
    }
    if (!mongoose.Types.ObjectId.isValid(subjectId)) {
      return res.status(400).json({ message: 'Invalid Subject ID' });
    }

    // Find all files linked to the subjectId and sort them by their relative path
    // This sorting is important for grouping them by subfolder on the frontend
    const files = await File.find({ subject: subjectId }).sort({ relativePath: 1 });
    res.json(files);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.put('/files/:id/like', async (req, res) => {
  try {
    // Check if the provided ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid File ID' });
    }

    // Find the file by its ID and atomically increment the 'likes' field by 1
    // { new: true } ensures that the updated document is returned
    const file = await File.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );

    // If no file was found with that ID, return an error
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Send back just the new like count
    res.json({ likes: file.likes });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;