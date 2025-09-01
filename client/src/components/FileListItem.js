// client/src/components/FileListItem.js
import React, { useState, useEffect } from 'react';
import { likeFile } from '../api';
import { useAuth } from '../context/AuthContext';
import './FileListItem.css';
import AddToCollection from './AddToCollection';
const getFileIcon = (fileType) => {
  switch (fileType.toUpperCase()) {
    case 'PDF': return '📄';
    case 'PPT':
    case 'PPTX': return '📊';
    case 'DOC':
    case 'DOCX': return '📝';
    default: return '📁';
  }
};

const FileListItem = ({ file }) => {
  const [likes, setLikes] = useState(file.likes);
  const [isLiked, setIsLiked] = useState(false);
  const { currentUser, isBookmarked, addBookmark, removeBookmark } = useAuth();
  useEffect(() => {
    const likedFiles = JSON.parse(localStorage.getItem('likedFiles')) || [];
    if (likedFiles.includes(file._id)) {
      setIsLiked(true);
    }
  }, [file._id]);

  
  const handleLike = async () => {
    if (isLiked) return;
    try {
      setIsLiked(true);
      setLikes(prevLikes => prevLikes + 1);
      const likedFiles = JSON.parse(localStorage.getItem('likedFiles')) || [];
      localStorage.setItem('likedFiles', JSON.stringify([...likedFiles, file._id]));
      await likeFile(file._id);
    } catch (error) {
      console.error("Failed to like file:", error);
      setIsLiked(false);
      setLikes(prevLikes => prevLikes - 1);
      const likedFiles = JSON.parse(localStorage.getItem('likedFiles')) || [];
      localStorage.setItem('likedFiles', JSON.stringify(likedFiles.filter(id => id !== file._id)));
      alert("Could not like the file. Please try again.");
    }
  };

  const handleBookmark = () => {
    if (isBookmarked(file._id)) {
      removeBookmark(file._id);
    } else {
      addBookmark(file._id);
    }
  };

  // --- THE MAIN CHANGE IS HERE ---
  // Construct the Google Docs Viewer URL
  // const viewerUrl = `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(file.fileUrl)}`;
  const viewerUrl = `https://drive.google.com/file/d/${file.driveFileId}/view?usp=sharing`;

  return (
    <div className="file-list-item">
      <div className="file-info">
        <span className="file-icon">{getFileIcon(file.fileType)}</span>
        <span className="file-name">{file.fileName}</span>
      </div>
      <div className="file-meta">
        <div className="like-container">
          <button onClick={handleLike} className={`btn-like ${isLiked ? 'liked' : ''}`} disabled={isLiked}>
            ❤️
          </button>
          <span className="like-count">{likes}</span>
        </div>
        <span className="file-size">{file.fileSize}</span>
        

        {currentUser && (
            <>
                <AddToCollection fileId={file._id} />
                <button 
                    onClick={handleBookmark} 
                    className={`btn-bookmark ${isBookmarked(file._id) ? 'bookmarked' : ''}`}
                    title={isBookmarked(file._id) ? 'Remove Bookmark' : 'Add Bookmark'}
                >
                    {isBookmarked(file._id) ? '★' : '☆'}
                </button>
            </>
        )}

        
        {/* The View button is now a simple link that opens in a new tab */}
        {/* We only show it for file types that Google Viewer supports well (like PDF) */}
        {(file.fileType.toUpperCase() === 'PDF' || file.fileType.toUpperCase() === 'PPTX' || file.fileType.toUpperCase() === 'DOCX') && (
          <a href={viewerUrl} target="_blank" rel="noopener noreferrer" className="btn-view">
            View
          </a>
        )}

        <a href={file.fileUrl} target="_blank" rel="noopener noreferrer" className="btn-download">
          Download
        </a>
      </div>
    </div>
  );
};

export default FileListItem;