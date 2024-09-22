import React from 'react';
import { Note } from '../../hooks/FirebaseOperations';
import styles from './NoteCard.module.css';

interface NoteCardProps {
    note: Note;
}

const NoteCard: React.FC<NoteCardProps> = ({ note }) => {
    const getTimeAgo = (timestamp: number) => {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);
        if (seconds < 60) return `${seconds} seconds ago`;
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes} minutes ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours} hours ago`;
        const days = Math.floor(hours / 24);
        return `${days} days ago`;
    };
    

    return (
        <div className={styles.noteCard}>
            <h3 className={styles.noteTitle}>{note.title}</h3>
            <p className={styles.noteTimestamp}>{getTimeAgo(note.timestamp)}</p>
        </div>
    );
};

export default NoteCard;