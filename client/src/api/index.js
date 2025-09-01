// client/src/api/index.js --- CORRECTED

import axios from 'axios';

// The baseURL is determined by the environment. For production, it MUST be the full server URL.
// For local dev, it will be an empty string, allowing the 'proxy' in package.json to work.
const baseURL = process.env.NODE_ENV === 'production'
  ? process.env.REACT_APP_API_URL
  : '';

const API = axios.create({
  baseURL: baseURL,
  withCredentials: true // This is crucial for sending cookies
});
export default API;

// Now, all API calls must include the /api prefix
export const fetchBranches = () => API.get('/api/branches');
export const fetchSubjectsByBranch = (branchId) => API.get(`/api/subjects?branchId=${branchId}`);
export const fetchFilesBySubject = (subjectId) => API.get(`/api/files?subjectId=${subjectId}`);
export const fetchGlobalSubjects = () => API.get('/api/subjects?global=true');
export const likeFile = (fileId) => API.put(`/api/files/${fileId}/like`);

export const fetchBookmarks = () => API.get('/api/user/bookmarks');
export const addBookmark = (fileId) => API.put(`/api/user/bookmarks/${fileId}`);
export const removeBookmark = (fileId) => API.delete(`/api/user/bookmarks/${fileId}`);

export const fetchCollections = () => API.get('/api/collections');
export const createCollection = (name) => API.post('/api/collections', { name });
export const fetchCollectionById = (collectionId) => API.get(`/api/collections/${collectionId}`);
export const addFileToCollection = (collectionId, fileId) => API.put(`/api/collections/${collectionId}/add-file`, { fileId });

export const searchFiles = (query, filters = {}) => {
    const params = new URLSearchParams({ q: query, ...filters });
    return API.get(`/api/search?${params.toString()}`);
};