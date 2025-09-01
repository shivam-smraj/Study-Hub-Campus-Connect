// client/src/components/FadeIn.js
import React from 'react';
import { useInView } from 'react-intersection-observer';
import './FadeIn.css';

const FadeIn = ({ children, delay = 0 }) => {
    const { ref, inView } = useInView({
        triggerOnce: true, // Animation happens only once
        threshold: 0.1,    // Trigger when 10% of the element is visible
    });

    return (
        <div
            ref={ref}
            className={`fade-in-section ${inView ? 'is-visible' : ''}`}
            style={{ transitionDelay: `${delay}s` }}
        >
            {children}
        </div>
    );
};

export default FadeIn;