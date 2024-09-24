import { useState, useCallback } from 'react';
import { collection, getDocs, getDoc, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export interface Todo {
  id?: string;
  title: string;
  text: string;
  order: number;
  date?: string;
  time?: string;
}

export interface Note {
  id?: string;
  title: string;
  content: string;
  timestamp: number;
}


export const useFirebaseOperations = () => {
  const [error, setError] = useState<string | null>(null);

  //Tasks

  const fetchTodos = useCallback(async (userId: string): Promise<Todo[]> => {
    try {
      const userTasksRef = collection(db, 'users', userId, 'tasks');
      const q = query(userTasksRef, orderBy('order'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Todo));
    } catch (err) {
      setError('Failed to fetch todos');
      throw err;
    }
  }, []);

  const addTask = useCallback(async (userId: string, task: Todo): Promise<Todo> => {
    try {
      const userTasksRef = collection(db, 'users', userId, 'tasks');
      const docRef = await addDoc(userTasksRef, {
        title: task.title,
        text: task.text,
        order: task.order,
        date: task.date,
        time: task.time,
      });
      return { ...task, id: docRef.id };
    } catch (err) {
      setError('Failed to add task');
      throw err;
    }
  }, []);

  const updateTask = useCallback(async (userId: string, task: Todo): Promise<void> => {
    try {
      if (!task.id) throw new Error('Task ID is required for update');
      const taskDocRef = doc(db, 'users', userId, 'tasks', task.id);
      await updateDoc(taskDocRef, {
        title: task.title,
        text: task.text,
        order: task.order,
        date: task.date,
        time: task.time,
      });
    } catch (err) {
      setError('Failed to update task');
      throw err;
    }
  }, []);

  const deleteTask = useCallback(async (userId: string, taskId: string): Promise<void> => {
    try {
      const taskDocRef = doc(db, 'users', userId, 'tasks', taskId);
      await deleteDoc(taskDocRef);
    } catch (err) {
      setError('Failed to delete task');
      throw err;
    }
  }, []);


  //Notes

  const fetchNotes = useCallback(async (userId: string): Promise<Note[]> => {
    try {
      const userNotesRef = collection(db, 'users', userId, 'brainDump');
      const q = query(userNotesRef, orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Note));
    } catch (err) {
      setError('Failed to fetch notes');
      throw err;
    }
  }, []);

  const fetchNote = useCallback(async (userId: string, noteId: string): Promise<Note | null> => {
    try {
      const noteDocRef = doc(db, 'users', userId, 'brainDump', noteId);
      const noteDoc = await getDoc(noteDocRef);
      if (noteDoc.exists()) {
        return { id: noteDoc.id, ...noteDoc.data() } as Note;
      }
      return null;
    } catch (err) {
      setError('Failed to fetch note');
      throw err;
    }
  }, []);

  const addNote = useCallback(async (userId: string, note: Note): Promise<Note> => {
    try {
      const userNotesRef = collection(db, 'users', userId, 'brainDump');
      const docRef = await addDoc(userNotesRef, {
        title: note.title,
        content: note.content,
        timestamp: note.timestamp,
      });
      return { ...note, id: docRef.id };
    } catch (err) {
      setError('Failed to add note');
      throw err;
    }
  }, []);

  const updateNote = useCallback(async (userId: string, note: Note): Promise<void> => {
    try {
      if (!note.id) throw new Error('Note ID is required for update');
      const noteDocRef = doc(db, 'users', userId, 'brainDump', note.id);
      await updateDoc(noteDocRef, {
        title: note.title,
        content: note.content,
        timestamp: note.timestamp,
      });
    } catch (err) {
      setError('Failed to update note');
      throw err;
    }
  }, []);

  const deleteNote = useCallback(async (userId: string, noteId: string): Promise<void> => {
    try {
      const noteDocRef = doc(db, 'users', userId, 'brainDump', noteId);
      await deleteDoc(noteDocRef);
    } catch (err) {
      setError('Failed to delete note');
      throw err;
    }
  }, []);

  return {
    fetchTodos,
    addTask,
    updateTask,
    deleteTask,
    error,
    fetchNotes,
    fetchNote,
    addNote,
    updateNote,
    deleteNote,
  };
};