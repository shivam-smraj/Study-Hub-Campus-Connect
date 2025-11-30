import React, { useState, useEffect, useRef } from 'react';
import './AddToCollection.css';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { PlusIcon } from './Icons';

const AddToCollection = ({ fileId, minimal }) => {
  const {
    collections, // Use collections from context
    isFileInAnyCollection,
    createAndAddFileToCollection,
    addFileToExistingCollection
  } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const containerRef = useRef(null);

  // toggle dropdown
  const onToggle = () => setIsOpen(prev => !prev);

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

  const handleAddFile = async (collectionId, e) => {
    // stop propagation to prevent accidental outside handlers
    if (e && e.stopPropagation) e.stopPropagation();
    try {
      await addFileToExistingCollection(collectionId, fileId);
      toast.success('Added to collection!');
      setIsOpen(false);
    } catch (error) {
      console.error('Could not add file to collection', error);
      toast.error('Failed to add file.');
    }
  };

  const handleCreateAndAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!newCollectionName.trim()) return;
    try {
      await createAndAddFileToCollection(newCollectionName.trim(), fileId);
      toast.success('Collection created and file added!');
      setNewCollectionName('');
      setIsOpen(false);
    } catch (error) {
      console.error('Could not create and add to collection', error);
      toast.error('Failed to create collection.');
    }
  };

  const fileIsInCollection = isFileInAnyCollection(fileId);

  return (
    <div className="add-to-collection-container" ref={containerRef}>
      <button
        className={`action-btn add-collection-btn ${fileIsInCollection ? 'active' : ''}`}
        onClick={onToggle}
        title={fileIsInCollection ? 'In a collection' : 'Add to collection'}
        aria-expanded={isOpen}
        aria-label="Add to collection"
      >
        <PlusIcon className="icon" />
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
        </div>
      )}
    </div>
  );
};

export default AddToCollection;
