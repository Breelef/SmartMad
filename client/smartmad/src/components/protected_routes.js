import React from 'react';
import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('accessToken'); // Example for checking auth status
  return isAuthenticated ? children : <Navigate to="/login" />;
};

