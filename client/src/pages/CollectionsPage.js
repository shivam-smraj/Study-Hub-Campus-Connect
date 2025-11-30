// client/src/pages/CollectionsPage.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchCollections, createCollection, deleteCollection } from '../api';
import Spinner from '../components/Spinner';
import './CollectionsPage.css';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { TrashIcon } from '../components/Icons';

const CollectionsPage = () => {
    const [newCollectionName, setNewCollectionName] = useState('');
    const queryClient = useQueryClient();

    const { data: collections, isLoading: loading, error } = useQuery({
        queryKey: ['collections'],
        queryFn: () => fetchCollections().then(res => res.data),
    });

    const createMutation = useMutation({
        mutationFn: createCollection,
        onSuccess: () => {
            toast.success('Collection created!');
            setNewCollectionName('');
            queryClient.invalidateQueries(['collections']);
        },
        onError: () => {
            toast.error('Failed to create collection.');
        }
    });

    const deleteMutation = useMutation({
        mutationFn: deleteCollection,
        onSuccess: () => {
            toast.success('Collection deleted!');
            queryClient.invalidateQueries(['collections']);
        },
        onError: () => {
            toast.error('Failed to delete collection.');
        }
    });

    const handleCreateCollection = (e) => {
        e.preventDefault();
        if (!newCollectionName.trim()) return;
        createMutation.mutate(newCollectionName);
    };

    const handleDeleteCollection = (e, id) => {
        e.preventDefault(); // Prevent navigation
        if (window.confirm('Are you sure you want to delete this collection?')) {
            deleteMutation.mutate(id);
        }
    };

    return (
        <div className="collections-page">
            <div className="breadcrumb">
                <Link to="/">Home</Link> / <span>My Collections</span>
            </div>
            <h1>My Collections</h1>
            
            <form onSubmit={handleCreateCollection} className="create-collection-form">
                <input
                    type="text"
                    value={newCollectionName}
                    onChange={(e) => setNewCollectionName(e.target.value)}
                    placeholder="New collection name..."
                />
                <button type="submit" disabled={createMutation.isPending}>
                    {createMutation.isPending ? 'Creating...' : 'Create'}
                </button>
            </form>

            {loading && <Spinner />}
            {error && <p className="error-message">Could not load your collections.</p>}
            
            {!loading && !error && (
                <div className="collections-grid">
                    {collections?.length > 0 ? (
                        collections.map(collection => (
                            <Link key={collection._id} to={`/collections/${collection._id}`} className="collection-card">
                                <div className="collection-info">
                                    <h3>{collection.name}</h3>
                                    <p>{collection.files.length} item(s)</p>
                                </div>
                                <button 
                                    className="delete-collection-btn"
                                    onClick={(e) => handleDeleteCollection(e, collection._id)}
                                    title="Delete Collection"
                                >
                                    <TrashIcon className="icon" />
                                </button>
                            </Link>
                        ))
                    ) : (
                        <p>You haven't created any collections yet. Use the form above to start organizing your files.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default CollectionsPage;