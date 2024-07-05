import React from 'react';
import { Link } from 'react-router-dom';
import './SideNav.css';

interface NavbarProps {
  isOpen: boolean;
  toggleNavbar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isOpen, toggleNavbar }) => {
  return (
    <div>
      <button className="navbar-toggle" onClick={toggleNavbar}>
        {isOpen ? 'Close' : 'Open'}
      </button>
      <div className={`navbar ${isOpen ? 'open' : ''}`}>
        <ul>
          <li><Link to="/" onClick={toggleNavbar}>Today</Link></li>
          <li><a href="#services">Brain Dump</a></li>
          <li><a href="#about">About</a></li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
