import React, { useState } from 'react';
import styles from './ToolTip.module.css';

interface TooltipProps {
  message: string;
}

const Tooltip: React.FC<TooltipProps> = ({ message }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className={styles.tooltipContainer}>
      <button
        className={styles.tooltipButton}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        i
      </button>
      {isVisible && (
        <div className={styles.tooltipContent}>
          {message}
        </div>
      )}
    </div>
  );
};

export default Tooltip;