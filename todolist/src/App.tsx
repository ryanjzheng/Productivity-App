import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Today from './pages/Today/Today';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import ProtectedRoute from './components/Routing/ProtectedRoute';
import WildcardRoute from './components/Routing/WildcardRoute';
import SideNavbar from './components/Navbar/Navbar';
import ToggleButton from './components/ToggleButton/ToggleButton';
import MessageHandler from './components/GlobalMessages/MessageHandler';
import { MessageProvider } from './context/MessageContext';
import { AuthProvider } from './context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './global.css'

const useShouldShowNavbar = () => {
  const location = useLocation();
  const authRoutes = ['/login', '/signup'];
  return !authRoutes.includes(location.pathname);
};

const AppContent: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const shouldShowNavbar = useShouldShowNavbar();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };


  return (
    <div>
      {shouldShowNavbar && (
        <>
          <ToggleButton onClick={toggleSidebar} />
          <SideNavbar isOpen={isSidebarOpen} toggleNavbar={toggleSidebar} />
        </>
      )}
      <div className={`content ${isSidebarOpen && shouldShowNavbar ? 'sidebarOpen' : ''}`}>
      <Routes>
          <Route path="today" element={<ProtectedRoute element={<Today />} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<WildcardRoute />} />
        </Routes>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <MessageProvider>
        <Router>
          <AppContent />
          <MessageHandler />
        </Router>
      </MessageProvider>
    </AuthProvider>
  );
};

export default App;
