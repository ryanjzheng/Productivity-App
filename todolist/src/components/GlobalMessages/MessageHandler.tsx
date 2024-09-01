// MessageHandler.tsx
import React, { useEffect } from 'react';
import { useMessage } from '../../context/MessageContext';

const MessageHandler: React.FC = () => {
  const { messages, setMessages } = useMessage();  // Include setMessages here

  useEffect(() => {
    if (messages.length > 0) {
      const timer = setTimeout(() => {
        // Remove the first message after 3 seconds
        setMessages((prevMessages) => prevMessages.slice(1));
      }, 2000); // Adjust the time (in ms) to control how long the message stays visible

      return () => clearTimeout(timer);
    }
  }, [messages, setMessages]);

  return (
    <div style={{ position: 'fixed', bottom: '10px', right: '20px' }}>
      {messages.map((message) => (
        <div key={message.id} style={{ marginBottom: '8px', backgroundColor: '#333', color: '#fff', padding: '10px', borderRadius: '4px' }}>
          {message.text}
        </div>
      ))}
    </div>
  );
};

export default MessageHandler;
