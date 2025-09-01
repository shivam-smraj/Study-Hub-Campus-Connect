// client/src/pages/HomePage.js
import React, { useState, useEffect } from 'react';
import { fetchBranches } from '../api';
import BranchCard from '../components/BranchCard';
import Spinner from '../components/Spinner';
import './HomePage.css';
import FadeIn from '../components/FadeIn';
const HomePage = () => {
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  useEffect(() => {
    const getBranches = async () => {
      try {
        setLoading(true);
        const { data } = await fetchBranches();
        setBranches(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch branches:", err);
        setError("Failed to load data. Please try refreshing the page.");
      } finally {
        setLoading(false);
      }
    };

    getBranches();
  }, []); // The empty array [] means this effect runs only once when the component mounts

  const scrollToBranches = () => {
        document.getElementById('branch-selector').scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="home-page">
            {/* --- NEW HERO SECTION --- */}
            {/* <section className="hero-section"> */}
                <div className="hero-content">
                    <h1>Your First Year, Simplified.</h1>
                    <p className="subtitle">All notes, lab manuals, and question papers for every branch, all in one place.</p>
                    <button onClick={scrollToBranches} className="cta-button">Find Your Branch</button>
                </div>
            {/* </section> */}

            {/* --- NEW FEATURES SECTION --- */}
            <section className="features-section">
                <FadeIn delay={0.1}>
                  <div className="feature-card">
                      <h3>📚 All Subjects</h3>
                      <p>Comprehensive materials for every first-year subject, from Physics to Programming.</p>
                  </div>
                </FadeIn>
                <FadeIn delay={0.2}>
                  <div className="feature-card">
                    <h3>✅ Verified & Curated</h3>
                    <p>Reliable notes and resources, curated to match the latest curriculum.</p>
                  </div>
                </FadeIn>
                <FadeIn delay={0.1}>
                  <div className="feature-card">
                    <h3>❓ PYQs Included</h3>
                    <p>Practice with previous year question papers to ace your exams.</p>
                  </div>
                </FadeIn>
                
                
                
            </section>

            {/* --- EXISTING BRANCH SELECTOR (now with an ID) --- */}
            <section id="branch-selector" className="branch-section">
                <h2>Select Your Branch to Get Started</h2>
                {loading && <Spinner />}
                {error && <p className="error-message">{error}</p>}
                
                {!loading && !error && (
                    <div className="branch-grid">
                        {branches.map((branch) => (
                            <BranchCard key={branch._id} branch={branch} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default HomePage;