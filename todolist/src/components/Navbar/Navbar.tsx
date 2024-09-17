import React, { useState, useRef, useEffect } from 'react';
import { MDBContainer, MDBNavbar, MDBNavbarNav, MDBNavbarItem, MDBNavbarLink, MDBIcon } from 'mdb-react-ui-kit';
import { useAuth } from '../../context/AuthContext';
import styles from './SideNavbar.module.css';

interface SideNavbarProps {
  isOpen: boolean;
  toggleNavbar: () => void;
}

const SideNavbar: React.FC<SideNavbarProps> = ({ isOpen }) => {
  const { currentUser, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profilePopupRef = useRef<HTMLDivElement>(null);
  const profileButtonRef = useRef<HTMLButtonElement>(null);


  const handleLogout = () => {
    logout();
  };

  const getInitial = () => {
    if (currentUser && currentUser.displayName) {
      return currentUser.displayName.charAt(0).toUpperCase();
    }
    return '?';
  };

  const renderProfileButton = () => {
    if (currentUser && currentUser.photoURL) {
      return (
        <img
          src={currentUser.photoURL}
          alt="Profile"
          className={styles.profileImage}
        />
      );
    } else {
      return getInitial();
    }
  };

  const toggleProfilePopup = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isProfileOpen &&
        profilePopupRef.current &&
        !profilePopupRef.current.contains(event.target as Node) &&
        profileButtonRef.current &&
        !profileButtonRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileOpen]);

  return (
    <div className={`${styles.sideNavbar} ${isOpen ? styles.open : styles.closed}`}>
      <MDBNavbar expand="lg" light className="flex-column vh-100">
        <MDBContainer fluid>
          <MDBNavbarNav className="flex-column w-100 mt-5">
            <MDBNavbarItem className="mb-3 mt-4">
              <MDBNavbarLink href="/today" className={styles.navLink}>
                <MDBIcon fas icon="home" className="me-2" />
                Today
              </MDBNavbarLink>
            </MDBNavbarItem>
            <MDBNavbarItem className="mb-3">
              <MDBNavbarLink href="#" className={styles.navLink}>
                <MDBIcon fas icon="user" className="me-2" />
                Profile
              </MDBNavbarLink>
            </MDBNavbarItem>
            <MDBNavbarItem className="mb-3">
              <MDBNavbarLink href="#" className={styles.navLink}>
                <MDBIcon fas icon="cog" className="me-2" />
                Settings
              </MDBNavbarLink>
            </MDBNavbarItem>
          </MDBNavbarNav>
        </MDBContainer>
        <div className={styles.profileButtonContainer}>
          <button
            ref={profileButtonRef}
            className={styles.profileButton}
            onClick={toggleProfilePopup}
          >
            {renderProfileButton()}
          </button>
          {isProfileOpen && (
            <div ref={profilePopupRef} className={styles.profilePopup}>
              <h3>{currentUser?.displayName}</h3>
              <p>{currentUser?.email}</p>
              <button onClick={handleLogout} className={styles.logoutButton}>Logout</button>
            </div>
          )}
        </div>
      </MDBNavbar>
    </div>
  );
};

export default SideNavbar;
