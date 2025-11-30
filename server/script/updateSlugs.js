const mongoose = require('mongoose');
const dotenv = require('dotenv');
const slugify = require('slugify');
const Branch = require('../models/Branch');
const Subject = require('../models/Subject');
const File = require('../models/File');

dotenv.config({ path: '../.env' }); // Adjust path if needed, assuming running from server/script

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

const updateSlugs = async () => {
    await connectDB();

    console.log('Updating Branches...');
    const branches = await Branch.find({});
    for (const branch of branches) {
        if (!branch.slug) {
            branch.slug = slugify(branch.name, { lower: true, strict: true });
            await branch.save();
            console.log(`Updated Branch: ${branch.name} -> ${branch.slug}`);
        }
    }

    console.log('Updating Subjects...');
    const subjects = await Subject.find({});
    for (const subject of subjects) {
        if (!subject.slug) {
            subject.slug = slugify(`${subject.name}-${subject.courseCode}`, { lower: true, strict: true });
            await subject.save();
            console.log(`Updated Subject: ${subject.name} -> ${subject.slug}`);
        }
    }

    console.log('Updating Files...');
    const files = await File.find({});
    for (const file of files) {
        if (!file.slug) {
            file.slug = slugify(`${file.fileName}-${Date.now()}-${Math.floor(Math.random() * 1000)}`, { lower: true, strict: true });
            await file.save();
            console.log(`Updated File: ${file.fileName} -> ${file.slug}`);
        }
    }

    console.log('All slugs updated.');
    process.exit();
};

updateSlugs();
