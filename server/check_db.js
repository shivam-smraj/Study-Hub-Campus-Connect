const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '.env') });

const Branch = require('./models/Branch');
const Subject = require('./models/Subject');
const File = require('./models/File');
const connectDB = require('./config/db');

const checkData = async () => {
    try {
        await connectDB();
        console.log('Connected to DB');

        const branchCount = await Branch.countDocuments();
        console.log(`Branches: ${branchCount}`);

        const subjectCount = await Subject.countDocuments();
        console.log(`Subjects: ${subjectCount}`);

        const fileCount = await File.countDocuments();
        console.log(`Files: ${fileCount}`);

        if (branchCount === 0) {
            console.log('WARNING: No branches found. You might need to run the seeder.');
        }

        const globalSubjects = await Subject.find({ isGlobal: true });
        console.log(`Global Subjects: ${globalSubjects.length}`);
        globalSubjects.forEach(s => console.log(` - ${s.name}`));

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkData();
