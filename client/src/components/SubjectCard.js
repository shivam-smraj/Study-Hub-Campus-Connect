// client/src/components/SubjectCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import './SubjectCard.css';

const SubjectCard = ({ subject }) => {
  return (
    // We link to the next page using the subject's unique _id
    <Link to={`/subject/${subject._id}`} className="subject-card">
      <h3>{subject.name}</h3>
      <p>{subject.courseCode}</p>
    </Link>
  );
};

export default SubjectCard;