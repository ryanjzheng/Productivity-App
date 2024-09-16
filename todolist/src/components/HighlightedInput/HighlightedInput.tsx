import React, { useRef, useEffect } from 'react';
import { DateParseResult } from '../../utils/dateParser';
import styles from '../../pages/Today/Task.module.css';


interface HighlightedInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  parsedDate: DateParseResult | null;
  className?: string;
  placeholder?: string;
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  inputRef?: React.RefObject<HTMLInputElement>;
}


const HighlightedInput: React.FC<HighlightedInputProps> = ({
  value,
  onChange,
  parsedDate,
  className,
  placeholder,
  onKeyPress,
  inputRef: externalRef,
}) => {
  const internalRef = useRef<HTMLInputElement>(null);
  const inputRef = externalRef || internalRef;

  useEffect(() => {
      if (inputRef.current) {
          const input = inputRef.current;
          input.style.caretColor = 'black';
          input.style.color = 'transparent';
      }
  }, [inputRef]);

  return (
      <div className={styles.highlightedInputContainer}>
          <div className={styles.highlightedText}>
              {value.split('').map((char, index) => {
                  const isHighlighted = parsedDate && index >= parsedDate.start && index < parsedDate.end;
                  return (
                      <span
                          key={index}
                          className={isHighlighted ? styles.highlight : ''}
                      >
                          {char}
                      </span>
                  );
              })}
          </div>
          <input
              ref={inputRef}
              type="text"
              value={value}
              onChange={onChange}
              onKeyPress={onKeyPress}
              className={`${styles.invisibleInput} ${className}`}
              placeholder={placeholder}
          />
      </div>
  );
};

export default HighlightedInput;