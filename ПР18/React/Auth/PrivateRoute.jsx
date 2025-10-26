import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, isAuthenticated = false }) => {
  return isAuthenticated ? children : <Navigate to="/" replace />;
};

export default PrivateRoute;