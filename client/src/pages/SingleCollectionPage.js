// client/src/pages/SingleCollectionPage.js
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchCollectionById } from '../api';
import FileListItem from '../components/FileListItem';
import Spinner from '../components/Spinner';
import { useQuery } from '@tanstack/react-query';

const SingleCollectionPage = () => {
    const { collectionId } = useParams();

    const { data: collection, isLoading: loading, error } = useQuery({
        queryKey: ['collection', collectionId],
        queryFn: () => fetchCollectionById(collectionId).then(res => res.data),
        enabled: !!collectionId,
    });

    return (
        <div className="file-list-page">
            <div className="breadcrumb">
                <Link to="/">Home</Link> / <Link to="/collections">My Collections</Link> / <span>{collection ? collection.name : '...'}</span>
            </div>
            <h1>{collection ? collection.name : 'Loading...'}</h1>
            
            {loading && <Spinner />}
            {error && <p className="error-message">Could not load this collection.</p>}

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