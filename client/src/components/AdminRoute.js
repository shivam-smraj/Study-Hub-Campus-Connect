// client/src/components/AdminRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// IMPORTANT: This should match the email in your server's .env file
const ADMIN_EMAIL = process.env.REACT_APP_ADMIN_EMAIL; 

const AdminRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or a spinner
  }

  // Check if user is logged in AND their email matches the admin email
  if (currentUser && currentUser.email === ADMIN_EMAIL) {
    return children; // If they are the admin, render the requested page
  } else {
    // If they are not the admin, redirect them to the homepage
    return <Navigate to="/" replace />;
  }
};

export default AdminRoute;