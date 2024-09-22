import React, { useState, useEffect } from 'react';
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { useFirebaseOperations, Note } from '../../hooks/FirebaseOperations';
import { useAuth } from '../../context/AuthContext';
import { useMessage } from '../../context/MessageContext';
import styles from './BrainDump.module.css';
import NoteCard from './NoteCard';


const BrainDump: React.FC = () => {
    const [newNoteTitle, setNewNoteTitle] = useState('');
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [notes, setNotes] = useState<Note[]>([]);
    const { currentUser } = useAuth();
    const { addMessage } = useMessage();
    const { addNote, fetchNotes } = useFirebaseOperations();


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
            addMessage('Failed to load notes. Please try again.');
        }
    };

    const handleAddNote = async () => {
        if (!currentUser || !newNoteTitle.trim()) return;

        const contentState = editorState.getCurrentContent();
        const rawContent = JSON.stringify(convertToRaw(contentState));

        const newNoteObject = {
            title: newNoteTitle,
            content: rawContent,
            timestamp: Date.now(),
        };

        try {
            await addNote(currentUser.uid, newNoteObject);
            setNewNoteTitle('');
            setEditorState(EditorState.createEmpty());
            addMessage('Note added successfully');
        } catch (error) {
            console.error("Error adding note: ", error);
            addMessage('Failed to add note. Please try again.');
        }
    };

    return (
        <div className={styles.brainDumpPage}>
            <div className={styles.topSection}>
                <div className={styles.header}>
                    <div className={styles.title}>Brain Dump</div>
                </div>
                <div className={styles.inputContainer}>
                    <Editor
                        editorState={editorState}
                        onEditorStateChange={setEditorState}
                        wrapperClassName={styles.editorWrapper}
                        editorClassName={styles.editor}
                        toolbarClassName={styles.editorToolbar}
                        toolbar={{
                            options: ['inline', 'list', 'textAlign', 'history'],
                            inline: {
                                inDropdown: false,
                                options: ['bold', 'italic', 'underline', 'strikethrough'],
                            },
                            list: {
                                inDropdown: false,
                                options: ['ordered', 'unordered'],
                            },
                            textAlign: {
                                inDropdown: false,
                                options: ['left', 'center', 'right'],
                            },
                            indent: { inDropdown: false },
                            history: { inDropdown: false },
                        }}
                    />
                    <button className={styles.addButton} onClick={handleAddNote}>Save Note</button>
                </div>
            </div>

            <div className={styles.notesGrid}>
                {notes.map((note) => (
                    <NoteCard key={note.id} note={note} />
                ))}
            </div>
        </div>
    );
};

export default BrainDump;