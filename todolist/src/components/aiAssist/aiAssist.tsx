import React, { useState, useEffect } from 'react';
import nlp from 'compromise';
import styles from './aiAssist.module.css';

interface Task {
    title: string;
    date?: string;
    time?: string;
}

const AIAssistModal: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsOpen(prevState => !prevState);
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const processInputWithNLP = (input: string): Task[] => {
        const doc = nlp(input);
        const tasks: Task[] = [];

        // Look for phrases like "create task for X at Y on Z"
        doc.match('create task for #Noun+ (at #Time)? (on #Date)?').forEach(match => {
            const task: Task = {
                title: match.match('#Noun+').text(),
                time: match.match('#Time').text(),
                date: match.match('#Date').text()
            };
            tasks.push(task);
        });

        return tasks;
    };

    const processInputWithAI = async (input: string): Promise<Task[]> => {
        // This is where you'd call your AI service (e.g., OpenAI's GPT-3)
        // For demonstration, we'll just simulate an AI response
        console.log('Using AI to process:', input);

        // Simulated AI response - in reality, this would come from the AI service
        const aiTasks = input.split(',').map(task => ({ title: task.trim() }));

        return aiTasks;
    };

    const processInput = async (input: string): Promise<Task[]> => {
        let tasks = processInputWithNLP(input);

        if (tasks.length === 0) {
            // If NLP didn't find any tasks, use AI
            tasks = await processInputWithAI(input);
        }

        return tasks;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const tasks = await processInput(input);
        console.log('Created tasks:', tasks);
        // Here you would typically update your task management system
        setInput('');
        setIsOpen(false);
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.aiAssistModal}>
                <h2 className={styles.modalTitle}>AI Assist</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={input}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
                        placeholder="Enter your task instructions..."
                        className={styles.inputField}
                    />
                    <button type="submit" className={styles.submitButton}>
                        Submit
                    </button>
                </form>
            </div>
        </div>

    );
};

export default AIAssistModal;