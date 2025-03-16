import React from 'react';
import { Navigate } from 'react-router';
import { useUser } from '../src/components/UserContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, hasRole } = useUser();

  if (!user) {
    return <Navigate to="/" />; // Redirect to login if not authenticated
  }

  if (!hasRole(requiredRole)) {
    return <div>You do not have permission to access this page.</div>;
  }

  return children;
};

export default ProtectedRoute;
