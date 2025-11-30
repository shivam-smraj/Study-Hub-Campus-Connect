import React, { useState, useEffect } from 'react';
import syllabusData from '../data/syllabus.json';
import './SyllabusViewer.css';

const Icons = {
  Search: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="syllabus-search-icon">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  ),
  Book: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
    </svg>
  ),
  ArrowLeft: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12"></line>
      <polyline points="12 19 5 12 12 5"></polyline>
    </svg>
  ),
  ChevronDown: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  ),
  ChevronUp: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="18 15 12 9 6 15"></polyline>
    </svg>
  ),
  ChevronRight: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
  )
};

const SyllabusViewer = () => {
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [isMobileListVisible, setIsMobileListVisible] = useState(true);
  const [expandedModules, setExpandedModules] = useState({});

  // Get unique branches
  const branches = [...new Set(syllabusData.flatMap(s => s.branches))].sort();

  // Initialize selected branch
  useEffect(() => {
    if (!selectedBranch && branches.length > 0) {
      setSelectedBranch(branches[0]);
    }
  }, [branches, selectedBranch]);

  // Filter subjects based on selected branch
  const filteredSubjects = syllabusData.filter(subject => 
    subject.branches.includes(selectedBranch)
  );

  // Select first subject by default on desktop when branch changes
  useEffect(() => {
    if (filteredSubjects.length > 0 && window.innerWidth > 768) {
      setSelectedSubject(filteredSubjects[0]);
      setExpandedModules({}); // Reset expanded state
    } else if (filteredSubjects.length === 0) {
      setSelectedSubject(null);
    }
  }, [selectedBranch]); // Run when selectedBranch changes

  const handleSubjectClick = (subject) => {
    setSelectedSubject(subject);
    setIsMobileListVisible(false);
    setExpandedModules({}); // Reset expanded state for new subject
    window.scrollTo(0, 0);
  };

  const toggleModule = (moduleNo) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleNo]: !prev[moduleNo]
    }));
  };

  const handleBackToMobileList = () => {
    setIsMobileListVisible(true);
  };

  return (
    <div className="syllabus-viewer-container">
      {/* Sidebar List */}
      <div className={`syllabus-sidebar ${!isMobileListVisible ? 'hidden' : ''}`}>
        <div className="syllabus-sidebar-header">
          <div style={{ position: 'relative' }}>
            <select
              className="syllabus-search-input"
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              style={{ appearance: 'none', cursor: 'pointer' }}
            >
              {branches.map(branch => (
                <option key={branch} value={branch}>{branch}</option>
              ))}
            </select>
            <div style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#94a3b8' }}>
              <Icons.ChevronDown />
            </div>
          </div>
        </div>
        <div className="syllabus-list">
          {filteredSubjects.map((subject) => (
            <div
              key={subject.subjectCode}
              className={`syllabus-list-item ${selectedSubject?.subjectCode === subject.subjectCode ? 'active' : ''}`}
              onClick={() => handleSubjectClick(subject)}
            >
              <span className="syllabus-subject-code">{subject.subjectCode}</span>
              <span className="syllabus-subject-name">{subject.subjectName}</span>
            </div>
          ))}
          {filteredSubjects.length === 0 && (
            <div style={{ padding: '1rem', color: '#94a3b8', textAlign: 'center' }}>
              No subjects found for this branch
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="syllabus-content">
        {selectedSubject ? (
          <>
            <div className="mobile-back-btn" onClick={handleBackToMobileList}>
              <Icons.ArrowLeft /> Back to List
            </div>

            <div className="syllabus-header">
              <h1 className="syllabus-title">{selectedSubject.subjectName}</h1>
              <div className="syllabus-meta">
                <span className="syllabus-badge">Code: {selectedSubject.subjectCode}</span>
                {selectedSubject.credits && (
                  <span className="syllabus-badge">
                    Credits: {selectedSubject.credits.total || 'N/A'} 
                    (L:{selectedSubject.credits.L} T:{selectedSubject.credits.T} P:{selectedSubject.credits.P})
                  </span>
                )}
                <span className="syllabus-badge" title={selectedSubject.branches.join(', ')}>
                  Branches: {selectedSubject.branches.length > 4 
                    ? `${selectedSubject.branches.slice(0, 3).join(', ')} + ${selectedSubject.branches.length - 3} others`
                    : selectedSubject.branches.join(', ')}
                </span>
              </div>
            </div>

            <div className="syllabus-modules">
              {selectedSubject.syllabus.map((module) => (
                <div key={module.moduleNo} className="syllabus-module-card">
                  <div 
                    className="syllabus-module-header"
                    onClick={() => toggleModule(module.moduleNo)}
                  >
                    <span className="syllabus-module-title">
                      {module.title && module.title !== `Module ${module.moduleNo}` 
                        ? `Module ${module.moduleNo}: ${module.title}` 
                        : `Module ${module.moduleNo}`}
                    </span>
                    {expandedModules[module.moduleNo] ? <Icons.ChevronUp /> : <Icons.ChevronDown />}
                  </div>
                  <div className="syllabus-module-body" style={{ display: expandedModules[module.moduleNo] ? 'block' : 'none' }}>
                    <ul className="syllabus-topics-list">
                      {module.topics.map((topic, idx) => (
                        <li key={idx} className="syllabus-topic-item">
                          <span className="syllabus-topic-icon"><Icons.ChevronRight /></span>
                          <span>{topic}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            {selectedSubject.textbooks && selectedSubject.textbooks.length > 0 && (
              <div className="syllabus-textbooks">
                <h3><Icons.Book /> Textbooks & References</h3>
                <ul>
                  {selectedSubject.textbooks.map((book, idx) => (
                    <li key={idx}>{book}</li>
                  ))}
                </ul>
              </div>
            )}
          </>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8' }}>
            Select a subject to view details
          </div>
        )}
      </div>
    </div>
  );
};

export default SyllabusViewer;
