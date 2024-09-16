import { useState, useCallback } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export interface Todo {
  id?: string;
  title: string;
  text: string;
  order: number;
  date?: string;
  time?: string;
}

export const useFirebaseOperations = () => {
  const [error, setError] = useState<string | null>(null);

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

  return {
    fetchTodos,
    addTask,
    updateTask,
    deleteTask,
    error,
  };
};