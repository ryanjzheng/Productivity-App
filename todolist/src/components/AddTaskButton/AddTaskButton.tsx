import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from '@fortawesome/free-solid-svg-icons'; // import the specific icon
import styles from "./AddTaskButton.module.css";

interface AddTaskButtonProps {
  onClick: () => void;
}

const AddTaskButton: React.FC<AddTaskButtonProps> = ({ onClick }) => {
  return (
    <button className={styles.toggleButton} onClick={onClick}>
      <FontAwesomeIcon icon={faPlus} className={styles.icon} />
    </button>
  );
};

export default AddTaskButton;
