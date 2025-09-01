// client/src/pages/SubjectPage.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'; // useParams reads URL parameters
import { fetchSubjectsByBranch } from '../api';
import SubjectCard from '../components/SubjectCard';
import './SubjectPage.css';
import Spinner from '../components/Spinner';
const SubjectPage = () => {
  const { branchId } = useParams(); // Get the branchId from the URL
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getSubjects = async () => {
      try {
        setLoading(true);
        const { data } = await fetchSubjectsByBranch(branchId);
        setSubjects(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch subjects:", err);
        setError("Failed to load subjects. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    getSubjects();
  }, [branchId]); // This effect re-runs if the branchId in the URL changes

  return (
    <div className="subject-page">
      <div className="breadcrumb">
        <Link to="/">Home</Link> / <span>Subjects</span>
      </div>
      {loading && <Spinner />}
      {/* {loading && <p>Loading subjects...</p>} */}
      {error && <p className="error-message">{error}</p>}
      
      {!loading && !error && (
        <div className="subject-grid">
          {subjects.map((subject) => (
            <SubjectCard key={subject._id} subject={subject} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SubjectPage;