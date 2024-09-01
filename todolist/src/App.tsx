import React, { useState } from 'react';
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

const useShouldShowNavbar = () => {
  const location = useLocation();
  const authRoutes = ['/login', '/signup'];
  return !authRoutes.includes(location.pathname);
};

const AppContent: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const shouldShowNavbar = useShouldShowNavbar();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="App">
      {shouldShowNavbar && (
        <>
          <ToggleButton onClick={toggleSidebar} />
          <SideNavbar isOpen={isSidebarOpen} toggleNavbar={toggleSidebar} />
        </>
      )}
      <div style={{ marginLeft: shouldShowNavbar && isSidebarOpen ? '200px' : '0', padding: '1rem' }}>
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
      <MessageProvider> {/* Wrap your app with the MessageProvider */}
        <Router>
          <AppContent />
          <MessageHandler /> {/* Add the MessageHandler component */}
        </Router>
      </MessageProvider>
    </AuthProvider>
  );
};

export default App;
