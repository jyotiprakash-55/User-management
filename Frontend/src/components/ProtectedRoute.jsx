import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, requiredPermissions = [] }) => {
  const { permissions, isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has any of the required permissions
  const hasRequiredPermissions = requiredPermissions.length === 0 || 
    requiredPermissions.some(permission => permissions.includes(permission));

  if (!hasRequiredPermissions) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute; 