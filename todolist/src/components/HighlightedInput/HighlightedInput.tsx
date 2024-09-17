import React, { useRef, useEffect } from 'react';
import { DateParseResult } from '../../utils/dateParser';
import styles from './HighlightedInput.module.css';

interface HighlightedInputProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    parsedDate: DateParseResult | null;
    className?: string;
    placeholder?: string;
    onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    inputRef?: React.RefObject<HTMLInputElement>;
    onHighlightClick: () => void;
}

const HighlightedInput: React.FC<HighlightedInputProps> = ({
    value,
    onChange,
    parsedDate,
    className,
    placeholder,
    onKeyPress,
    inputRef: externalRef,
    onHighlightClick,
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


    const renderHighlightedText = () => {
        if (!parsedDate) {
            return <span>{value}</span>;
        }

        const beforeHighlight = value.slice(0, parsedDate.start);
        const highlightedText = value.slice(parsedDate.start, parsedDate.end);
        const afterHighlight = value.slice(parsedDate.end);

        return (
            <>
                {beforeHighlight}
                <span
                    className={styles.highlight}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onHighlightClick();
                    }}
                >
                    {highlightedText}
                </span>
                {afterHighlight}
            </>
        );
    };

    return (
        <div className={styles.highlightedInputContainer}>
            <div className={styles.highlightedText}>
                {renderHighlightedText()}
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