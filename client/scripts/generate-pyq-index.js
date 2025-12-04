const fs = require('fs');
const path = require('path');
const slugify = require('slugify');

const questionPapersDir = path.join(__dirname, '../public/question-papers');
const outputFile = path.join(__dirname, '../public/pyq-data.json');

const pyqData = {};

if (fs.existsSync(questionPapersDir)) {
    const subjects = fs.readdirSync(questionPapersDir);

    subjects.forEach(subjectFolder => {
        const subjectPath = path.join(questionPapersDir, subjectFolder);
        if (fs.statSync(subjectPath).isDirectory()) {
            // Parse folder name "Name (Code)"
            const match = subjectFolder.match(/(.*)\s\((.*)\)$/);
            let slug;
            if (match) {
                const name = match[1];
                const code = match[2];
                slug = slugify(`${name}-${code}`, { lower: true, strict: true });
            } else {
                // Fallback if format doesn't match
                slug = slugify(subjectFolder, { lower: true, strict: true });
            }

            const files = fs.readdirSync(subjectPath);
            const fileList = files.filter(f => f.endsWith('.pdf')).map(file => {
                const filePath = path.join(subjectPath, file);
                const stats = fs.statSync(filePath);
                
                // Parse filename for metadata if possible
                // Format: [year]_[mid/end sem]_[subject_name].pdf
                // e.g. 2021_Mid_Sem_Basic_Electrical_Engineering.pdf
                const nameParts = file.replace('.pdf', '').split('_');
                let year = '';
                let type = '';
                
                if (nameParts.length >= 3) {
                    year = nameParts[0];
                    if (nameParts[1] === 'Mid' && nameParts[2] === 'Sem') {
                        type = 'Mid Sem';
                    } else if (nameParts[1] === 'End' && nameParts[2] === 'Sem') {
                        type = 'End Sem';
                    }
                }

                return {
                    _id: `static-${slug}-${file}`,
                    fileName: file,
                    fileUrl: `/question-papers/${subjectFolder}/${file}`,
                    fileType: 'PDF',
                    fileSize: (stats.size / 1024 / 1024).toFixed(2) + ' MB',
                    likes: 0,
                    isStatic: true,
                    subjectName: subjectFolder,
                    year,
                    type,
                    relativePath: `/Question Papers/${type || 'General'}/${file}` // Mimic API structure for grouping
                };
            });

            if (fileList.length > 0) {
                pyqData[slug] = fileList;
            }
        }
    });
}

fs.writeFileSync(outputFile, JSON.stringify(pyqData, null, 2));
console.log(`Generated PYQ data for ${Object.keys(pyqData).length} subjects.`);
