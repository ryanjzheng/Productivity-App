import React, { useEffect, useState, useRef } from 'react';
import { collection, getDocs, addDoc } from 'firebase/firestore';
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
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskText, setNewTaskText] = useState('');
  const { currentUser } = useAuth();
  const titleInputRef = useRef<HTMLInputElement>(null);

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

  const handleAddTask = () => {
    setIsAddingTask(true);
    setTimeout(() => {
      titleInputRef.current?.focus(); // Focus on the task title input after showing the form
    }, 0);
  }

  const handleSaveTask = async () => {
    if (!currentUser) return; // Safety check

    // Create a new task object
    const newTask: Omit<Todo, 'id'> = {
      title: newTaskTitle,
      text: newTaskText,
      order: todos.length + 1, // Set the order to the next integer
    };

    try {
      // Add the new task to Firestore
      const userTasksRef = collection(db, 'users', currentUser.uid, 'tasks');
      const docRef = await addDoc(userTasksRef, newTask);

      // Update the local state with the new task
      setTodos((prevTodos) => [...prevTodos, { id: docRef.id, ...newTask }].sort((a, b) => a.order - b.order));

      // Reset form and hide it
      setNewTaskTitle('');
      setNewTaskText('');
      setIsAddingTask(false);
    } catch (error) {
      console.error("Error adding new task: ", error);
    }
  };

    // Handle Enter key press for the form inputs
    const handleKeyPress = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleSaveTask();
      }
    };

  return (
    <div className={styles.todayPage}>
      <AddTaskButton onClick={handleAddTask} />

      {todos.length === 0 ? (
        <p>No tasks available.</p>
      ) : (
        todos.map((todo) => (
          <div key={todo.id}>
            <h3>{todo.title}</h3>
            <p>{todo.text}</p>
          </div>
        ))
      )}

      {isAddingTask && (
        <div className={styles.addTaskForm}>
          <input
            type="text"
            placeholder="Task Title"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            ref={titleInputRef} // Attach the ref to the title input
            onKeyPress={handleKeyPress} // Listen for key presses
          />
          <input
            placeholder="Task Description"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            onKeyPress={handleKeyPress} // Listen for key presses

          />
          <button onClick={handleSaveTask}>Complete</button>
        </div>
      )}
    </div>
  );
};

export default Today;
