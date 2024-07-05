// src/components/WildcardRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Ensure correct import path

const WildcardRoute: React.FC = () => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div></div>;
  }

  return currentUser ? <Navigate to="/today" /> : <Navigate to="/login" />;
};

export default WildcardRoute;
