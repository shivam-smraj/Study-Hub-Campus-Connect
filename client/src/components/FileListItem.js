// client/src/components/FileListItem.js
import React, { useState, useEffect } from 'react';
import { likeFile, unlikeFile } from '../api';
import { useAuth } from '../context/AuthContext';
import './FileListItem.css';
import AddToCollection from './AddToCollection';
import toast from 'react-hot-toast';
import { 
  PdfIcon, WordIcon, PptIcon, FileIcon, 
  DownloadIcon, EyeIcon, HeartIcon, StarIcon 
} from './Icons';

const getFileIcon = (fileType) => {
  const type = fileType.toUpperCase();
  const className = "file-type-icon";
  
  if (type.includes('PDF')) return <PdfIcon className={`${className} pdf`} />;
  if (type.includes('PPT')) return <PptIcon className={`${className} ppt`} />;
  if (type.includes('DOC')) return <WordIcon className={`${className} doc`} />;
  return <FileIcon className={`${className} generic`} />;
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
    if (file.isStatic) return; // Disable likes for static files

    const likedFiles = JSON.parse(localStorage.getItem('likedFiles')) || [];

    if (isLiked) {
      try {
        setIsLiked(false);
        setLikes(prevLikes => Math.max(0, prevLikes - 1));
        const newLikedFiles = likedFiles.filter(id => id !== file._id);
        localStorage.setItem('likedFiles', JSON.stringify(newLikedFiles));
        await unlikeFile(file._id);
      } catch (error) {
        console.error("Failed to unlike file:", error);
        setIsLiked(true);
        setLikes(prevLikes => prevLikes + 1);
        toast.error("Could not unlike the file.");
      }
    } else {
      try {
        setIsLiked(true);
        setLikes(prevLikes => prevLikes + 1);
        if (!likedFiles.includes(file._id)) {
            localStorage.setItem('likedFiles', JSON.stringify([...likedFiles, file._id]));
        }
        await likeFile(file._id);
      } catch (error) {
        console.error("Failed to like file:", error);
        setIsLiked(false);
        setLikes(prevLikes => prevLikes - 1);
        toast.error("Could not like the file.");
      }
    }
  };

  const handleBookmark = () => {
    if (file.isStatic) return; // Disable bookmarks for static files
    if (isBookmarked(file._id)) {
      removeBookmark(file._id);
    } else {
      addBookmark(file._id);
    }
  };

  const viewerUrl = file.isStatic ? file.fileUrl : `https://drive.google.com/file/d/${file.driveFileId}/view?usp=sharing`;
  const isViewable = ['PDF', 'PPTX', 'DOCX'].includes(file.fileType.toUpperCase());

  return (
    <div className="file-list-item">
      <a href={viewerUrl} target="_blank" rel="noopener noreferrer" className="file-main-link">
        <div className="file-main">
          <div className="file-icon-wrapper">
            {getFileIcon(file.fileType)}
          </div>
          <div className="file-details">
            <span className="file-name" title={file.fileName}>{file.fileName}</span>
          </div>
        </div>
      </a>

      <div className="file-actions">
        <span className="file-size-desktop">{file.fileSize}</span>
        
        {!file.isStatic && (
          <button 
            onClick={handleLike} 
            className={`action-btn like-btn ${isLiked ? 'active' : ''}`}
            title={isLiked ? "Unlike" : "Like"}
          >
            <HeartIcon className="icon" filled={isLiked} />
            <span className="count">{likes}</span>
          </button>
        )}

        {currentUser && !file.isStatic && (
            <>
                <div className="collection-wrapper">
                  <AddToCollection fileId={file._id} minimal={true} />
                </div>
                <button 
                    onClick={handleBookmark} 
                    className={`action-btn bookmark-btn ${isBookmarked(file._id) ? 'active' : ''}`}
                    title={isBookmarked(file._id) ? 'Remove Bookmark' : 'Add Bookmark'}
                >
                    <StarIcon className="icon" filled={isBookmarked(file._id)} />
                </button>
            </>
        )}

        {isViewable && !file.isStatic && (
          <a href={viewerUrl} target="_blank" rel="noopener noreferrer" className="action-btn view-btn" title="View File">
            <EyeIcon className="icon" />
          </a>
        )}

        <a href={file.fileUrl} target="_blank" rel="noopener noreferrer" className="action-btn download-btn" title="Download">
          <DownloadIcon className="icon" />
        </a>
      </div>
    </div>
  );
};

export default FileListItem;