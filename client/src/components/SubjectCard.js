// client/src/components/SubjectCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { fetchFilesBySubject, fetchSubjectDetails } from '../api';
import './SubjectCard.css';

const SubjectCard = ({ subject }) => {
  const queryClient = useQueryClient();

  const handleMouseEnter = () => {
    // Prefetch subject details
    queryClient.prefetchQuery({
      queryKey: ['subject', subject.slug],
      queryFn: () => fetchSubjectDetails(subject.slug).then(res => res.data),
      staleTime: 1000 * 60 * 60,
    });

    // Prefetch API files
    queryClient.prefetchQuery({
      queryKey: ['apiFiles', subject.slug],
      queryFn: () => fetchFilesBySubject(subject.slug).then(res => res.data),
      staleTime: 1000 * 60 * 5,
    });

    // Prefetch Static files (Global)
    queryClient.prefetchQuery({
      queryKey: ['staticFiles'],
      queryFn: () => fetch('/pyq-data.json').then(res => res.json()),
      staleTime: 1000 * 60 * 60,
    });
  };

  return (
    <Link 
      to={`/subject/${subject.slug}`} 
      className="subject-card"
      onMouseEnter={handleMouseEnter}
    >
      <h3>{subject.name}</h3>
      <p>{subject.courseCode}</p>
    </Link>
  );
};

export default SubjectCard;