import React, { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { useAuth } from '../../context/AuthContext';
import { useMessage } from '../../context/MessageContext';
import AddTaskButton from '../../components/AddTaskButton/AddTaskButton';
import { handleNotifications, requestNotificationPermission, clearNotification } from '../../utils/notificationScheduler';
import Task from './Task';
import styles from './Today.module.css';

interface Todo {
  id?: string;
  title: string;
  text: string;
  order: number;
  date?: string;
  time?: string;
}

const Today: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const { currentUser } = useAuth();
  const { addMessage } = useMessage();

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    const fetchTodos = async () => {
      try {
        const userTasksRef = collection(db, 'users', currentUser.uid, 'tasks');
        const querySnapshot = await getDocs(userTasksRef);
        const todosData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Todo[];

        const sortedTodos = todosData.sort((a, b) => a.order - b.order);
        setTodos(sortedTodos);
  
        // Schedule notifications for fetched tasks
        handleNotifications(sortedTodos);
      } catch (error) {
        console.error("Error fetching user tasks: ", error);
      }
    };

    fetchTodos();
  }, [currentUser]);

  const handleAddTask = () => {
    const newTask = {
      id: `temp-${Date.now()}`, // Temporary ID for the new task
      title: '',
      text: '',
      order: todos.length + 1,
      date: '',  // Initialize date
      time: '',  // Initialize time
    };
    setTodos(prevTodos => [...prevTodos, newTask]);
  };
  

  const handleDeleteTask = async (taskId: string) => {
    if (!currentUser) return;

    try {
      const taskDocRef = doc(db, 'users', currentUser.uid, 'tasks', taskId);
      await deleteDoc(taskDocRef);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== taskId));
      addMessage('Task Deleted');
    } catch (error) {
      console.error('Error deleting task: ', error);
    }
  };

  const handleSaveTask = async (task: Todo) => {
    if (!currentUser) return;

    try {
        if (task.id && task.id.startsWith('temp-')) {
            // Add new task
            const userTasksRef = collection(db, 'users', currentUser.uid, 'tasks');
            const docRef = await addDoc(userTasksRef, {
                title: task.title,
                text: task.text,
                order: task.order,
                date: task.date, // Include date
                time: task.time, // Include time
            });
            const updatedTodos = todos.map((todo) =>
                todo.id === task.id ? { ...task, id: docRef.id } : todo
            );
            setTodos(updatedTodos);
            handleNotifications(updatedTodos); // Reschedule notifications

            addMessage('Task Added');
        } else if (task.id) {
            // Clear old notifications before updating task
            clearNotification(task.id);

            // Update existing task
            const taskDocRef = doc(db, 'users', currentUser.uid, 'tasks', task.id);
            await updateDoc(taskDocRef, {
                title: task.title,
                text: task.text,
                order: task.order,
                date: task.date, // Include date
                time: task.time, // Include time
            });
            const updatedTodos = todos.map((todo) => (todo.id === task.id ? task : todo));
            setTodos(updatedTodos);
            handleNotifications(updatedTodos); // Reschedule notifications

            addMessage('Task Updated');
        }
    } catch (error) {
        console.error('Error saving task: ', error);
    }
};
  

  const handleCancelNewTask = (taskId: string) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== taskId));
  };
  

  return (
    <div className={styles.todayPage}>
      <AddTaskButton onClick={handleAddTask} />
      <div className={styles.todayHeader}>
        <div className={styles.title}>Today</div>
      </div>

      {todos.length === 0 ? (
        <p>No tasks available.</p>
      ) : (
        todos.map((todo) => (
          <Task
            key={todo.id || Math.random()} // Use Math.random() as key for new tasks without an id
            todo={todo}
            onDelete={handleDeleteTask}
            onSave={handleSaveTask}
            onCancel={handleCancelNewTask} // Pass cancel handler
          />
        ))
      )}
    </div>
  );
};

export default Today;
