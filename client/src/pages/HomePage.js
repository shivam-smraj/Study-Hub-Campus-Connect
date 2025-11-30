// client/src/pages/HomePage.js
import React, { useState } from 'react';
import { fetchBranches } from '../api';
import BranchCard from '../components/BranchCard';
import Spinner from '../components/Spinner';
import './HomePage.css';
import FadeIn from '../components/FadeIn';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const { data: branches, isLoading: loading, error } = useQuery({
        queryKey: ['branches'],
        queryFn: () => fetchBranches().then(res => res.data),
        staleTime: 1000 * 60 * 60, // Cache for 1 hour
    });

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

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
                    
                    <form onSubmit={handleSearch} className="hero-search-form">
                        <input 
                            type="text" 
                            className="hero-search-input" 
                            placeholder="Search for subjects, files, or topics..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button type="submit" className="hero-search-button">
                            Search
                        </button>
                    </form>

                    <button onClick={scrollToBranches} className="cta-button">Find Your Branch</button>
                </div>
            {/* </section> */}

            {/* --- NEW FEATURES SECTION --- */}
            <section className="features-section">
                <FadeIn delay={0.1} className="feature-wrapper">
                  <div className="feature-card">
                      <h3>📚 All Subjects</h3>
                      <p>Comprehensive materials for every first-year subject, from Physics to Programming.</p>
                  </div>
                </FadeIn>
                <FadeIn delay={0.2} className="feature-wrapper">
                  <div className="feature-card">
                    <h3>✅ Verified & Curated</h3>
                    <p>Reliable notes and resources, curated to match the latest curriculum.</p>
                  </div>
                </FadeIn>
                <FadeIn delay={0.1} className="feature-wrapper">
                  <div className="feature-card">
                    <h3>❓ PYQs Included</h3>
                    <p>Practice with previous year question papers to ace your exams.</p>
                  </div>
                </FadeIn>
                <FadeIn delay={0.2} className="feature-wrapper">
                  <div className="feature-card">
                    <h3>⭐ Smart Bookmarks</h3>
                    <p>Save important files for quick access anytime, anywhere.</p>
                  </div>
                  
                </FadeIn>
                <FadeIn delay={0.3} className="feature-wrapper">
                  <div className="feature-card">
                    <h3>📁 Custom Collections</h3>
                    <p>Organize notes into your own exam-prep folders.</p>
                  </div>
                </FadeIn>
                
                
                
            </section>

            {/* --- EXISTING BRANCH SELECTOR (now with an ID) --- */}
            <section id="branch-selector" className="branch-section">
                <h2>Select Your Branch to Get Started</h2>
                {loading && <Spinner />}
                {error && (
                    <div className="error-message">
                        <p>Failed to load branches.</p>
                        <p className="error-details">{error.message || 'Unknown error'}</p>
                        <button onClick={() => window.location.reload()} className="retry-button">Retry</button>
                    </div>
                )}
                
                {!loading && !error && (
                    <div className="branch-grid">
                        {branches?.map((branch) => (
                            <BranchCard key={branch._id} branch={branch} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default HomePage;