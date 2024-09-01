import React, { useState, useRef, useCallback, useEffect } from 'react';
import { FaTrashAlt, FaEdit, FaRegClock } from 'react-icons/fa'; // Example icons
import styles from './Task.module.css';
import { DatePicker, TimePicker } from 'antd'; // Import DatePicker and TimePicker components
import moment, { Moment } from 'moment'; // Import moment and Moment type
import dayjs, { Dayjs } from 'dayjs';

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
    const [isEditing, setIsEditing] = useState(!todo.id || todo.id.startsWith('temp-')); // Start editing if adding a new task
    const [title, setTitle] = useState(todo.title || '');
    const [text, setText] = useState(todo.text || '');
    const [date, setDate] = useState(todo.date || '');  // Add state for date
    // const [displayDate, setDisplayDate] = useState(todo.date ? moment(todo.date).format('dddd') : ''); // State for displaying the formatted date
    const [time, setTime] = useState(todo.time || '');  // Add state for time


    const titleInputRef = useRef<HTMLInputElement>(null);
    const editingRef = useRef<HTMLDivElement | null>(null);
    const datePickerRef = useRef<HTMLDivElement | null>(null);
    const timePickerRef = useRef<HTMLDivElement | null>(null);

    // Sync local state with props when todo changes
    useEffect(() => {
        setTitle(todo.title || '');
        setText(todo.text || '');
    }, [todo]);

    useEffect(() => {
        if (isEditing && titleInputRef.current) {
            titleInputRef.current.focus();
        }
    }, [isEditing]);

    const handleSave = () => {
        if (title.trim() === '' && text.trim() === '' && date.trim() === '' && time.trim() === '') {
            onCancel(todo.id!); // If all fields are empty, treat it as a cancel
            return;
        }
        onSave({ ...todo, title, text, date, time }); // Include date and time
        setIsEditing(false);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setTitle(todo.title || ''); // Reset to original value
        setText(todo.text || '');   // Reset to original value
        if (!todo.id || todo.id.startsWith('temp-')) onCancel(todo.id!); // Call onCancel to remove the new task if it's not saved
    };

    const handleClickOutside = useCallback((e: MouseEvent) => {
        if (
            editingRef.current &&
            !editingRef.current.contains(e.target as Node) &&
            datePickerRef.current && // Check if the click is not within the DatePicker
            !datePickerRef.current.contains(e.target as Node) &&
            timePickerRef.current && // Check if the click is not within the TimePicker
            !timePickerRef.current.contains(e.target as Node)
        ) {
            handleCancel();
        }
    }, [todo]);

    const handleDateChange = (date: Moment | null) => {
        if (date) {
            const formattedDate = date.format('YYYY-MM-DD');
            setDate(formattedDate);  // Store the date in YYYY-MM-DD format
            onSave({ ...todo, title, text, date: formattedDate, time });  // Immediately save the change
        } else {
            setDate('');
            onSave({ ...todo, title, text, date: '', time });  // Immediately save the change
        }
    };


    const handleTimeChange = (time: Dayjs | null) => {
        if (time) {
            const formattedTime = time.format('HH:mm');
            setTime(formattedTime); // Store the time in 'HH:mm' format using dayjs
            onSave({ ...todo, title, text, date, time: formattedTime });  // Immediately save the change
        } else {
            setTime('');
            onSave({ ...todo, title, text, date, time: '' });  // Immediately save the change
        }
    };


    useEffect(() => {
        if (isEditing && titleInputRef.current) {
            titleInputRef.current.focus();
        }
    }, [isEditing]);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [handleClickOutside]);

    return (
        <div
            className={styles.taskContainer}
        >
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
                        <div className={styles.iconRow}>
                            <FaEdit className={styles.icon} onClick={() => setIsEditing(true)} />
                            <FaTrashAlt className={styles.icon} onClick={() => onDelete(todo.id!)} />
                            <FaRegClock className={styles.icon} />
                        </div>
                    </>


                ) : (
                    <div onClick={() => setIsEditing(true)} className={styles.taskContent}>
                        <div className={styles.taskTitleInput}>{todo.title}</div>
                        <div className={styles.taskDescInput}>{todo.text}</div>
                    </div>
                )}

                <div className={styles.iconRow}>
                    <div ref={datePickerRef}>
                        <DatePicker
                            className={`${styles.customDatePicker}`}
                            value={date ? moment(date, 'YYYY-MM-DD') : null}
                            onChange={handleDateChange}
                            format="dddd"
                        />
                    </div>
                    {date && (
                        <div ref={timePickerRef}>
                            <TimePicker
                                className={`${styles.customDatePicker}`}
                                value={time ? dayjs(time, 'HH:mm') : null}
                                onChange={handleTimeChange}
                                format="HH:mm"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Task;
