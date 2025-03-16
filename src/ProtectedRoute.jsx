import React from 'react';
import { Navigate } from 'react-router';
import { useUser } from '../src/components/UserContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, hasRole, loading } = useUser();

  // Show a loading indicator while checking authentication
  if (loading) {
    return <div>Loading...</div>; // You can replace this with a spinner or skeleton screen
  }

  // Redirect to login if the user is not authenticated
  if (!user) {
    return <Navigate to="/" replace />; // Replace with your login route
  }

  // Check if the user has the required role
  if (requiredRole && !hasRole(requiredRole)) {
    return <div>You do not have permission to access this page.</div>; // Or redirect to a "403 Forbidden" page
  }

  // Render the protected content
  return children;
};

export default ProtectedRoute;
