// client/src/pages/FileListPage.js
import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchFilesBySubject, fetchSubjectDetails } from '../api';
import Accordion from '../components/Accordion';
import Spinner from '../components/Spinner';
import { useQuery } from '@tanstack/react-query';

const FileListPage = () => {
  const { subjectSlug } = useParams();

  // Fetch subject details to get the name
  const { data: subject } = useQuery({
      queryKey: ['subject', subjectSlug],
      queryFn: () => fetchSubjectDetails(subjectSlug).then(res => res.data),
      staleTime: 1000 * 60 * 60,
  });

  // Fetch API Files
  const { data: apiFiles = [], isLoading: loading, error } = useQuery({
    queryKey: ['apiFiles', subjectSlug],
    queryFn: () => fetchFilesBySubject(subjectSlug).then(res => res.data),
    staleTime: 1000 * 60 * 5,
  });

  // Fetch Static Files
  const { data: allStaticData = {} } = useQuery({
    queryKey: ['staticFiles'],
    queryFn: () => fetch('/pyq-data.json').then(res => res.json()),
    staleTime: 1000 * 60 * 60,
  });

  const groupedFiles = useMemo(() => {
    const staticFiles = allStaticData[subjectSlug] || [];
    const allFiles = [...apiFiles, ...staticFiles];

    return allFiles.reduce((acc, file) => {
      const pathParts = file.relativePath.split('/');
      const subfolderPath = pathParts.slice(1, -1).join('/') || 'Root';
      if (!acc[subfolderPath]) {
        acc[subfolderPath] = [];
      }
      acc[subfolderPath].push(file);
      return acc;
    }, {});
  }, [apiFiles, allStaticData, subjectSlug]);

  return (
    <div className="file-list-page">
       <div className="breadcrumb">
        <Link to="/">Home</Link> / <span>{subject ? subject.name : 'Files'}</span>
      </div>
      
      <h1>{subject ? `${subject.name} (${subject.courseCode})` : 'Files'}</h1>

      {loading && <Spinner />}
      {error && <p className="error-message">Failed to load files. Please try again.</p>}

      {!loading && !error && groupedFiles && Object.keys(groupedFiles).length > 0 ? (
        Object.entries(groupedFiles).map(([groupName, files]) => (
          <Accordion key={groupName} title={groupName} files={files} />
        ))
      ) : (
        !loading && <p>No files found for this subject.</p>
      )}
    </div>
  );
};

export default FileListPage;