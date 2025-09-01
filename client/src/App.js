// client/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SubjectPage from './pages/SubjectPage';
import FileListPage from './pages/FileListPage';
import GlobalSubjectPage from './pages/GlobalSubjectPage';
import Header from './components/Header';
import './App.css';
import BookmarksPage from './pages/BookmarksPage';
import ProtectedRoute from './components/ProtectedRoute';
import CollectionsPage from './pages/CollectionsPage';
import SingleCollectionPage from './pages/SingleCollectionPage';
// import SearchPage from './pages/SearchPage';
// import AdminRoute from './components/AdminRoute';
// import AdminDashboardPage from './pages/admin/AdminDashboardPage';
// import Dashboard from './pages/admin/Dashboard';
import Footer from './components/Footer';
import AboutPage from './pages/AboutPage';



function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main className="container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/branch/:branchId" element={<SubjectPage />} />
            <Route path="/subject/:subjectId" element={<FileListPage />} />
            <Route path="/syllabus" element={<GlobalSubjectPage />} />
            <Route path="/question-papers" element={<GlobalSubjectPage />} />
            <Route path="/bookmarks" element={<ProtectedRoute><BookmarksPage /></ProtectedRoute>} />
            <Route path="/collections" element={<ProtectedRoute><CollectionsPage /></ProtectedRoute>} />
            <Route path="/collections/:collectionId" element={<ProtectedRoute><SingleCollectionPage /></ProtectedRoute>} />
            {/* <Route path="/search" element={<SearchPage />} /> */}

            {/* <Route path="/admin" element={<AdminRoute><AdminDashboardPage /></AdminRoute>}>
              <Route index element={<Dashboard />} />
            </Route> */}
             {/* <Route 
            path="/admin/*" // Use a wildcard to match all nested admin routes
            element={<AdminRoute><AdminDashboardPage /></AdminRoute>} /> */}
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
