import React, { useState, useRef, useCallback, useEffect } from 'react';
import { FaTrashAlt, FaEdit, FaRegClock } from 'react-icons/fa';
import styles from './Task.module.css';
import { DatePicker, TimePicker } from 'antd';
import moment, { Moment } from 'moment';
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
    const [isEditing, setIsEditing] = useState(!todo.id || todo.id.startsWith('temp-'));
    const [title, setTitle] = useState(todo.title || '');
    const [text, setText] = useState(todo.text || '');
    const [date, setDate] = useState(todo.date || '');
    const [time, setTime] = useState(todo.time || '');
    const [hasPendingChanges, setHasPendingChanges] = useState(false);

    const titleInputRef = useRef<HTMLInputElement>(null);
    const editingRef = useRef<HTMLDivElement | null>(null);
    const datePickerRef = useRef<HTMLDivElement | null>(null);
    const timePickerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        setTitle(todo.title || '');
        setText(todo.text || '');
    }, [todo]);

    useEffect(() => {
        if (isEditing && titleInputRef.current) {
            titleInputRef.current.focus();
        }
    }, [isEditing]);

    useEffect(() => {
        if (hasPendingChanges && (title.trim() !== '' || text.trim() !== '' || date.trim() !== '' || time.trim() !== '')) {
            handleSave();
            setHasPendingChanges(false);
        }
    }, [date, time]);

    const handleSave = () => {
        if (title.trim() === '' && text.trim() === '' && date.trim() === '' && time.trim() === '') {
            handleCancel(); // Cancel if all fields are empty
            return;
        }
        onSave({ ...todo, title, text, date, time });
        setIsEditing(false);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setTitle(todo.title || '');
        setText(todo.text || '');
        if (!todo.id || todo.id.startsWith('temp-')) onCancel(todo.id!);
    };

    const handleClickOutside = useCallback((e: MouseEvent) => {
        // Check if the click is outside the editable area, date picker, or time picker
        if (editingRef.current && !editingRef.current.contains(e.target as Node) &&
            (!datePickerRef.current || !datePickerRef.current.contains(e.target as Node)) &&
            (!timePickerRef.current || !timePickerRef.current.contains(e.target as Node))) {

            console.log('Outside click detected');

            // Check if there are any meaningful changes
            if (title.trim() === '' && text.trim() === '' && date.trim() === '' && time.trim() === '') {
                console.log('All fields are empty, triggering cancel');
                handleCancel(); // Cancel if all fields are empty when clicking outside
            } else {
                console.log('Changes detected, triggering save');
                handleSave(); // Save changes if there are any when clicking outside
            }
        }
    }, [title, text, date, time]);


    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [handleClickOutside]);

    const handleDateChange = (date: Moment | null) => {
        if (date) {
            const formattedDate = date.format('YYYY-MM-DD');
            setDate(formattedDate);
        } else {
            setDate('');
        }
        setHasPendingChanges(true);
    };

    const handleTimeChange = (time: Dayjs | null) => {
        if (time) {
            const formattedTime = time.format('HH:mm');
            setTime(formattedTime);
        } else {
            setTime('');
        }
        setHasPendingChanges(true);
    };

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
