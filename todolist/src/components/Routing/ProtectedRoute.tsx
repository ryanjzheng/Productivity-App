// src/context/ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Ensure correct import path

interface ProtectedRouteProps {
  element: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div></div>;
  }

  return currentUser ? element : <Navigate to="/login" />;
};

export default ProtectedRoute;
