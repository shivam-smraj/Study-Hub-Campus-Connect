// client/src/pages/SearchPage.js
import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { searchFiles } from '../api';
import Spinner from '../components/Spinner';
import './SearchPage.css';
import { useQuery } from '@tanstack/react-query';

const SearchPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const [searchTerm, setSearchTerm] = useState(query);

    const { data: results, isLoading: loading, error } = useQuery({
        queryKey: ['search', query],
        queryFn: () => searchFiles(query).then(res => res.data),
        enabled: !!query, // Only run if query exists
        staleTime: 1000 * 60 * 5,
    });

    const handleSearch = (e) => {
        e.preventDefault();
        setSearchParams({ q: searchTerm });
    };

    return (
        <div className="search-page">
            <h1>Search Files</h1>
            <form onSubmit={handleSearch} className="search-form">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search for files..."
                />
                <button type="submit">Search</button>
            </form>

            <div className="search-results">
                {loading && <Spinner />}
                {error && <p className="error-message">An error occurred while searching.</p>}
                {!loading && !error && (
                    query ? (
                        results && results.length > 0 ? (
                            results.map(file => (
                                <div key={file._id} className="search-result-item">
                                    <div className="file-details">
                                        <strong>{file.fileName}</strong>
                                        <small>{file.subjectDetails?.name} / {file.branchDetails?.[0]?.name}</small>
                                    </div>
                                    <div className="file-actions">
                                        <Link to={`/subject/${file.subjectDetails?.slug}`} className="btn-go-to">Go to Subject</Link>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No results found for "{query}".</p>
                        )
                    ) : (
                        <p>Enter a term above to search for materials.</p>
                    )
                )}
            </div>
        </div>
    );
};

export default SearchPage;