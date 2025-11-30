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
    // Use .lean() for faster execution (returns plain JS objects, not Mongoose docs)
    const branches = await Branch.find({}).select('name shortName slug').lean();
    res.json(branches);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Get branch details by slug or ID
// @route   GET /api/branches/details?slug=... OR /api/branches/details?id=...
router.get('/branches/details', async (req, res) => {
    try {
        const { slug, id } = req.query;
        let branch;
        if (slug) {
            branch = await Branch.findOne({ slug }).select('name shortName slug').lean();
        } else if (id) {
            branch = await Branch.findById(id).select('name shortName slug').lean();
        }

        if (!branch) {
            return res.status(404).json({ message: 'Branch not found' });
        }
        res.json(branch);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Get subjects for a specific branch OR global subjects
// @route   GET /api/subjects?branchId=... OR /api/subjects?branchSlug=... OR /api/subjects?global=true
router.get('/subjects', async (req, res) => {
  try {
    const { branchId, branchSlug, global } = req.query;
    let subjects;

    if (branchId) {
      if (!mongoose.Types.ObjectId.isValid(branchId)) {
        return res.status(400).json({ message: 'Invalid Branch ID' });
      }
      subjects = await Subject.find({ branches: branchId }).select('name courseCode slug').lean();
    } else if (branchSlug) {
       const branch = await Branch.findOne({ slug: branchSlug });
       if (!branch) {
           return res.status(404).json({ message: 'Branch not found' });
       }
       subjects = await Subject.find({ branches: branch._id }).select('name courseCode slug').lean();
    } else if (global === 'true') {
      subjects = await Subject.find({ isGlobal: true }).select('name courseCode slug').lean();
    } else {
      return res.status(400).json({ message: 'A branchId, branchSlug or global=true query parameter is required' });
    }
    
    res.json(subjects);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Get all files for a specific subject
// @route   GET /api/files?subjectId=... OR /api/files?subjectSlug=...
router.get('/files', async (req, res) => {
  try {
    const { subjectId, subjectSlug } = req.query;
    let subject;

    if (subjectId) {
        if (!mongoose.Types.ObjectId.isValid(subjectId)) {
          return res.status(400).json({ message: 'Invalid Subject ID' });
        }
        subject = { _id: subjectId };
    } else if (subjectSlug) {
        subject = await Subject.findOne({ slug: subjectSlug });
        if (!subject) {
            return res.status(404).json({ message: 'Subject not found' });
        }
    } else {
      return res.status(400).json({ message: 'Subject ID or Slug is required' });
    }

    // Find all files linked to the subjectId and sort them by their relative path
    // This sorting is important for grouping them by subfolder on the frontend
    const files = await File.find({ subject: subject._id }).sort({ relativePath: 1 }).lean();
    res.json(files);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Get subject details by slug or ID
// @route   GET /api/subjects/details?slug=... OR /api/subjects/details?id=...
router.get('/subjects/details', async (req, res) => {
    try {
        const { slug, id } = req.query;
        let subject;
        if (slug) {
            subject = await Subject.findOne({ slug }).select('name courseCode slug').lean();
        } else if (id) {
            subject = await Subject.findById(id).select('name courseCode slug').lean();
        }

        if (!subject) {
            return res.status(404).json({ message: 'Subject not found' });
        }
        res.json(subject);
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

router.put('/files/:id/unlike', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid File ID' });
    }

    const file = await File.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: -1 } },
      { new: true }
    );

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    res.json({ likes: file.likes });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;