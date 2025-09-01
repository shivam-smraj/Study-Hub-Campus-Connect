// client/src/pages/GlobalSubjectPage.js
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { fetchGlobalSubjects, fetchFilesBySubject } from '../api';
import Accordion from '../components/Accordion';
import Spinner from '../components/Spinner';
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
  const pageType = location.pathname.substring(1); // "syllabus" or "question-papers"
  
  const [groupedFiles, setGroupedFiles] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // A more readable title for the page header
  const pageTitle = pageType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());

  useEffect(() => {
    const getGlobalFiles = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Fetch all global subjects
        const { data: globalSubjects } = await fetchGlobalSubjects();

        // 2. Find the specific subject we want (e.g., the one with "SYLLABUS" in the name)
        // This makes it flexible even if folder names are slightly different
        const targetSubject = globalSubjects.find(s => 
          s.name.toUpperCase().includes(pageTitle.split(' ')[0].toUpperCase())
        );

        if (!targetSubject) {
          throw new Error(`${pageTitle} not found.`);
        }

        // 3. Fetch the files for that subject
        const { data: files } = await fetchFilesBySubject(targetSubject._id);
        
        // 4. Group the files and set the state
        const groups = groupFiles(files);
        setGroupedFiles(groups);

      } catch (err) {
        console.error(`Failed to fetch ${pageType}:`, err);
        setError(`Failed to load ${pageType}. Please try again.`);
      } finally {
        setLoading(false);
      }
    };

    getGlobalFiles();
  }, [pageType, pageTitle]); // Re-run if the URL changes

  return (
    <div className="file-list-page">
      <div className="breadcrumb">
        <Link to="/">Home</Link> / <span>{pageTitle}</span>
      </div>
      
      <h1>{pageTitle}</h1>
        {loading && <Spinner />}
      {/* {loading && <p>Loading...</p>} */}
      {error && <p className="error-message">{error}</p>}

      {!loading && !error && Object.keys(groupedFiles).length > 0 ? (
        Object.entries(groupedFiles).map(([groupName, files]) => (
          <Accordion key={groupName} title={groupName} files={files} />
        ))
      ) : (
        !loading && <p>No content found for {pageTitle}.</p>
      )}
    </div>
  );
};

export default GlobalSubjectPage;