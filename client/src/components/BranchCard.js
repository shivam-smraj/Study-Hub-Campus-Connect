// client/src/components/BranchCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import './BranchCard.css';

const BranchCard = ({ branch }) => {
  return (
    <Link to={`/branch/${branch.slug}`} className="branch-card">
      <h3>{branch.name}</h3>
      <p>({branch.shortName})</p>
    </Link>
  );
};

export default BranchCard;