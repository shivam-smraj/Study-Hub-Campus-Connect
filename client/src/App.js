// client/src/App.js
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import './App.css';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from 'react-hot-toast';
import Spinner from './components/Spinner';

// Lazy load pages
const HomePage = lazy(() => import('./pages/HomePage'));
const SubjectPage = lazy(() => import('./pages/SubjectPage'));
const FileListPage = lazy(() => import('./pages/FileListPage'));
const GlobalSubjectPage = lazy(() => import('./pages/GlobalSubjectPage'));
const BookmarksPage = lazy(() => import('./pages/BookmarksPage'));
const CollectionsPage = lazy(() => import('./pages/CollectionsPage'));
const SingleCollectionPage = lazy(() => import('./pages/SingleCollectionPage'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const ManageBranches = lazy(() => import('./pages/admin/ManageBranches'));
const ManageSubjects = lazy(() => import('./pages/admin/ManageSubjects'));
const FileUpload = lazy(() => import('./pages/admin/FileUpload'));
const ManageUsers = lazy(() => import('./pages/admin/ManageUsers'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const SyllabusViewer = lazy(() => import('./components/SyllabusViewer'));

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="App">
        <Toaster position="top-center" />
        <Header />
        <main className="container">
          <Suspense fallback={
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
              <Spinner />
            </div>
          }>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/branch/:branchSlug" element={<SubjectPage />} />
              <Route path="/subject/:subjectSlug" element={<FileListPage />} />
              <Route path="/syllabus" element={<SyllabusViewer />} />
              <Route path="/question-papers" element={<GlobalSubjectPage />} />
              <Route path="/bookmarks" element={<ProtectedRoute><BookmarksPage /></ProtectedRoute>} />
              <Route path="/collections" element={<ProtectedRoute><CollectionsPage /></ProtectedRoute>} />
              <Route path="/collections/:collectionId" element={<ProtectedRoute><SingleCollectionPage /></ProtectedRoute>} />
              <Route path="/search" element={<SearchPage />} />

              <Route path="/admin" element={<AdminRoute><AdminDashboardPage /></AdminRoute>}>
                <Route index element={<Dashboard />} />
                <Route path="users" element={<ManageUsers />} />
                <Route path="branches" element={<ManageBranches />} />
                <Route path="subjects" element={<ManageSubjects />} />
                <Route path="upload" element={<FileUpload />} />
              </Route>
              
              <Route path="/about" element={<AboutPage />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
        <Analytics />
      </div>
    </Router>
  );
}

export default App;
