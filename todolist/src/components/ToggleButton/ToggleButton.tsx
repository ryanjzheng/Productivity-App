import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import styles from "./ToggleButton.module.css";

interface ToggleButtonProps {
  onClick: () => void;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({ onClick }) => {
  const navigate = useNavigate();

  const handleNavigateHome = () => {
    navigate('/today')
  }

  return (
    <div className={styles.websiteHeader}>
      <button className={styles.toggleButton} onClick={onClick}>
        <FontAwesomeIcon icon={faBars} className={styles.icon} />
      </button>
      <div className={`${styles.websiteName}`} onClick={handleNavigateHome}>UPA</div>
    </div>
  );
};

export default ToggleButton;
