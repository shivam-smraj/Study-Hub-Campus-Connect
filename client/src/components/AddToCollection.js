// client/src/components/AddToCollection.js
import React, { useState, useEffect, useRef } from 'react';
import { fetchCollections } from '../api'; // keep only used imports
import './AddToCollection.css';
import { useAuth } from '../context/AuthContext';

const AddToCollection = ({ fileId }) => {
  const {
    isFileInAnyCollection,
    createAndAddFileToCollection,
    addFileToExistingCollection
  } = useAuth();

  const [collections, setCollections] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [feedback, setFeedback] = useState('');
  const containerRef = useRef(null);
  const timeoutRef = useRef(null);

  // toggle dropdown
  const onToggle = () => setIsOpen(prev => !prev);

  // fetch collections when dropdown opens
  useEffect(() => {
    let mounted = true;
    const getCollections = async () => {
      try {
        const { data } = await fetchCollections();
        if (mounted) setCollections(data || []);
      } catch (error) {
        console.error('Could not fetch collections', error);
      }
    };
    if (isOpen) getCollections();
    return () => { mounted = false; };
  }, [isOpen]);

  // close when clicking outside
  useEffect(() => {
    if (!isOpen) return;
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);

  // cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const showFeedback = (message) => {
    setFeedback(message);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setFeedback('');
      setIsOpen(false); // close dropdown after feedback
    }, 1500);
  };

  const handleAddFile = async (collectionId, e) => {
    // stop propagation to prevent accidental outside handlers
    if (e && e.stopPropagation) e.stopPropagation();
    try {
      await addFileToExistingCollection(collectionId, fileId);
      showFeedback('Added!');
    } catch (error) {
      console.error('Could not add file to collection', error);
      showFeedback('Error!');
    }
  };

  const handleCreateAndAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!newCollectionName.trim()) return;
    try {
      await createAndAddFileToCollection(newCollectionName.trim(), fileId);
      showFeedback('Added!');
      setNewCollectionName('');
      // Optionally refetch collections so the new collection shows up
      try {
        const { data } = await fetchCollections();
        setCollections(data || []);
      } catch (_) { /* ignore */ }
    } catch (error) {
      console.error('Could not create and add to collection', error);
      showFeedback('Error!');
    }
  };

  const fileIsInCollection = isFileInAnyCollection(fileId);

  return (
    <div className="add-to-collection-container" ref={containerRef}>
      <button
        className={`btn-add-to ${fileIsInCollection ? 'added' : ''}`}
        onClick={onToggle}
        title={fileIsInCollection ? 'In a collection' : 'Add to collection'}
        aria-expanded={isOpen}
        aria-label="Add to collection"
      >
        {fileIsInCollection ? '✔' : '+'}
      </button>

      {isOpen && (
        <div className="dropdown-menu" role="menu" onClick={(e) => e.stopPropagation()}>
          <div className="dropdown-header">Add to Collection</div>

          {collections.length === 0 && (
            <div className="dropdown-empty">No collections yet</div>
          )}

          {collections.map(collection => (
            <div
              key={collection._id}
              className="dropdown-item"
              onClick={(e) => handleAddFile(collection._id, e)}
              role="menuitem"
            >
              {collection.name}
            </div>
          ))}

          <div className="dropdown-divider" />

          <form onSubmit={handleCreateAndAdd} className="dropdown-form" onClick={(e) => e.stopPropagation()}>
            <input
              type="text"
              placeholder="New collection..."
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
            <button type="submit">+</button>
          </form>

          {feedback && <div className="dropdown-feedback">{feedback}</div>}
        </div>
      )}
    </div>
  );
};

export default AddToCollection;
