import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Today from './pages/Today/Today';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import BrainDump from './pages/BrainDump/BrainDump';
import NotePage from './pages/BrainDump/NotePage';
import ViewAllNotes from './pages/AllNotes/ViewAllNotes';
import ProtectedRoute from './components/Routing/ProtectedRoute';
import WildcardRoute from './components/Routing/WildcardRoute';
import SideNavbar from './components/Navbar/Navbar';
import ToggleButton from './components/ToggleButton/ToggleButton';
import MessageHandler from './components/GlobalMessages/MessageHandler';
import { MessageProvider } from './context/MessageContext';
import { AuthProvider } from './context/AuthContext';
import ProfileModal from './components/ProfileModal/ProfileModal';
import AIAssistModal from './components/aiAssist/aiAssist';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './global.css'


const useShouldShowNavbar = () => {
  const location = useLocation();
  const authRoutes = ['/login', '/signup'];
  return !authRoutes.includes(location.pathname);
};

const AppContent: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAIAssistOpen, setIsAIAssistOpen] = useState(false);
  const shouldShowNavbar = useShouldShowNavbar();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsSidebarOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsAIAssistOpen(prevState => !prevState);
      }
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const openProfileModal = () => {
    setIsProfileModalOpen(true);
  };

  const closeProfileModal = () => {
    setIsProfileModalOpen(false);
  };

  const toggleAIAssist = () => {
    setIsAIAssistOpen(prevState => !prevState);
  };

  return (
    <div>
      {shouldShowNavbar && (
        <>
          <ToggleButton onClick={toggleSidebar} />
          <SideNavbar
            isOpen={isSidebarOpen}
            toggleNavbar={toggleSidebar}
            openProfileModal={openProfileModal}
            openAIAssist={toggleAIAssist}
          />
        </>
      )}
      <div className={`content ${isSidebarOpen && shouldShowNavbar ? 'sidebarOpen' : ''}`}>
        <Routes>
          <Route path="today" element={<ProtectedRoute element={<Today />} />} />
          <Route path="/brain-dump" element={<ProtectedRoute element={<BrainDump />} />} />
          <Route path="/brain-dump/:id" element={<ProtectedRoute element={<NotePage />} />} />
          <Route path="/brain-dump/view-all" element={<ProtectedRoute element={<ViewAllNotes />} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<WildcardRoute />} />
        </Routes>
      </div>
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={closeProfileModal}
      />
      <AIAssistModal
        isOpen={isAIAssistOpen}
        onClose={toggleAIAssist}
      />
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