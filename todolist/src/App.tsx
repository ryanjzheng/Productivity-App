import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar/SideNav';
import HomePage from './pages/Today';

import './App.css';

const App: React.FC = () => {
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);

  const toggleNavbar = () => {
    setIsNavbarOpen(!isNavbarOpen);
  };

  return (
    <Router>
      <div className={`app ${isNavbarOpen ? 'navbar-open' : ''}`}>
        <Navbar isOpen={isNavbarOpen} toggleNavbar={toggleNavbar} />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />

          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
