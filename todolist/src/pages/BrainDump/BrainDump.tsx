import React, { useState, useEffect } from 'react';
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import { Link } from 'react-router-dom';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { useFirebaseOperations, Note } from '../../hooks/FirebaseOperations';
import { useAuth } from '../../context/AuthContext';
import { useMessage } from '../../context/MessageContext';
import styles from './BrainDump.module.css';
import NoteCard from '../../components/NoteCard/NoteCard';
import { model } from '../../firebaseConfig';
import Tooltip from '../../components/ToolTip/ToolTip';


const BrainDump: React.FC = () => {
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

    const generateTitle = async (content: string): Promise<string> => {
        try {
            const prompt = `Generate one short, concise title max of 9 words, for the following note content:\n${content}. 
                            If you can't come up with anything of substance, return -1`;
            const result = await model.generateContent(prompt);
            return result.response.text().trim();
        } catch (error) {
            console.error("Error generating title: ", error);
            return "Untitled Note";
        }
    };

    const handleAddNote = async () => {
        if (!currentUser) return;

        const contentState = editorState.getCurrentContent();
        const rawContent = JSON.stringify(convertToRaw(contentState));
        const plainText = contentState.getPlainText();

        let generatedTitle = await generateTitle(plainText);

        if (generatedTitle === "-1") {
            const now = new Date();
            const date = now.toLocaleDateString();
            const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            generatedTitle = `New Task: ${date} ${time}`;
        }

        const newNoteObject = {
            title: generatedTitle,
            content: rawContent,
            timestamp: Date.now(),
        };

        try {
            const addedNote = await addNote(currentUser.uid, newNoteObject);
            setNotes(prevNotes => [addedNote, ...prevNotes]);
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
                    <Tooltip message="This is supposed to be very fast. Imagine you're about to board the subway and you just thought of something you wanted to
                                        write down. Quickly jot something down and we will automatically make the title for you." />
                </div>
                <div className={styles.inputContainer}>
                    <div className={styles.editorWrapper}>
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
                        <button className={styles.addButton} onClick={handleAddNote}>Enter</button>
                    </div>
                </div>
            </div>

            <div className={styles.notesGridContainer}>
                <Link to="/brain-dump/view-all" className={styles.viewAllLink}>View All</Link>
                <div className={styles.notesGrid}>
                    {notes.slice(0, 6).map((note) => (
                        <NoteCard key={note.id} note={note} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BrainDump;