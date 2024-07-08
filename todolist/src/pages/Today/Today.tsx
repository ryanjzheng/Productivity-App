// TodoList.tsx
import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import TodoItem from './TodoItem';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

interface Todo {
  id: string;
  title: string;
  text: string;
  order: number;
}

const Today: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    const fetchTodos = async () => {
      const querySnapshot = await getDocs(collection(db, 'tasks'));
      const todosData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Todo[];
      setTodos(todosData.sort((a, b) => a.order - b.order));
    };

    fetchTodos();
  }, []);

  const moveItem = (dragIndex: number, hoverIndex: number) => {
    const draggedItem = todos[dragIndex];
    const updatedTodos = [...todos];
    updatedTodos.splice(dragIndex, 1);
    updatedTodos.splice(hoverIndex, 0, draggedItem);

    setTodos(updatedTodos);

    updatedTodos.forEach(async (todo, index) => {
      await updateDoc(doc(db, 'tasks', todo.id), { order: index });
    });
  };

  console.log("ryan:", todos);

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        {todos.map((todo, index) => (
          <TodoItem
            key={todo.id}
            id={todo.id}
            text={todo.title}
            index={index}
            moveItem={moveItem}
          />
        ))}
      </div>
    </DndProvider>
  );
};

export default Today;
