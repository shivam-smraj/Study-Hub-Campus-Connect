// client/src/pages/FileListPage.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchFilesBySubject } from '../api';
import Accordion from '../components/Accordion';

const FileListPage = () => {
  const { subjectId } = useParams();
  const [groupedFiles, setGroupedFiles] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getFiles = async () => {
      try {
        setLoading(true);
        const { data } = await fetchFilesBySubject(subjectId);

        // This is the grouping logic
        const groups = data.reduce((acc, file) => {
          // Extracts the subfolder path, e.g., "Notes" or "Notes/Unit 1"
          const pathParts = file.relativePath.split('/');
          // We take the top-level folder name (the subject) out of the path
          const subfolderPath = pathParts.slice(1, -1).join('/') || 'Root';
          
          if (!acc[subfolderPath]) {
            acc[subfolderPath] = [];
          }
          acc[subfolderPath].push(file);
          return acc;
        }, {});

        setGroupedFiles(groups);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch files:", err);
        setError("Failed to load files. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    getFiles();
  }, [subjectId]);

  return (
    <div className="file-list-page">
       <div className="breadcrumb">
        <Link to="/">Home</Link> / <span>Files</span>
      </div>
      
      {loading && <p>Loading files...</p>}
      {error && <p className="error-message">{error}</p>}

      {!loading && !error && Object.keys(groupedFiles).length > 0 ? (
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