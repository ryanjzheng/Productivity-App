import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { EditorState, convertFromRaw, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import { useFirebaseOperations, Note } from '../../hooks/FirebaseOperations';
import { useAuth } from '../../context/AuthContext';
import { useMessage } from '../../context/MessageContext';
import styles from './NotePage.module.css';

const NotePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [note, setNote] = useState<Note | null>(null);
  const [title, setTitle] = useState('');
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const { currentUser } = useAuth();
  const { fetchNote, updateNote } = useFirebaseOperations();
  const { addMessage } = useMessage();

  useEffect(() => {
    if (currentUser && id) {
      loadNote();
    }
  }, [currentUser, id]);

  const loadNote = async () => {
    if (!currentUser || !id) return;
    try {
      const fetchedNote = await fetchNote(currentUser.uid, id);
      if (fetchedNote) {
        setNote(fetchedNote);
        setTitle(fetchedNote.title);
        const contentState = convertFromRaw(JSON.parse(fetchedNote.content));
        setEditorState(EditorState.createWithContent(contentState));
      } else {
        addMessage('Note not found');
        navigate('/brain-dump');
      }
    } catch (error) {
      console.error("Error fetching note: ", error);
      addMessage('Failed to load note. Please try again.');
    }
  };

  const handleSave = async () => {
    if (!currentUser || !note) return;
    const contentState = editorState.getCurrentContent();
    const rawContent = JSON.stringify(convertToRaw(contentState));
    const updatedNote: Note = {
      ...note,
      title,
      content: rawContent,
      timestamp: Date.now(),
    };
    try {
      await updateNote(currentUser.uid, updatedNote);
      addMessage('Note updated successfully');
    } catch (error) {
      console.error("Error updating note: ", error);
      addMessage('Failed to update note. Please try again.');
    }
  };


  if (!note) return <div>Loading...</div>;

  return (
    <div className={styles.notePageContainer}>
      <input
        type="text"
        className={styles.titleInput}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Note Title"
      />
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
          <button className={styles.addButton} onClick={handleSave}>Enter</button>
        </div>
      </div>
    </div>
  );
};

export default NotePage;