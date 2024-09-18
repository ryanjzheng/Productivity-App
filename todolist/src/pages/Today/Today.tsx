import React, { useEffect, useState, useCallback } from 'react';
import { useFirebaseOperations, Todo } from '../../hooks/FirebaseOperations';
import { useAuth } from '../../context/AuthContext';
import { useMessage } from '../../context/MessageContext';
import AddTaskButton from '../../components/AddTaskButton/AddTaskButton';
import { handleNotifications, requestNotificationPermission, clearNotification } from '../../utils/notificationScheduler';
import { getFirstName } from '../../utils/generalUtils';
import Task from './Task';
import styles from './Today.module.css';


const Today: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const { currentUser } = useAuth();
  const [greeting, setGreeting] = useState('');
  const { addMessage } = useMessage();
  const { fetchTodos, addTask, updateTask, deleteTask } = useFirebaseOperations();
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingTask, setIsAddingTask] = useState(false);


  useEffect(() => {
    requestNotificationPermission();
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    const loadTodos = async () => {
      setIsLoading(true);
      try {
        const fetchedTodos = await fetchTodos(currentUser.uid);
        setTodos(fetchedTodos);
        handleNotifications(fetchedTodos);
      } catch (error) {
        console.error("Error fetching user tasks: ", error);
        addMessage('Failed to load tasks. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadTodos();
  }, [currentUser, fetchTodos, addMessage]);


  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) setGreeting('Good Morning');
      else if (hour < 18) setGreeting('Good Afternoon');
      else setGreeting('Good Evening');
    };

    updateGreeting();
    const intervalId = setInterval(updateGreeting, 60000); // Update every minute

    return () => clearInterval(intervalId);
  }, []);

  const handleAddTask = () => {
    if (!isAddingTask) {
      const newTask = {
        id: `temp-${Date.now()}`,
        title: '',
        text: '',
        order: todos.length + 1,
        date: '',
        time: '',
      };
      setTodos(prevTodos => [...prevTodos, newTask]);
      setIsAddingTask(true);
    }
  };

  const handleDeleteTask = useCallback(async (taskId: string) => {
    if (!currentUser) return;

    try {
      await deleteTask(currentUser.uid, taskId);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== taskId));
      addMessage('Task Deleted');
    } catch (error) {
      console.error('Error deleting task: ', error);
      addMessage('Failed to delete task. Please try again.');
    }
  }, [currentUser, deleteTask, addMessage]);

  const handleSaveTask = useCallback(async (task: Todo) => {
    if (!currentUser) return;

    try {
      if (task.id && task.id.startsWith('temp-')) {
        // Only save the task if it has a title
        if (task.title.trim() !== '') {
          // Add new task
          const newTask = await addTask(currentUser.uid, task);
          setTodos(prevTodos => prevTodos.map(todo =>
            todo.id === task.id ? newTask : todo
          ));
          handleNotifications([newTask]);
          addMessage('Task Added');
        } else {
          // Remove the temporary task if it's empty
          setTodos(prevTodos => prevTodos.filter(todo => todo.id !== task.id));
        }
        setIsAddingTask(false);  // Reset the state after saving or removing the task
      } else if (task.id) {
        // Find the existing task
        const existingTask = todos.find(t => t.id === task.id);

        if (existingTask) {
          // Check if any changes were made
          const hasChanges = JSON.stringify(existingTask) !== JSON.stringify(task);

          if (hasChanges) {
            // Clear old notifications before updating task
            clearNotification(task.id);

            // Update existing task
            await updateTask(currentUser.uid, task);
            setTodos(prevTodos => prevTodos.map(todo =>
              todo.id === task.id ? task : todo
            ));
            handleNotifications([task]); // Reschedule notifications
            addMessage('Task Updated');
          }
          // If no changes, don't update or show a message
        }
      }
    } catch (error) {
      console.error('Error saving task: ', error);
      addMessage('Failed to save task. Please try again.');
    }
  }, [currentUser, addTask, updateTask, addMessage, todos]);


  const handleCancelNewTask = useCallback((taskId: string) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== taskId));
    setIsAddingTask(false);
  }, []);

  if (isLoading) {
    return <div>Loading tasks...</div>;
  }

  return (
    <div className={styles.todayPage}>
      <AddTaskButton onClick={handleAddTask} />
      <div className={styles.todayHeader}>
        <div className={styles.title}>
          {greeting}{currentUser?.displayName ? `, ${getFirstName(currentUser.displayName)}` : ''}
        </div>
      </div>

      {todos.length === 0 ? (
        <p>No tasks available.</p>
      ) : (
        todos.map((todo) => (
          <Task
            key={todo.id || Math.random()}
            todo={todo}
            onDelete={handleDeleteTask}
            onSave={handleSaveTask}
            onCancel={handleCancelNewTask}
          />
        ))
      )}
    </div>
  );
};

export default Today;