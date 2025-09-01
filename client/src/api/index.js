// client/src/api/index.js
import axios from 'axios';


axios.defaults.withCredentials = true;
// const API_BASE_URL = 'http://localhost:5000/';
const API = axios.create({ 
  baseURL: process.env.REACT_APP_API_URL || '/api',
  withCredentials: true // <-- Explicitly add it here
});

export const fetchBranches = () => API.get('/branches');
export const fetchSubjectsByBranch = (branchId) => API.get(`/subjects?branchId=${branchId}`);
// ADD THIS FUNCTION
export const fetchFilesBySubject = (subjectId) => API.get(`/files?subjectId=${subjectId}`);
export const fetchGlobalSubjects = () => API.get('/subjects?global=true');
export const likeFile = (fileId) => API.put(`/files/${fileId}/like`);

export const fetchBookmarks = () => API.get('/user/bookmarks');
export const addBookmark = (fileId) => API.put(`/user/bookmarks/${fileId}`);
export const removeBookmark = (fileId) => API.delete(`/user/bookmarks/${fileId}`);

export const fetchCollections = () => API.get('/collections');
export const createCollection = (name) => API.post('/collections', { name });
export const fetchCollectionById = (collectionId) => API.get(`/collections/${collectionId}`);
export const addFileToCollection = (collectionId, fileId) => API.put(`/collections/${collectionId}/add-file`, { fileId });

export const searchFiles = (query, filters = {}) => {const params = new URLSearchParams({ q: query, ...filters }); return API.get(`/search?${params.toString()}`);};