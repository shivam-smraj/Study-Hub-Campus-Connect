// client/src/components/Accordion.js
import React, { useState } from 'react';
import FileListItem from './FileListItem';
import './Accordion.css';
import { ChevronDownIcon, ChevronRightIcon } from './Icons';

const Accordion = ({ title, files }) => {
  const [isOpen, setIsOpen] = useState(true); // Default to open

  return (
    <div className="accordion-item">
      <button className="accordion-title" onClick={() => setIsOpen(!isOpen)}>
        <span className="accordion-icon">
            {isOpen ? <ChevronDownIcon className="icon" /> : <ChevronRightIcon className="icon" />}
        </span> 
        <span className="accordion-text">{title}</span>
        <span className="accordion-count">{files.length} files</span>
      </button>
      {isOpen && (
        <div className="accordion-content">
          {files.map(file => <FileListItem key={file._id} file={file} />)}
        </div>
      )}
    </div>
  );
};

export default Accordion;