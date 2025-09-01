// client/src/pages/CollectionsPage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchCollections, createCollection } from '../api';
import Spinner from '../components/Spinner';
import './CollectionsPage.css';

const CollectionsPage = () => {
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newCollectionName, setNewCollectionName] = useState('');

    useEffect(() => {
        const getCollections = async () => {
            try {
                setLoading(true);
                const { data } = await fetchCollections();
                setCollections(data);
                setError(null);
            } catch (err) {
                console.error("Failed to fetch collections:", err);
                setError("Could not load your collections.");
            } finally {
                setLoading(false);
            }
        };
        getCollections();
    }, []);

    const handleCreateCollection = async (e) => {
        e.preventDefault();
        if (!newCollectionName.trim()) return;

        try {
            const { data: newCollection } = await createCollection(newCollectionName);
            setCollections([newCollection, ...collections]); // Add new collection to the top
            setNewCollectionName(''); // Clear the input field
        } catch (err) {
            console.error("Failed to create collection:", err);
            alert("Could not create the collection. Please try again.");
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
                <button type="submit">Create</button>
            </form>

            {loading && <Spinner />}
            {error && <p className="error-message">{error}</p>}
            
            {!loading && !error && (
                <div className="collections-grid">
                    {collections.length > 0 ? (
                        collections.map(collection => (
                            <Link key={collection._id} to={`/collections/${collection._id}`} className="collection-card">
                                <h3>{collection.name}</h3>
                                <p>{collection.files.length} item(s)</p>
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