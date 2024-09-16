import React from 'react';
import { MDBContainer, MDBNavbar, MDBNavbarNav, MDBNavbarItem, MDBNavbarLink, MDBIcon } from 'mdb-react-ui-kit';
import { useAuth } from '../../context/AuthContext';
import styles from './SideNavbar.module.css';

interface SideNavbarProps {
  isOpen: boolean;
  toggleNavbar: () => void;
}

const SideNavbar: React.FC<SideNavbarProps> = ({ isOpen }) => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className={`${styles.sideNavbar} ${isOpen ? styles.open : styles.closed}`}>
      <MDBNavbar expand="lg" light className="flex-column vh-100">
        <MDBContainer fluid>
          <MDBNavbarNav className="flex-column w-100 mt-4">
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
            <MDBNavbarItem className="mb-3">
              <MDBNavbarLink href="#" onClick={handleLogout} className={styles.navLink}>
                <MDBIcon fas icon="power-off" className="me-2" />
                Logout
              </MDBNavbarLink>
            </MDBNavbarItem>
          </MDBNavbarNav>
        </MDBContainer>
      </MDBNavbar>
    </div>
  );
};

export default SideNavbar;
