// client/src/components/Footer.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="app-footer">
            <div className="container footer-content">
                <div className="footer-section about">
                    <h3 className="logo-text">Study Hub</h3>
                    <p>
                        A centralized platform for first-year students to access study materials, notes, and question papers.
                    </p>
                </div>
                <div className="footer-section links">
                    <h3>Quick Links</h3>
                    <ul>
                        <li><Link to="/about">About Us</Link></li>
                        <li><Link to="/syllabus">Syllabus</Link></li>
                        <li><Link to="/question-papers">Question Papers</Link></li>
                        {/* Add more links here later, like an 'About' page */}
                    </ul>
                </div>
                <div className="footer-section contact">
                    <h3>Contact Us</h3>
                    <span>
                        Have a suggestion or found an issue? <br />
                        <a href="mailto:shivam.smraj@gmail.com">Let us know!</a>
                    </span>
                </div>
            </div>
            <div className="footer-bottom">
                &copy; {currentYear} IIEST Campus Connect | Made with 💚 by S_M_Raj.
            </div>
        </footer>
    );
};

export default Footer;