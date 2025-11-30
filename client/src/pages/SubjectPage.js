// client/src/pages/SubjectPage.js
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchSubjectsByBranch, fetchBranchDetails } from '../api';
import SubjectCard from '../components/SubjectCard';
import './SubjectPage.css';
import Spinner from '../components/Spinner';
import { useQuery } from '@tanstack/react-query';

const SubjectPage = () => {
  const { branchSlug } = useParams();

  // Fetch branch details to get the name
  const { data: branch } = useQuery({
      queryKey: ['branch', branchSlug],
      queryFn: () => fetchBranchDetails(branchSlug).then(res => res.data),
      staleTime: 1000 * 60 * 60,
  });

  const { data: subjects, isLoading: loading, error } = useQuery({
    queryKey: ['subjects', branchSlug],
    queryFn: () => fetchSubjectsByBranch(branchSlug).then(res => res.data),
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  return (
    <div className="subject-page">
      <div className="breadcrumb">
        <Link to="/">Home</Link> / <span>{branch ? branch.name : 'Subjects'}</span>
      </div>
      <h1>{branch ? branch.name : 'Loading...'}</h1>
      {loading && <Spinner />}
      {error && (
          <div className="error-message">
              <p>Failed to load subjects.</p>
              <p className="error-details">{error.message || 'Unknown error'}</p>
          </div>
      )}
      
      {!loading && !error && (
        <div className="subject-grid">
          {subjects?.map((subject) => (
            <SubjectCard key={subject._id} subject={subject} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SubjectPage;