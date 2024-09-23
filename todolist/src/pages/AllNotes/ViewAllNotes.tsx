import React, { useState, useEffect } from 'react';
import { useFirebaseOperations, Note } from '../../hooks/FirebaseOperations';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './ViewAllNotes.module.css';

interface GroupedNotes {
  Today: Note[];
  Yesterday: Note[];
  'Last 7 Days': Note[];
  'Last 30 Days': Note[];
  Older: Record<string, Note[]>;
}

const ViewAllNotes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { currentUser } = useAuth();
  const { fetchNotes } = useFirebaseOperations();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      loadNotes();
    }
  }, [currentUser]);

  const loadNotes = async () => {
    if (!currentUser) return;
    try {
      const fetchedNotes = await fetchNotes(currentUser.uid);
      setNotes(fetchedNotes);
    } catch (error) {
      console.error("Error fetching notes: ", error);
    }
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupNotesByDate = (notes: Note[]): GroupedNotes => {
    const now = new Date();
    const today = new Date(now.setHours(0, 0, 0, 0));
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);
    const lastMonth = new Date(today);
    lastMonth.setDate(lastMonth.getDate() - 30);

    return notes.reduce((groups: GroupedNotes, note) => {
      const noteDate = new Date(note.timestamp);
      if (noteDate >= today) {
        groups.Today.push(note);
      } else if (noteDate >= yesterday) {
        groups.Yesterday.push(note);
      } else if (noteDate >= lastWeek) {
        groups['Last 7 Days'].push(note);
      } else if (noteDate >= lastMonth) {
        groups['Last 30 Days'].push(note);
      } else {
        const monthYear = noteDate.toLocaleString('default', { month: 'long', year: 'numeric' });
        if (!groups.Older[monthYear]) {
          groups.Older[monthYear] = [];
        }
        groups.Older[monthYear].push(note);
      }
      return groups;
    }, { Today: [], Yesterday: [], 'Last 7 Days': [], 'Last 30 Days': [], Older: {} });
  };

  const groupedNotes = groupNotesByDate(filteredNotes);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
  };

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

  const handleNoteClick = (noteId: string) => {
    navigate(`/brain-dump/${noteId}`);
  };

  return (
    <div className={styles.viewAllNotesContainer}>
      <div className={styles.header}>
        <div className={styles.title}>Notes</div>
        <input
          type="text"
          placeholder="Search your notes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchBar}
        />
      </div>
      
      {Object.entries(groupedNotes).map(([groupTitle, notes]) => (
        groupTitle !== 'Older' ? (
          <div key={groupTitle} className={styles.noteGroup}>
            <h2>{groupTitle}</h2>
            {notes.map(note => (
              <div
                key={note.id}
                className={styles.noteRect}
                onClick={() => handleNoteClick(note.id!)}
              >
                <div className={styles.noteTitle}>{note.title}</div>
                <div className={styles.noteInfo}>
                  <span>{getTimeAgo(note.timestamp)}</span>
                  <span>{formatDate(note.timestamp)}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          Object.entries(notes as Record<string, Note[]>).map(([monthYear, monthNotes]) => (
            <div key={monthYear} className={styles.noteGroup}>
              <h2>{monthYear}</h2>
              {monthNotes.map(note => (
                <div
                  key={note.id}
                  className={styles.noteRect}
                  onClick={() => handleNoteClick(note.id!)}
                >
                  <div className={styles.noteTitle}>{note.title}</div>
                  <div className={styles.noteInfo}>
                    <span>{getTimeAgo(note.timestamp)}</span>
                    <span>{formatDate(note.timestamp)}</span>
                  </div>
                </div>
              ))}
            </div>
          ))
        )
      ))}
    </div>
  );
};

export default ViewAllNotes;