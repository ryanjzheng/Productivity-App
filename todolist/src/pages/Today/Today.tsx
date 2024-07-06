// src/pages/Today.tsx
import React, { useEffect, useState } from 'react';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import styles from './Today.module.css';
import { useAuth } from '../../context/AuthContext';

interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

const TodayPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTypingAnimationVisible, setIsTypingAnimationVisible] = useState(false);
  const { currentUser, logout } = useAuth();

  useEffect(() => {
    const fetchTasks = async () => {
      const tasksCollection = collection(db, 'tasks');
      const tasksSnapshot = await getDocs(tasksCollection);
      const tasksList = tasksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task));
      setTasks(tasksList);
      setIsTypingAnimationVisible(true); // Trigger the typing animation after tasks are loaded
    };
    fetchTasks();
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 't' || event.key === 'T') {
        setIsModalOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleAddTask = async () => {
    const newTask = {
      title: newTaskTitle,
      description: newTaskDescription,
      completed: false,
    };
    try {
      const docRef = await addDoc(collection(db, 'tasks'), newTask);
      setTasks([...tasks, { id: docRef.id, ...newTask }]);
      setNewTaskTitle('');
      setNewTaskDescription('');
      setIsModalOpen(false);
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };

  const openModalToAddTask = () => {
    setIsModalOpen(true);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className={styles.todayPage}>
      <h1>Welcome, {currentUser?.email}</h1>
      <button onClick={handleLogout} className={styles.logoutButton}>Sign Out</button>
      <ul className={styles.taskList}>
        {tasks.map(task => (
          <li key={task.id} className={styles.taskItem}>
            <h2>{task.title}</h2>
            <p>{task.description}</p>
          </li>
        ))}
      </ul>
      <button onClick={openModalToAddTask} className={styles.addButton}>
        Add Tasks
      </button>

      {isTypingAnimationVisible && (
        <div className={styles.typing}>
          press 't' to create a new task
        </div>
      )}
    </div>
  );
};

export default TodayPage;
