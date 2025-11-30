// client/src/api/index.js
import axios from 'axios';


// IMPORTANT: Ensure axios sends cookies with every request
axios.defaults.withCredentials = true;

// Use explicit URL in development to avoid proxy issues
const API_BASE_URL = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:5000/api');

const API = axios.create({ baseURL: API_BASE_URL });

export const fetchBranches = () => API.get('/branches');
export const fetchBranchDetails = (slug) => API.get(`/branches/details?slug=${slug}`);
export const fetchSubjectsByBranch = (branchSlug) => API.get(`/subjects?branchSlug=${branchSlug}`);
export const fetchSubjectsByBranchId = (branchId) => API.get(`/subjects?branchId=${branchId}`); // For Admin
export const fetchSubjectDetails = (slug) => API.get(`/subjects/details?slug=${slug}`);
export const fetchFilesBySubject = (subjectSlug) => API.get(`/files?subjectSlug=${subjectSlug}`);
export const fetchFilesBySubjectId = (subjectId) => API.get(`/files?subjectId=${subjectId}`); // For Admin
export const fetchGlobalSubjects = () => API.get('/subjects?global=true');
export const fetchCurrentUser = () => API.get('/auth/current_user');
export const likeFile = (fileId) => API.put(`/files/${fileId}/like`);
export const unlikeFile = (fileId) => API.put(`/files/${fileId}/unlike`);

export const fetchBookmarks = () => API.get('/user/bookmarks');
export const addBookmark = (fileId) => API.put(`/user/bookmarks/${fileId}`);
export const removeBookmark = (fileId) => API.delete(`/user/bookmarks/${fileId}`);

export const fetchCollections = () => API.get('/collections');
export const createCollection = (name) => API.post('/collections', { name });
export const deleteCollection = (collectionId) => API.delete(`/collections/${collectionId}`);
export const fetchCollectionById = (collectionId) => API.get(`/collections/${collectionId}`);
export const addFileToCollection = (collectionId, fileId) => API.put(`/collections/${collectionId}/add-file`, { fileId });

export const searchFiles = (query, filters = {}) => {const params = new URLSearchParams({ q: query, ...filters }); return API.get(`/search?${params.toString()}`);};

// Admin APIs
export const createBranch = (data) => API.post('/admin/branches', data);
export const updateBranch = (id, data) => API.put(`/admin/branches/${id}`, data);
export const deleteBranch = (id) => API.delete(`/admin/branches/${id}`);

export const createSubject = (data) => API.post('/admin/subjects', data);
export const updateSubject = (id, data) => API.put(`/admin/subjects/${id}`, data);
export const deleteSubject = (id) => API.delete(`/admin/subjects/${id}`);

export const createFile = (data) => API.post('/admin/files', data);
export const updateFile = (id, data) => API.put(`/admin/files/${id}`, data);
export const deleteFile = (id) => API.delete(`/admin/files/${id}`);

export const fetchAdminStats = () => API.get('/admin/stats');
export const fetchAllUsers = () => API.get('/admin/users');