import { MDBContainer, MDBNavbar, MDBNavbarNav, MDBNavbarItem, MDBNavbarLink, MDBIcon } from 'mdb-react-ui-kit';
import { useAuth } from '../../context/AuthContext';
import styles from './SideNavbar.module.css';

interface SideNavbarProps {
  isOpen: boolean;
  toggleNavbar: () => void;
  openProfileModal: () => void;
}

const SideNavbar: React.FC<SideNavbarProps> = ({ isOpen, openProfileModal  }) => {
  const { currentUser } = useAuth();

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
          </MDBNavbarNav>
        </MDBContainer>
        <div className={styles.profileButtonContainer}>
          <button
            className={styles.profileButton}
            onClick={openProfileModal}
          >
            {renderProfileButton()}
          </button>
        </div>
      </MDBNavbar>
    </div>
  );
};

export default SideNavbar;
