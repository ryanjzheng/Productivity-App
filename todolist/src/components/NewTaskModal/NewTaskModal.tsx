// NewTaskModal.tsx
import React, { useEffect, useRef } from 'react';
import './NewTaskModal.css';

interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: () => void;
  newTaskTitle: string;
  setNewTaskTitle: React.Dispatch<React.SetStateAction<string>>;
  newTaskDescription: string;
  setNewTaskDescription: React.Dispatch<React.SetStateAction<string>>;
}

const NewTaskModal: React.FC<NewTaskModalProps> = ({
  isOpen,
  onClose,
  onAddTask,
  newTaskTitle,
  setNewTaskTitle,
  newTaskDescription,
  setNewTaskDescription
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content" ref={modalRef}>
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Add New Task</h2>
        <input
          type="text"
          placeholder="Title"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
        />
        <textarea
          placeholder="Description"
          value={newTaskDescription}
          onChange={(e) => setNewTaskDescription(e.target.value)}
        ></textarea>
        <button onClick={onAddTask}>Add</button>
      </div>
    </div>
  );
};

export default NewTaskModal;
