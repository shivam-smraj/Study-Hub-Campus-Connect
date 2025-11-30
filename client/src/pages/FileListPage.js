// client/src/pages/FileListPage.js
import React from 'react';
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

  const { data: groupedFiles, isLoading: loading, error } = useQuery({
    queryKey: ['files', subjectSlug],
    queryFn: async () => {
      const { data } = await fetchFilesBySubject(subjectSlug);
      // Grouping logic
      return data.reduce((acc, file) => {
        const pathParts = file.relativePath.split('/');
        const subfolderPath = pathParts.slice(1, -1).join('/') || 'Root';
        if (!acc[subfolderPath]) {
          acc[subfolderPath] = [];
        }
        acc[subfolderPath].push(file);
        return acc;
      }, {});
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

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