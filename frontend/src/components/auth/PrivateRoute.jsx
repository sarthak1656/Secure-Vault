import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  // 1. Check if the user is authenticated
  // We check if a token exists in LocalStorage.
  // In a real app, you might also check if the token is valid/expired.
  const isAuthenticated = localStorage.getItem('authToken');

  // 2. If authenticated, render the child routes (Outlet)
  // 3. If NOT authenticated, redirect to the Login page
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;