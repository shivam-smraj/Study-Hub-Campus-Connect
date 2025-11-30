// server/routes/collectionRoutes.js
const express = require('express');
const router = express.Router();
const Collection = require('../models/Collection');
const User = require('../models/User');
const { isLoggedIn } = require('../middleware/authMiddleware');

// @desc    Create a new collection
// @route   POST /api/collections
router.post('/', isLoggedIn, async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ message: 'Collection name is required' });
        }
        const newCollection = new Collection({
            name,
            creator: req.user._id,
            files: []
        });
        const savedCollection = await newCollection.save();
        
        // Also add this collection to the user's list of collections
        await User.findByIdAndUpdate(req.user._id, { $push: { collections: savedCollection._id } });

        res.status(201).json(savedCollection);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Get all collections for the logged-in user
// @route   GET /api/collections
router.get('/', isLoggedIn, async (req, res) => {
    try {
        const collections = await Collection.find({ creator: req.user._id }).sort({ updatedAt: -1 });
        res.json(collections);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Get a single collection by its ID
// @route   GET /api/collections/:id
router.get('/:id', isLoggedIn, async (req, res) => {
    try {
        const collection = await Collection.findById(req.params.id).populate('files');
        if (!collection) {
            return res.status(404).json({ message: 'Collection not found' });
        }
        // Security check: ensure the user requesting the collection is the one who created it
        if (collection.creator.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'User not authorized' });
        }
        res.json(collection);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Add a file to a collection
// @route   PUT /api/collections/:id/add-file
router.put('/:id/add-file', isLoggedIn, async (req, res) => {
    try {
        const { fileId } = req.body;
        const collection = await Collection.findById(req.params.id);

        if (!collection) return res.status(404).json({ message: 'Collection not found' });
        if (collection.creator.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'User not authorized' });

        const updatedCollection = await Collection.findByIdAndUpdate(
            req.params.id,
            { $addToSet: { files: fileId } },
            { new: true }
        );
        res.json(updatedCollection);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Delete a collection
// @route   DELETE /api/collections/:id
router.delete('/:id', isLoggedIn, async (req, res) => {
    try {
        const collection = await Collection.findById(req.params.id);

        if (!collection) return res.status(404).json({ message: 'Collection not found' });
        if (collection.creator.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'User not authorized' });

        await Collection.findByIdAndDelete(req.params.id);
        
        // Remove from user's collection list
        await User.findByIdAndUpdate(req.user._id, { $pull: { collections: req.params.id } });

        res.json({ message: 'Collection removed' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;