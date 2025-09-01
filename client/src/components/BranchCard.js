// client/src/components/BranchCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import './BranchCard.css';

const BranchCard = ({ branch }) => {
  // We use branch._id for the link, as it's the unique identifier our API needs
  return (
    <Link to={`/branch/${branch._id}`} className="branch-card">
      <h3>{branch.name}</h3>
      <p>({branch.shortName})</p>
    </Link>
  );
};

export default BranchCard;