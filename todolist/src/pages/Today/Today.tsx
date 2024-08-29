import React, { useEffect, useState, useRef, useCallback  } from 'react';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { useAuth } from '../../context/AuthContext';
import AddTaskButton from '../../components/AddTaskButton/AddTaskButton';
import styles from './Today.module.css'

interface Todo {
  id: string;
  title: string;
  text: string;
  order: number;
}

const Today: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [editingTask, setEditingTask] = useState<Todo | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskText, setNewTaskText] = useState('');
  const { currentUser } = useAuth();
  const titleInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!currentUser) return;

    const fetchTodos = async () => {
      try {
        const userTasksRef = collection(db, 'users', currentUser.uid, 'tasks');
        const querySnapshot = await getDocs(userTasksRef);

        const todosData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Todo[];

        setTodos(todosData.sort((a, b) => a.order - b.order)); // Sort tasks by order
      } catch (error) {
        console.error("Error fetching user tasks: ", error);
      }
    };

    fetchTodos();
  }, [currentUser]);

  const closeForm = () => {
    setIsAddingTask(false);
    setEditingTask(null);
    setNewTaskTitle('');
    setNewTaskText('');
  };

  const handleAddTask = () => {
    setIsAddingTask(true);
    setEditingTask(null); // Ensure no task is being edited when adding a new one
    setNewTaskTitle('');
    setNewTaskText('');
    setTimeout(() => {
      titleInputRef.current?.focus(); // Focus on the task title input after showing the form
    }, 0);
  }

  const handleSaveTask = async () => {
    if (!currentUser) return;

    if (editingTask) {
      // If a task is being edited, update it
      try {
        const taskDocRef = doc(db, 'users', currentUser.uid, 'tasks', editingTask.id);
        await updateDoc(taskDocRef, {
          title: newTaskTitle,
          text: newTaskText,
        });

        setTodos((prevTodos) =>
          prevTodos.map((todo) =>
            todo.id === editingTask.id ? { ...todo, title: newTaskTitle, text: newTaskText } : todo
          )
        );

        setEditingTask(null);
        setIsAddingTask(false);
        setNewTaskTitle('');
        setNewTaskText('');
      } catch (error) {
        console.error("Error updating task: ", error);
      }
    } else {
      // If no task is being edited, add a new one
      const newTask: Omit<Todo, 'id'> = {
        title: newTaskTitle,
        text: newTaskText,
        order: todos.length + 1,
      };

      try {
        const userTasksRef = collection(db, 'users', currentUser.uid, 'tasks');
        const docRef = await addDoc(userTasksRef, newTask);

        setTodos((prevTodos) => [...prevTodos, { id: docRef.id, ...newTask }].sort((a, b) => a.order - b.order));
        setNewTaskTitle('');
        setNewTaskText('');
        setIsAddingTask(false);
      } catch (error) {
        console.error("Error adding new task: ", error);
      }
    }
  };

  const handleEditTask = (task: Todo) => {
    setEditingTask(task); // Set the task to be edited
    setIsAddingTask(true); // Show the form
    setNewTaskTitle(task.title);
    setNewTaskText(task.text);
    setTimeout(() => {
      titleInputRef.current?.focus(); // Focus on the task title input after showing the form
    }, 0);
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!currentUser) return;

    try {
      const taskDocRef = doc(db, 'users', currentUser.uid, 'tasks', taskId);
      await deleteDoc(taskDocRef);

      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== taskId)); // Remove task from state
    } catch (error) {
      console.error("Error deleting task: ", error);
    }
  };

  // Handle Enter key press for the form inputs
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveTask();
    }
  };

  const handleEscapePress = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeForm();
    }
  }, []);


  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (formRef.current && !formRef.current.contains(e.target as Node)) {
      closeForm();
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleEscapePress);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleEscapePress);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleEscapePress, handleClickOutside]);

  return (
    <div className={styles.todayPage}>
      <AddTaskButton onClick={handleAddTask} />

      {todos.length === 0 ? (
        <p>No tasks available.</p>
      ) : (
        todos.map((todo) => (
          <div key={todo.id} className={styles.taskContainer}>
            <input className={styles.checkbox}
              type="checkbox"
              onChange={() => handleDeleteTask(todo.id)} // Delete task when checkbox is checked
            />
            <div onClick={() => handleEditTask(todo)} className={styles.taskContent}>
              <h3>{todo.title}</h3>
              <p>{todo.text}</p>
            </div>
          </div>
        ))
      )}

      {(isAddingTask || editingTask) && ( // Show the form if adding a task or editing a task
        <div className={styles.addTaskForm} ref={formRef}>
          <input
            type="text"
            placeholder="Task Title"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            ref={titleInputRef}
            onKeyPress={handleKeyPress}
          />
          <input
            placeholder="Task Description"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button onClick={handleSaveTask}>{editingTask ? 'Update' : 'Add'}</button>
        </div>
      )}
    </div>
  );
};

export default Today;
