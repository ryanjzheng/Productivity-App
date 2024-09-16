import React, { useEffect, useState, useCallback  } from 'react';
import { useFirebaseOperations, Todo } from '../../hooks/FirebaseOperations';
import { useAuth } from '../../context/AuthContext';
import { useMessage } from '../../context/MessageContext';
import AddTaskButton from '../../components/AddTaskButton/AddTaskButton';
import { handleNotifications, requestNotificationPermission, clearNotification } from '../../utils/notificationScheduler';
import Task from './Task';
import styles from './Today.module.css';


const Today: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const { currentUser } = useAuth();
  const { addMessage } = useMessage();
  const { fetchTodos, addTask, updateTask, deleteTask } = useFirebaseOperations();
  const [isLoading, setIsLoading] = useState(true);



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

  const handleAddTask = () => {
    const newTask = {
      id: `temp-${Date.now()}`,
      title: '',
      text: '',
      order: todos.length + 1,
      date: '',
      time: '', 
    };
    setTodos(prevTodos => [...prevTodos, newTask]);
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
      } else if (task.id) {
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
    } catch (error) {
      console.error('Error saving task: ', error);
      addMessage('Failed to save task. Please try again.');
    }
  }, [currentUser, addTask, updateTask, addMessage]);
  

  const handleCancelNewTask = useCallback((taskId: string) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== taskId));
  }, []);

  if (isLoading) {
    return <div>Loading tasks...</div>;
  }
  

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