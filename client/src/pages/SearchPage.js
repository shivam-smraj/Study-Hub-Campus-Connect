// client/src/pages/SearchPage.js
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchFiles } from '../api';
import FileListItem from '../components/FileListItem';
import Spinner from '../components/Spinner';
import './SearchPage.css';

const SearchPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');

    useEffect(() => {
        const query = searchParams.get('q');
        if (query) {
            const performSearch = async () => {
                try {
                    setLoading(true);
                    setError(null);
                    const { data } = await searchFiles(query);
                    setResults(data);
                } catch (err) {
                    setError('An error occurred while searching.');
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            };
            performSearch();
        } else {
            setResults([]); // Clear results if query is empty
        }
    }, [searchParams]);

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
                {error && <p className="error-message">{error}</p>}
                {!loading && !error && (
                    searchParams.get('q') ? (
                        results.length > 0 ? (
                            results.map(file => (
                                // We need to create a simple FileListItem-like component for search results
                                <div key={file._id} className="search-result-item">
                                    <div className="file-details">
                                        <strong>{file.fileName}</strong>
                                        <small>{file.subjectDetails.name} / {file.branchDetails[0]?.name}</small>
                                    </div>
                                    <div className="file-actions">
                                        <a href={`/subject/${file.subjectDetails._id}`} className="btn-go-to">Go to Subject</a>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No results found for "{searchParams.get('q')}".</p>
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