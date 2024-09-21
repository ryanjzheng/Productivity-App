import React, { useState, useEffect } from 'react';
import styles from './aiAssist.module.css';
import { model } from '../../firebaseConfig'; // Import the Gemini model

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

    const extractJsonFromMarkdown = (text: string): string => {
        const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
        return jsonMatch ? jsonMatch[1] : text;
    };

    const processUsingGemini = async (input: string): Promise<Task[]> => {
        try {
            const prompt = `Convert the following text into a list of tasks with titles, dates, and times (if specified):
            
            ${input}
            
            Format the response as a JSON array of objects, each with 'title', 'date', and 'time' properties. Use ISO date format (YYYY-MM-DD) for dates and 24-hour format (HH:mm) for times. If date or time is not specified, omit those properties. Do not include any markdown formatting or code block indicators in the response.`;

            const result = await model.generateContent(prompt);
            console.log("result", result);
            const response = result.response;
            const generatedText = response.text();
            console.log("Generated text:", generatedText);

            // Extract JSON from Markdown if necessary
            const jsonString = extractJsonFromMarkdown(generatedText);
            console.log("Extracted JSON string:", jsonString);

            // Parse the JSON string
            const tasks: Task[] = JSON.parse(jsonString);
            console.log("Parsed tasks:", tasks);

            return tasks;
        } catch (error) {
            console.error('Error processing input with Gemini:', error);
            if (error instanceof Error) {
                console.error('Error message:', error.message);
                console.error('Error stack:', error.stack);
            }
            return [];
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLInputElement>) => {
        e.preventDefault();
        const tasks = await processUsingGemini(input);
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