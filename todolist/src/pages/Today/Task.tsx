import React, { useState, useRef, useCallback, useEffect } from 'react';
import styles from './Task.module.css';
import dayjs from 'dayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { styled } from '@mui/material/styles';


const CustomDateTimePicker = styled(DateTimePicker)({
    '& .MuiInputBase-root': {
        color: 'var(--text-color)',
        width: '215px',
        height: '35px',
        backgroundColor: 'var(--background-color)',
        borderRadius: '16px',

    },
    '& .MuiOutlinedInput-notchedOutline': {
        border: 'none',
    },
    '& .MuiSvgIcon-root': {
        color: 'var(--primary)',
    },
});

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
        if (hasPendingChanges && (title.trim() !== '' || text.trim() !== '' || date.trim() !== '' || time.trim() !== '')) {
            handleSave();
            setHasPendingChanges(false);
        }
    }, [date, time]);


    const handleSave = () => {
        if (title.trim() === '') {
            handleCancel();
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
                            desktopModeMediaQuery="(min-width: 768px)"
                            value={selectedDate}
                            onChange={handleDateTimeChange}
                            format="dddd - h:mm A"
                            slotProps={{
                                textField: {
                                    variant: 'outlined',
                                },
                                digitalClockSectionItem: {
                                    sx: {
                                        backgroundColor: 'var(--secondary-color)',
                                        borderRadius: '16px',
                                        '&.Mui-selected': {
                                            backgroundColor: 'var(--background-color)',
                                            color: 'var(--ascent-color) !important',
                                        },
                                        '&:hover': {
                                            backgroundColor: 'var(--background-color)',
                                        },
                                        color: 'var(--text-color)',
                                        transition: 'background-color 0.2s ease, color 0.2s ease',

                                    },
                                },
                                // Desktop view layout
                                desktopPaper: {
                                    sx: {
                                        backgroundColor: 'var(--secondary-color)',
                                        borderRadius: '16px',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                        overflow: 'hidden',
                                    }
                                },
                                // Calendar header (month/year selection)
                                calendarHeader: {
                                    sx: {
                                        backgroundColor: 'var(--secondary-color)',
                                        color: 'var(--text-color)',
                                        '& .MuiPickersCalendarHeader-label': {
                                            color: 'var(--text-color)',
                                        },
                                        '& .MuiIconButton-root': {
                                            color: 'var(--text-color)',
                                        },
                                    }
                                },
                                // Individual day cells
                                day: {
                                    sx: {
                                        '&.Mui-selected': {
                                            backgroundColor: 'var(--background-color)',
                                            color: 'var(--ascent-color)',
                                            '&:hover': {
                                                backgroundColor: 'var(--primary-color-dark)',
                                            },
                                        },
                                        '&.MuiPickersDay-root.Mui-selected': {
                                            backgroundColor: 'var(--background-color)',
                                            color: 'var(--ascent-color)',
                                        },
                                    }
                                },
                                // Action bar (OK/Cancel buttons)
                                actionBar: {
                                    sx: {
                                        backgroundColor: 'var(--secondary-color)',
                                        '& .MuiButton-root': {
                                            color: 'var(--ascent-color)',
                                        },
                                    },
                                },
                                mobilePaper: {
                                    sx: {
                                        backgroundColor: 'var(--secondary-color)',
                                        borderRadius: '16px',
                                        overflow: 'hidden',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                        '& .MuiClock-root': {
                                            backgroundColor: 'var(--secondary-color)',
                                        },
                                        '& .MuiClock-clock': {
                                            backgroundColor: 'var(--background-color)',
                                        },

                                        '& .MuiClockNumber-root': {
                                            color: 'var(--text-color)',
                                            '&.Mui-selected': {
                                                color: 'var(--ascent-color)',
                                            },
                                        },
                                        '& .MuiClock-pin': {
                                            backgroundColor: 'var(--primary)',
                                          },
                                        '& .MuiClockPointer-root': {
                                            backgroundColor: 'var(--primary)',
                                        },
                                        '& .MuiClockPointer-thumb': {
                                            backgroundColor: 'var(--primary)',
                                            borderColor: 'var(--primary)',
                                        },
                                        '& .MuiPickersDay-root.Mui-selected': {
                                            backgroundColor: 'var(--background-color)',
                                            color: 'var(--ascent-color)',
                                          },
                                    },
                                },
                            }}
                        />
                    </LocalizationProvider>
                </div>
            </div>
        </div>
    );
};

export default Task;
