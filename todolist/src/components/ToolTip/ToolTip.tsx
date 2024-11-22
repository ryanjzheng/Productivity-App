import React, { useState } from 'react';
import styles from './ToolTip.module.css';

interface TooltipProps {
  message: string;
  style?: React.CSSProperties;
}

const Tooltip: React.FC<TooltipProps> = ({ message, style }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className={styles.tooltipContainer} style={style}>
      <button
        className={styles.tooltipButton}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
      ?
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