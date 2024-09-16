import React, { useState, useRef, useCallback, useEffect } from 'react';
import styles from './Task.module.css';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { CustomDateTimePicker, datePickerProps, datePickerSlotProps } from '../../components/CustomDateTimePicker/CustomeDateTimePicker';
import { parseDate, DateParseResult } from '../../utils/dateParser';
import { Todo } from '../../hooks/FirebaseOperations';

interface TaskProps {
    todo: Todo;
    onDelete: (taskId: string) => void;
    onSave: (task: Todo) => void;
    onCancel: (taskId: string) => void;
}

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

const Task: React.FC<TaskProps> = ({ todo, onDelete, onSave, onCancel }) => {
    const [isEditing, setIsEditing] = useState(!todo.id || todo.id.startsWith('temp-'));
    const [title, setTitle] = useState(todo.title || '');
    const [text, setText] = useState(todo.text || '');
    const [date, setDate] = useState(todo.date || dayjs().format('YYYY-MM-DD'));
    const [time, setTime] = useState(todo.time || dayjs().format('HH:mm'));
    const [hasPendingChanges, setHasPendingChanges] = useState(false);
    const [parsedDate, setParsedDate] = useState<DateParseResult | null>(null);


    const titleInputRef = useRef<HTMLInputElement>(null);
    const editingRef = useRef<HTMLDivElement | null>(null);

    const [selectedDate, setSelectedDate] = useState(() => {
        if (todo.date && todo.time) {
            return dayjs(`${todo.date}T${todo.time}`);
        } else if (todo.date) {
            return dayjs(todo.date);
        } else {
            return dayjs();
        }
    });

    useEffect(() => {
        if (isEditing && titleInputRef.current) {
            titleInputRef.current.focus();
        }
    }, [isEditing]);

    useEffect(() => {
        if (hasPendingChanges) {
            const hasChanges = title !== todo.title || text !== todo.text || date !== todo.date || time !== todo.time;
            if (hasChanges) {
                handleSave();
            }
            setHasPendingChanges(false);
        }
    }, [date, time]);


    const handleSave = () => {
        let finalTitle = title;
        let finalDate = selectedDate;
        let hasChanges = false;


        if (parsedDate && parsedDate.recognizedText) {
            // Remove the recognized text from the title
            finalTitle = title.slice(0, parsedDate.start) + title.slice(parsedDate.end);
            finalTitle = finalTitle.trim(); // Remove any leading/trailing whitespace

            // Use the parsed date
            finalDate = dayjs(parsedDate.date);
        }

        hasChanges = hasChanges ||
            finalTitle !== todo.title ||
            text !== todo.text ||
            finalDate.format('YYYY-MM-DD') !== todo.date ||
            finalDate.format('HH:mm') !== todo.time;

        if (hasChanges) {
            onSave({
                ...todo,
                title: finalTitle,
                text,
                date: finalDate.format('YYYY-MM-DD'),
                time: finalDate.format('HH:mm')
            });

            // Reset the title state to the new title without the keyword
            setTitle(finalTitle);
        }


        setIsEditing(false);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setTitle(todo.title || '');
        setText(todo.text || '');
        if (!todo.id || todo.id.startsWith('temp-')) onCancel(todo.id!);
    };

    const handleDateTimeChange = (newDateValue: dayjs.Dayjs | null) => {
        if (newDateValue) {
            const formattedDate = newDateValue.format('YYYY-MM-DD');
            const formattedTime = newDateValue.format('HH:mm');
            setDate(formattedDate);
            setTime(formattedTime);

            setSelectedDate(newDateValue);
        } else {
            setDate('');
            setTime('');
        }
        setHasPendingChanges(true);
    };


    const handleClickOutside = useCallback((e: MouseEvent) => {
        if (editingRef.current && !editingRef.current.contains(e.target as Node)) {

            if (title.trim() === '' && text.trim() === '' && date.trim() === '' && time.trim() === '') {
                handleCancel();
            } else {
                handleSave();
            }
        }
    }, [title, text, date, time]);


    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value;
        setTitle(newTitle);
        const result = parseDate(newTitle);
        setParsedDate(result);
        if (result.date) {
            setSelectedDate(dayjs(result.date));
        }
    };


    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [handleClickOutside]);

    return (
        <div className={styles.taskContainer}>
            <div className={styles.ryan}>
                {todo.id && (
                    <input
                        className={styles.checkbox}
                        type="checkbox"
                        onChange={() => onDelete(todo.id!)}
                    />
                )}
                {isEditing ? (
                    <>
                        <div className={styles.taskContent} ref={editingRef}>
                            <HighlightedInput
                                value={title}
                                onChange={handleTitleChange}
                                parsedDate={parsedDate}
                                className={styles.taskTitleInput}
                                placeholder="Task Title"
                                onKeyPress={(e) => e.key === 'Enter' && handleSave()}
                                inputRef={titleInputRef}
                            />
                            <input
                                className={`${styles.invisibleInput} ${styles.taskDescInput}`}
                                placeholder="Task Description"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSave()}
                            />
                        </div>
                    </>
                ) : (
                    <div onClick={() => setIsEditing(true)} className={styles.taskContent}>
                        <div className={styles.taskTitleInput}>{todo.title}</div>
                        <div className={styles.taskDescInput}>{todo.text}</div>
                    </div>
                )}

                <div className={styles.iconRow}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <CustomDateTimePicker
                            {...datePickerProps}
                            value={selectedDate}
                            onChange={handleDateTimeChange}
                            slotProps={datePickerSlotProps}
                        />
                    </LocalizationProvider>
                </div>
            </div>
        </div>
    );
};

export default Task;
