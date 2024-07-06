import React from "react";
import { MDBBtn } from "mdb-react-ui-kit";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import styles from "./ToggleButton.module.css";

interface ToggleButtonProps {
  onClick: () => void;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({ onClick }) => {
  return (
    <MDBBtn floating tag="a" className={styles.toggleButton} onClick={onClick}>
      <FontAwesomeIcon icon={faBars} className={styles.icon} />
    </MDBBtn>
  );
};

export default ToggleButton;
