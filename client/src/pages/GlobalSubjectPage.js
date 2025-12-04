// client/src/pages/GlobalSubjectPage.js
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { fetchGlobalSubjects, fetchFilesBySubject } from '../api';
import Accordion from '../components/Accordion';
import Spinner from '../components/Spinner';
import { useQuery } from '@tanstack/react-query';
import './GlobalSubjectPage.css';

// Helper function to process and group files (same as in FileListPage)
const groupFiles = (files) => {
  return files.reduce((acc, file) => {
    const pathParts = file.relativePath.split('/');
    const subfolderPath = pathParts.slice(1, -1).join('/') || 'Root';
    if (!acc[subfolderPath]) {
      acc[subfolderPath] = [];
    }
    acc[subfolderPath].push(file);
    return acc;
  }, {});
};


const GlobalSubjectPage = () => {
  // We use location to know if we are on '/syllabus' or '/question-papers'
  const location = useLocation();
  // Remove leading slash and any trailing slash
  const pageType = location.pathname.substring(1).replace(/\/$/, ''); // "syllabus" or "question-papers"
  
  // A more readable title for the page header
  const pageTitle = pageType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
  
  const [selectedSubject, setSelectedSubject] = useState(null);

  const { data: groupedFiles, isLoading: loading, error } = useQuery({
    queryKey: ['globalFiles', pageType],
    queryFn: async () => {
        if (pageType === 'question-papers') {
            // Fetch the static JSON file
            const response = await fetch('/pyq-data.json');
            if (!response.ok) {
                throw new Error('Failed to load question papers data');
            }
            const pyqData = await response.json();

            // Group all static files by Subject Name
            const allFiles = Object.values(pyqData).flat();
            return allFiles.reduce((acc, file) => {
                const groupName = file.subjectName || 'Unknown Subject';
                if (!acc[groupName]) {
                    acc[groupName] = [];
                }
                acc[groupName].push(file);
                return acc;
            }, {});
        }

        // 1. Fetch all global subjects
        const { data: globalSubjects } = await fetchGlobalSubjects();

        // 2. Find the specific subject we want (e.g., the one with "SYLLABUS" in the name)
        const targetSubject = globalSubjects.find(s => 
          s.name.toUpperCase().includes(pageTitle.split(' ')[0].toUpperCase())
        );

        if (!targetSubject) {
          throw new Error(`${pageTitle} not found.`);
        }

        // 3. Fetch the files for that subject
        const { data: files } = await fetchFilesBySubject(targetSubject.slug);
        
        // 4. Group the files
        return groupFiles(files);
    },
    staleTime: 1000 * 60 * 10, // Cache for 10 minutes
  });

  if (selectedSubject && groupedFiles) {
    const files = groupedFiles[selectedSubject];
    // Group files by type (Mid Sem / End Sem) for the detail view
    const filesByType = files.reduce((acc, file) => {
        // Use 'type' from static data, or derive from relativePath for API data if needed
        // For static files, we have a 'type' field.
        // For API files, we might need to parse relativePath or use a default.
        let type = file.type;
        if (!type && file.relativePath) {
             const parts = file.relativePath.split('/');
             if (parts.length > 2) type = parts[1]; // e.g. /Question Papers/Mid Sem/file.pdf
        }
        type = type || 'General';
        
        if (!acc[type]) acc[type] = [];
        acc[type].push(file);
        return acc;
    }, {});

    return (
        <div className="file-list-page">
            <div className="breadcrumb">
                <Link to="/">Home</Link> / 
                <span onClick={() => setSelectedSubject(null)} style={{cursor: 'pointer', color: 'var(--text-secondary)'}}> {pageTitle} </span> / 
                <span> {selectedSubject} </span>
            </div>
            
            <button className="back-btn" onClick={() => setSelectedSubject(null)}>
                &larr; Back to Subjects
            </button>

            <h1>{selectedSubject}</h1>
            
            {Object.entries(filesByType).map(([type, typeFiles]) => (
                <Accordion key={type} title={type} files={typeFiles} />
            ))}
        </div>
    );
  }

  return (
    <div className="file-list-page">
      <div className="breadcrumb">
        <Link to="/">Home</Link> / <span>{pageTitle}</span>
      </div>
      
      <h1>{pageTitle}</h1>
        {loading && <Spinner />}
      {/* {loading && <p>Loading...</p>} */}
      {error && <p className="error-message">Failed to load {pageTitle}. Please try again.</p>}

      {!loading && !error && groupedFiles && Object.keys(groupedFiles).length > 0 ? (
        <div className="subject-list-grid">
          {Object.keys(groupedFiles).map(subjectName => (
            <div key={subjectName} className="subject-card-item" onClick={() => setSelectedSubject(subjectName)}>
              <h3>{subjectName}</h3>
              <p>{groupedFiles[subjectName].length} files</p>
            </div>
          ))}
        </div>
      ) : (
        !loading && <p>No content found for {pageTitle}.</p>
      )}
    </div>
  );
};

export default GlobalSubjectPage;