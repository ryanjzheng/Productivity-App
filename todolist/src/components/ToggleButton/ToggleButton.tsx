import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import styles from "./ToggleButton.module.css";

interface ToggleButtonProps {
  onClick: () => void;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({ onClick }) => {

  return (
    <div className={styles.websiteHeader}>
      <button className={styles.toggleButton} onClick={onClick}>
        <FontAwesomeIcon icon={faBars} className={styles.icon} />
      </button>
    </div>
  );
};

export default ToggleButton;
