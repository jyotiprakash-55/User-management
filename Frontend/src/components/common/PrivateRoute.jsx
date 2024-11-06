import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ children, requiredPermission }) => {
  const { isAuthenticated, permissions } = useSelector(state => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredPermission) {
    const hasPermission = permissions.some(p => p.permission_name === requiredPermission);
    if (!hasPermission) {
      return <Navigate to="/welcome" replace />;
    }
  }

  return children;
};

export default PrivateRoute; 