// client/src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or a spinner
  }

  if (!currentUser) {
    // If user is not logged in, redirect them to the homepage
    return <Navigate to="/" replace />;
  }

  return children; // If user is logged in, render the component they are trying to access
};

export default ProtectedRoute;