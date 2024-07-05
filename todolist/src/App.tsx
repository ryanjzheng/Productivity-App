import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Today from './pages/Today/Today';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import ProtectedRoute from './components/Routing/ProtectedRoute';
import WildcardRoute from './components/Routing/WildcardRoute';
import { AuthProvider } from './context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="today" element={<ProtectedRoute element={<Today />} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<WildcardRoute />} /> {/* Catch-all route */}
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
