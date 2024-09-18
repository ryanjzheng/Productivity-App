import React, { useState, useRef, useCallback, useEffect } from 'react';
import styles from './Task.module.css';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { CustomDateTimePicker, datePickerProps, datePickerSlotProps } from '../../components/CustomDateTimePicker/CustomeDateTimePicker';
import { parseDate, DateParseResult } from '../../utils/dateParser';
import { Todo } from '../../hooks/FirebaseOperations';
import HighlightedInput from '../../components/HighlightedInput/HighlightedInput';

interface TaskProps {
    todo: Todo;
    onDelete: (taskId: string) => void;
    onSave: (task: Todo) => void;
    onCancel: (taskId: string) => void;
}

const Task: React.FC<TaskProps> = ({ todo, onDelete, onSave }) => {
    const [isEditing, setIsEditing] = useState(!todo.id || todo.id.startsWith('temp-'));
    const [parsedDate, setParsedDate] = useState<DateParseResult | null>(null);
    const titleInputRef = useRef<HTMLInputElement>(null);
    const editingRef = useRef<HTMLDivElement | null>(null);

    const [localTitle, setLocalTitle] = useState(todo.title || '');
    const [localText, setLocalText] = useState(todo.text || '');
    const [localDatetime, setLocalDatetime] = useState<Dayjs | null>(() => {
        if (todo.date && todo.time) {
            return dayjs(`${todo.date}T${todo.time}`);
        } else if (todo.date) {
            return dayjs(todo.date);
        } else {
            return null;
        }
    });

    useEffect(() => {
        if (isEditing && titleInputRef.current) {
            titleInputRef.current.focus();
        }
    }, [isEditing]);

    const handleSave = useCallback((dateToSave: Dayjs | null = localDatetime) => {
        let finalDatetime = dateToSave;

        if (parsedDate && parsedDate.recognizedText) {
            if (!dateToSave) {
                finalDatetime = dayjs(parsedDate.date);
            }
        }

        const updatedTodo: Todo = {
            ...todo,
            title: localTitle,
            text: localText,
            date: finalDatetime ? finalDatetime.format('YYYY-MM-DD') : '',
            time: finalDatetime ? finalDatetime.format('HH:mm') : ''
        };


        console.log("final date time", finalDatetime);

        const hasChanges =
            updatedTodo.title !== todo.title ||
            updatedTodo.text !== todo.text ||
            updatedTodo.date !== todo.date ||
            updatedTodo.time !== todo.time;

        if (hasChanges) {
            console.log("Saving updated todo:", updatedTodo);
            onSave(updatedTodo);
        }

        setIsEditing(false);
    }, [localTitle, localText, localDatetime, parsedDate, todo, onSave]);

    const handleClickOutside = useCallback((e: MouseEvent) => {
        if (editingRef.current && !editingRef.current.contains(e.target as Node)) {
            handleSave();
        }
    }, [handleSave]);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value;
        setLocalTitle(newTitle);
        const result = parseDate(newTitle);
        setParsedDate(result);
        if (result.date) {
            setLocalDatetime(dayjs(result.date));
        }
    };

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalText(e.target.value);
    };

    const handleDateChange = useCallback((newDate: Dayjs | null) => {
        setLocalDatetime(newDate);
        console.log("wored");
        handleSave(newDate);
    }, [handleSave]);

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
                                value={localTitle}
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
                                value={localText}
                                onChange={handleTextChange}
                                onKeyPress={(e) => e.key === 'Enter' && handleSave()}
                            />
                        </div>
                    </>
                ) : (
                    <div onClick={() => setIsEditing(true)} className={styles.taskContent}>
                        <div className={styles.taskTitleInput}>{localTitle}</div>
                        <div className={styles.taskDescInput}>{localText}</div>
                    </div>
                )}

                <div className={styles.iconRow}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <CustomDateTimePicker
                            {...datePickerProps}
                            value={localDatetime}
                            onChange={(newDatetime) => handleDateChange(newDatetime)}
                            slotProps={datePickerSlotProps}
                            onClose={handleSave}
                        />
                    </LocalizationProvider>
                </div>
            </div>
        </div>
    );
};

export default Task;