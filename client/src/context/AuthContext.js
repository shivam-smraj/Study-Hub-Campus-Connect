// client/src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { fetchBookmarks, addBookmark as apiAddBookmark, removeBookmark as apiRemoveBookmark, fetchCollections, createCollection, addFileToCollection  } from '../api';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // --- NEW STATE FOR BOOKMARKS ---
  const [bookmarkedFileIds, setBookmarkedFileIds] = useState(new Set());
  const [collections, setCollections] = useState([]);
  // Fetch both user and their bookmarks on initial load
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        // Check if we have an auth=success in the URL (from redirect after successful login)
        const urlParams = new URLSearchParams(window.location.search);
        const authSuccess = urlParams.get('auth');
        
        if (authSuccess === 'success') {
          // Remove the query parameter from URL without page reload
          window.history.replaceState({}, document.title, window.location.pathname);
        }
        
        // Use the API object with the correct baseURL configuration
        const { data: user } = await axios.get(`${process.env.REACT_APP_API_URL || 'https://study-hub-server-final.vercel.app/api'}/auth/current_user`, {
          withCredentials: true
        });
        
        setCurrentUser(user);
        if (user) {
          const { data: bookmarks } = await fetchBookmarks();
          setBookmarkedFileIds(new Set(bookmarks.map(file => file._id)));
          const { data: userCollections } = await fetchCollections(); // <-- FETCH COLLECTIONS
          setCollections(userCollections); // <-- SET COLLECTIONS
        }
      } catch (error) {
        console.log("Not logged in", error);
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkLoggedIn();
  }, []);


  const createAndAddFileToCollection = async (collectionName, fileId) => {
      const { data: newCollection } = await createCollection(collectionName);
      await addFileToCollection(newCollection._id, fileId);
      // Refresh the collections list
      const { data: updatedCollections } = await fetchCollections();
      setCollections(updatedCollections);
  };
  
  const addFileToExistingCollection = async (collectionId, fileId) => {
      await addFileToCollection(collectionId, fileId);
      // Refresh the collections list
      const { data: updatedCollections } = await fetchCollections();
      setCollections(updatedCollections);
  };

  const isFileInAnyCollection = (fileId) => {
    // Check if any collection includes the fileId
    return collections.some(collection => collection.files.includes(fileId));
  };
  // --- NEW FUNCTIONS TO MANAGE BOOKMARKS ---
  const addBookmark = async (fileId) => {
    try {
      setBookmarkedFileIds(prev => new Set(prev).add(fileId)); // Optimistic UI update
      await apiAddBookmark(fileId);
    } catch (error) {
      console.error("Failed to add bookmark", error);
      setBookmarkedFileIds(prev => { // Revert on error
        const newSet = new Set(prev);
        newSet.delete(fileId);
        return newSet;
      });
    }
  };

  const removeBookmark = async (fileId) => {
    try {
      setBookmarkedFileIds(prev => { // Optimistic UI update
        const newSet = new Set(prev);
        newSet.delete(fileId);
        return newSet;
      });
      await apiRemoveBookmark(fileId);
    } catch (error) {
      console.error("Failed to remove bookmark", error);
      setBookmarkedFileIds(prev => new Set(prev).add(fileId)); // Revert on error
    }
  };

  const isBookmarked = (fileId) => {
    return bookmarkedFileIds.has(fileId);
  };

  const value = {
    currentUser,
    loading,
    // --- EXPOSE BOOKMARK FUNCTIONS & STATE ---
    isBookmarked,
    addBookmark,
    removeBookmark,
    collections,
    isFileInAnyCollection,
    createAndAddFileToCollection,
    addFileToExistingCollection
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};