// client/src/components/BranchCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { fetchSubjectsByBranch, fetchBranchDetails } from '../api';
import './BranchCard.css';

const BranchCard = ({ branch }) => {
  const queryClient = useQueryClient();

  const handleMouseEnter = () => {
    // Prefetch branch details
    queryClient.prefetchQuery({
      queryKey: ['branch', branch.slug],
      queryFn: () => fetchBranchDetails(branch.slug).then(res => res.data),
      staleTime: 1000 * 60 * 60,
    });

    // Prefetch subjects for this branch
    queryClient.prefetchQuery({
      queryKey: ['subjects', branch.slug],
      queryFn: () => fetchSubjectsByBranch(branch.slug).then(res => res.data),
      staleTime: 1000 * 60 * 5,
    });
  };

  return (
    <Link 
      to={`/branch/${branch.slug}`} 
      className="branch-card"
      onMouseEnter={handleMouseEnter}
    >
      <h3>{branch.name}</h3>
      <p>({branch.shortName})</p>
    </Link>
  );
};

export default BranchCard;