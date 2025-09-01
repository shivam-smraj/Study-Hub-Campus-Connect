// client/src/pages/BookmarksPage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchBookmarks } from '../api';
import FileListItem from '../components/FileListItem';
import Spinner from '../components/Spinner';

const BookmarksPage = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getBookmarks = async () => {
      try {
        setLoading(true);
        const { data } = await fetchBookmarks();
        setBookmarks(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch bookmarks:", err);
        setError("Could not load your bookmarks. Please try refreshing the page.");
      } finally {
        setLoading(false);
      }
    };
    getBookmarks();
  }, []);

  return (
    <div className="file-list-page">
      <div className="breadcrumb">
        <Link to="/">Home</Link> / <span>My Bookmarks</span>
      </div>
      <h1>My Bookmarks</h1>
      
      {loading && <Spinner />}
      {error && <p className="error-message">{error}</p>}

      {!loading && !error && (
        bookmarks.length > 0 ? (
          <div className="accordion-item" style={{ overflow: 'visible' }}> {/* Re-using styles */}
              <div className="accordion-content">
                  {bookmarks.map(file => <FileListItem key={file._id} file={file} />)}
              </div>
          </div>
        ) : (
          <p>You haven't bookmarked any files yet. Click the star icon (☆) on any file to save it here.</p>
        )
      )}
    </div>
  );
};

export default BookmarksPage;