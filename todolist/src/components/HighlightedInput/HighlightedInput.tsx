import React, { useRef, useEffect } from 'react';
import { DateParseResult } from '../../utils/dateParser';
import styles from './Task.module.css';


const HighlightedInput: React.FC<{
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    parsedDate: DateParseResult | null;
    className?: string;
    placeholder?: string;
  }> = ({ value, onChange, parsedDate, className, placeholder }) => {
    const inputRef = useRef<HTMLInputElement>(null);
  
    useEffect(() => {
      if (inputRef.current) {
        const input = inputRef.current;
        input.style.caretColor = 'black';
        input.style.color = 'transparent';
      }
    }, []);
  
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
          className={`${styles.invisibleInput} ${className}`}
          placeholder={placeholder}
        />
      </div>
    );
  };