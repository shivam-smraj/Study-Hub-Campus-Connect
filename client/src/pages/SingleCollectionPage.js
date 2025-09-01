// client/src/pages/SingleCollectionPage.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchCollectionById } from '../api';
import FileListItem from '../components/FileListItem';
import Spinner from '../components/Spinner';

const SingleCollectionPage = () => {
    const { collectionId } = useParams();
    const [collection, setCollection] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getCollection = async () => {
            try {
                setLoading(true);
                const { data } = await fetchCollectionById(collectionId);
                setCollection(data);
                setError(null);
            } catch (err) {
                console.error("Failed to fetch collection:", err);
                setError("Could not load this collection.");
            } finally {
                setLoading(false);
            }
        };
        getCollection();
    }, [collectionId]);

    return (
        <div className="file-list-page">
            <div className="breadcrumb">
                <Link to="/">Home</Link> / <Link to="/collections">My Collections</Link> / <span>{collection ? collection.name : '...'}</span>
            </div>
            <h1>{collection ? collection.name : 'Loading...'}</h1>
            
            {loading && <Spinner />}
            {error && <p className="error-message">{error}</p>}

            {!loading && !error && collection && (
                collection.files.length > 0 ? (
                    <div className="accordion-item" style={{ overflow: 'visible' }}>
                        <div className="accordion-content">
                            {collection.files.map(file => <FileListItem key={file._id} file={file} />)}
                        </div>
                    </div>
                ) : (
                    <p>This collection is empty. You can add files from any subject page.</p>
                )
            )}
        </div>
    );
};

export default SingleCollectionPage;