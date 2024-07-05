import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBIcon,
  MDBTooltip,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
} from 'mdb-react-ui-kit';
import styles from './Navbar.module.css';

const Navbar: React.FC = () => {
  return (
    <MDBContainer fluid className={styles.containerFluid}>
      <MDBRow>
        <MDBCol sm="auto" className={`bg-light sticky-top ${styles.bgLight} ${styles.stickyTop}`}>
          <div className={`d-flex flex-sm-column flex-row flex-nowrap bg-light align-items-center sticky-top ${styles.bgLight} ${styles.stickyTop}`}>
            <Link to="/" className={`d-block p-3 link-dark text-decoration-none ${styles.linkDark} ${styles.textDecorationNone}`} title="Home">
              <MDBIcon fas icon="home" size="2x" />
            </Link>
            <ul className={`nav nav-pills nav-flush flex-sm-column flex-row flex-nowrap mb-auto mx-auto text-center justify-content-between w-100 px-3 align-items-center ${styles.navPills}`}>
              <li className="nav-item">
                <MDBTooltip tag="span" title="Today" placement="right">
                  <Link to="/today" className={`nav-link py-3 px-2 ${styles.navLink}`}>
                    <MDBIcon fas icon="calendar-day" size="2x" />
                  </Link>
                </MDBTooltip>
              </li>
              <li>
                <MDBTooltip tag="span" title="Dashboard" placement="right">
                  <a href="#" className={`nav-link py-3 px-2 ${styles.navLink}`}>
                    <MDBIcon fas icon="tachometer-alt" size="2x" />
                  </a>
                </MDBTooltip>
              </li>
              <li>
                <MDBTooltip tag="span" title="Orders" placement="right">
                  <a href="#" className={`nav-link py-3 px-2 ${styles.navLink}`}>
                    <MDBIcon fas icon="table" size="2x" />
                  </a>
                </MDBTooltip>
              </li>
              <li>
                <MDBTooltip tag="span" title="Products" placement="right">
                  <a href="#" className={`nav-link py-3 px-2 ${styles.navLink}`}>
                    <MDBIcon fas icon="heart" size="2x" />
                  </a>
                </MDBTooltip>
              </li>
              <li>
                <MDBTooltip tag="span" title="Customers" placement="right">
                  <a href="#" className={`nav-link py-3 px-2 ${styles.navLink}`}>
                    <MDBIcon fas icon="users" size="2x" />
                  </a>
                </MDBTooltip>
              </li>
            </ul>
            <MDBDropdown className="d-flex align-items-center justify-content-center p-3">
              <MDBDropdownToggle tag="a" className={`link-dark text-decoration-none ${styles.linkDark} ${styles.textDecorationNone}`} role="button">
                <MDBIcon fas icon="user-circle" size="2x" />
              </MDBDropdownToggle>
              <MDBDropdownMenu>
                <MDBDropdownItem link>New project...</MDBDropdownItem>
                <MDBDropdownItem link>Settings</MDBDropdownItem>
                <MDBDropdownItem link>Profile</MDBDropdownItem>
                <MDBDropdownItem divider />
                <MDBDropdownItem link>Sign out</MDBDropdownItem>
              </MDBDropdownMenu>
            </MDBDropdown>
          </div>
        </MDBCol>
        <MDBCol sm="p-3 min-vh-100">
          <Outlet />
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default Navbar;
