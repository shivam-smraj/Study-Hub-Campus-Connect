// client/src/pages/GlobalSubjectPage.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { fetchGlobalSubjects, fetchFilesBySubject } from '../api';
import Accordion from '../components/Accordion';
import Spinner from '../components/Spinner';
import { useQuery } from '@tanstack/react-query';

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
  
  // A more readable title for the page header
  const pageTitle = pageType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());

  const { data: groupedFiles, isLoading: loading, error } = useQuery({
    queryKey: ['globalFiles', pageType],
    queryFn: async () => {
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