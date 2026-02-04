import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const location = useLocation();

  // 1. Get user data from SESSION STORAGE (Per-tab storage)
  const token = sessionStorage.getItem("token");
  const userString = sessionStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;

  // 2. CHECK: Is user logged in?
  if (!token || !user) {
    // If no token, kick them to login, replace history so they can't click back
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // 3. CHECK: Does user have the right Role?
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If user is unauthorized for this specific page, send to Home
    return <Navigate to="/" replace />;
  }

  // 4. Render the protected page
  return children;
};

export default ProtectedRoute;