// server/scripts/seeder.js

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// --- CONFIGURATION ---
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const Branch = require('../models/Branch');
const Subject = require('../models/Subject');
const File = require('../models/File');
const connectDB = require('../config/db');

// Paste your Netlify base URL here
// const FILE_BASE_URL = 'https://my-study-files.netlify.app'; // <--- IMPORTANT: REPLACE THIS

// Branch to Subject Mapping (based on your provided list)
// The keys here MUST EXACTLY MATCH the folder names in your '1st_year' directory
const branchMappings = {
    "Electrical Engineering (EE)": [
        "Engineering Chemistry (CH 1101 N)", "Professional Communication in English (HU 1102 N)", "Well-being and Happiness (HU1101N)",
        "Basic Electrical Engineering (EE1101N)", "Basic Electronics (ET1101N)", "Engineering Mathematics - I (MA 1101N)",
        "Basic Electrical Engineering Laboratory (EE 1171 N)", "Computer Programming Practice (CS 1171 N)", "Workshop (WS 1171N)"
    ],
    "Computer Science and Technology (CST)": [
        "Basic Electronics (ET1101N)", "Engineering Chemistry (CH 1101 N)", "Engineering Mathematics - I (MA 1101N)",
        "Well-being and Happiness (HU1101N)", "Professional Communication in English (HU 1102 N)", "Introduction to Computing (CS 1101N)",
        "Chemistry Lab (CH 1171 N)", "Computer Programming Practice (CS 1171 N)"
    ],
    "Information Technology (IT)": [
        "Introduction to Computing (CS 1101N)", "Engineering Mathematics - I (MA 1101N)", "Basic Electronics (ET1101N)",
        "Engineering Chemistry (CH 1101 N)", "Professional Communication in English (HU 1102 N)", "Well-being and Happiness (HU1101N)",
        "Workshop (WS 1171N)", "Chemistry Lab (CH 1171 N)", "Computer Programming Practice (CS 1171 N)"
    ],
    "Electronics and Telecommunication Engineering (ETCE)": [
        "Basic Electrical Engineering (EE1101N)", "Well-being and Happiness (HU1101N)", "Introduction to Computing (CS 1101N)",
        "Engineering Chemistry (CH 1101 N)", "Professional Communication in English (HU 1102 N)", "Engineering Mathematics - I (MA 1101N)",
        "Workshop (WS 1171N)", "Computer Programming Practice (CS 1171 N)", "Basic Electrical Engineering Laboratory (EE 1171 N)"
    ],
    "Architecture (Arch)": [
        /* Add your Architecture subject folder names here */
    ],
    "Civil Engineering (CE)": [
        "Engineering Mechanics (AM 1101N)", "Introduction to AI&ML (CS 1102N)", "Engineering Physics (PH 1101N)",
        "Engineering Mathematics - I (MA 1101N)", "Energy, Environment and Climate Change (CE 1101N)", "Engineering Materials (MM 1101N)",
        "Computer Programming Practice (CS 1171 N)", "Engineering Materials Laboratory (MM 1171 N)", "Physics Lab (PH 1171N)", "Engineering Graphics (AM 1171N)"
    ],
    "Mechanical Engineering (ME)": [
        "Basic Electrical Engineering (EE1101N)", "Engineering Physics (PH 1101N)", "Engineering Mathematics - I (MA 1101N)",
        "Introduction to AI&ML (CS 1102N)", "Energy, Environment and Climate Change (CE 1101N)", "Engineering Mechanics (AM 1101N)",
        "Engineering Graphics (AM 1171N)", "Basic Electrical Engineering Laboratory (EE 1171 N)", "Physics Lab (PH 1171N)"
    ],
    "Aerospace Engineering & Applied Mechanics (AE&AM)": [
        "Engineering Mechanics (AM 1101N)", "Engineering Physics (PH 1101N)", "Engineering Mathematics - I (MA 1101N)",
        "Basic Electrical Engineering (EE1101N)", "Energy, Environment and Climate Change (CE 1101N)", "Introduction to AI&ML (CS 1102N)",
        "Computer Programming Practice (CS 1171 N)", "Physics Lab (PH 1171N)", "Engineering Graphics (AM 1171N)"
    ],
    "Mining Engineering (MIN)": [
        "Engineering Mechanics (AM 1101N)", "Engineering Physics (PH 1101N)", "Engineering Mathematics - I (MA 1101N)",
        "Basic Electronics (ET1101N)", "Energy, Environment and Climate Change (CE 1101N)", "Introduction to AI&ML (CS 1102N)",
        "Physics Lab (PH 1171N)", "Computer Programming Practice (CS 1171 N)", "Engineering Graphics (AM 1171N)"
    ],
    "Metallurgy and Materials Engineering (MET)": [
        "Engineering Mechanics (AM 1101N)", "Introduction to AI&ML (CS 1102N)", "Engineering Physics (PH 1101N)",
        "Engineering Mathematics - I (MA 1101N)", "Energy, Environment and Climate Change (CE 1101N)", "Engineering Materials (MM 1101N)",
        "Engineering Materials Laboratory (MM 1171 N)", "Physics Lab (PH 1171N)", "Computer Programming Practice (CS 1171 N)", "Engineering Graphics (AM 1171N)"
    ]
};
// Add any global subjects that should be accessible to all
const globalSubjects = ["SYLLABUS", "QUESTION PAPERS"];


connectDB();

const importData = async () => {
    try {
        // 1. Clear existing data
        console.log('Clearing existing data...');
        await Branch.deleteMany();
        await Subject.deleteMany();
        await File.deleteMany();

        // 2. Create branches and store their IDs
        console.log('Creating branches...');
        const createdBranches = {};
        for (const branchName of Object.keys(branchMappings)) {
            const shortName = branchName.match(/\(([^)]+)\)/)[1];
            const branch = await Branch.create({ name: branchName, shortName });
            createdBranches[branchName] = branch._id;
        }

        // 3. Read data.json
        console.log('Reading data.json...');
        const dataPath = path.resolve(__dirname, '../data.json');
        const fileData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

        // 4. Create subjects and files
        console.log('Creating subjects and files...');
        for (const subjectFolderName in fileData) {
            if (fileData.hasOwnProperty(subjectFolderName)) {
                // Find which branches this subject belongs to
                const parentBranchIDs = Object.keys(branchMappings)
                    .filter(branchName => branchMappings[branchName].includes(subjectFolderName))
                    .map(branchName => createdBranches[branchName]);

                // Extract course code from folder name
                const codeMatch = subjectFolderName.match(/\(([^)]+)\)/);
                const courseCode = codeMatch ? codeMatch[1] : subjectFolderName;

                const isGlobal = globalSubjects.includes(subjectFolderName);

                // Create the subject document
                const subject = await Subject.create({
                    name: subjectFolderName.replace(/\s*\([^)]+\)\s*$/, '').trim(), // Remove course code for cleaner name
                    courseCode: courseCode,
                    branches: parentBranchIDs,
                    isGlobal: isGlobal
                });

                // Prepare file documents for this subject
                const filesToInsert = fileData[subjectFolderName].map(fileInfo => {
                    const fileExtension = path.extname(fileInfo.fileName).substring(1).toUpperCase();
                    return {
                        fileName: fileInfo.fileName,
                        driveFileId: fileInfo.driveFileId,
                        fileUrl: `https://drive.google.com/uc?export=download&id=${fileInfo.driveFileId}`,
                        // ADD THIS LINE
                        relativePath: fileInfo.relativePath,
                        // ---
                        fileType: fileExtension || 'UNKNOWN',
                        fileSize: fileInfo.size,
                        uploadDate: new Date(fileInfo.modifiedDate),
                        subject: subject._id
                    };
                });

                // Insert all files for this subject in one go
                if (filesToInsert.length > 0) {
                    await File.insertMany(filesToInsert);
                }
                console.log(` -> Processed subject: ${subjectFolderName}`);
            }
        }

        console.log('\n✅ Data Import Success!');
        process.exit();

    } catch (error) {
        console.error(`❌ Error importing data: ${error}`);
        process.exit(1);
    }
};

importData();