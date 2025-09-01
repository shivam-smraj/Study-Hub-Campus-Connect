// client/src/pages/AboutPage.js
import React from 'react';
import './AboutPage.css'; // We'll create this for styling

const AboutPage = () => {
    return (
        <div className="about-page">
            <div className="about-header">
                <h1>About Study Hub</h1>
                <p>Your one-stop resource for first-year academic success.</p>
            </div>
            
            <div className="about-section">
                <h2>Our Mission</h2>
                <p>
                    Navigating the first year of engineering can be challenging. Our mission is to simplify this journey by providing a centralized, easy-to-use platform where students can find all their essential study materials. We aim to foster a collaborative learning environment and reduce the stress of searching for notes, lab manuals, and previous year question papers.
                </p>
            </div>

            <div className="about-section">
                <h2>Who Is This For?</h2>
                <p>
                    This platform is specifically designed for the first-year undergraduate students of [Your College/University Name]. All materials are curated to align with the current curriculum for all engineering branches.
                </p>
            </div>

            <div className="about-section">
                <h2>About the Creator</h2>
                <p>
                    My name is Shivam Kumar (S_M_Raj), and I'm a 2nd year Electrical Engineering student at IIEST Shibpur. I created this platform because I experienced firsthand the difficulty of finding organized and reliable study materials. I wanted to build something that would not only help my batchmates but also serve as a valuable resource for future batches of students.
                </p>
                <ul>
                    <li><strong>My Vision:</strong> To create a self-sustaining platform where students can not only consume content but also contribute, ensuring the resources stay up-to-date.</li>
                    <li><strong>Get in Touch:</strong> I'm always open to feedback and suggestions! Feel free to reach out to me via <a href="mailto:shivam.smraj@gmail.com">email</a> or connect with me on <a href="https://www.linkedin.com/in/smraj0198/" target="_blank" rel="noopener noreferrer">LinkedIn</a>.</li>
                </ul>
            </div>
        </div>
    );
};

export default AboutPage;