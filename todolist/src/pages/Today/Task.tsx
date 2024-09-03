import React, { useState, useRef, useCallback, useEffect } from 'react';
import styles from './Task.module.css';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { CustomDateTimePicker, datePickerProps, datePickerSlotProps } from '../../components/CustomDateTimePicker/CustomeDateTimePicker';

interface Todo {
    id?: string;
    title: string;
    text: string;
    order: number;
    date?: string;
    time?: string;
}

interface TaskProps {
    todo: Todo;
    onDelete: (taskId: string) => void;
    onSave: (task: Todo) => void;
    onCancel: (taskId: string) => void;
}

const Task: React.FC<TaskProps> = ({ todo, onDelete, onSave, onCancel }) => {
    const [isEditing, setIsEditing] = useState(!todo.id || todo.id.startsWith('temp-'));
    const [title, setTitle] = useState(todo.title || '');
    const [text, setText] = useState(todo.text || '');
    const [date, setDate] = useState(todo.date || dayjs().format('YYYY-MM-DD'));
    const [time, setTime] = useState(todo.time || dayjs().format('HH:mm'));
    const [hasPendingChanges, setHasPendingChanges] = useState(false);

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
        const hasChanges = title !== todo.title || text !== todo.text || date !== todo.date || time !== todo.time;
    
        if (hasChanges) {
            onSave({ ...todo, title, text, date, time });
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
                            <input
                                ref={titleInputRef}
                                className={`${styles.invisibleInput} ${styles.taskTitleInput}`}
                                type="text"
                                placeholder="Task Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSave()}
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
