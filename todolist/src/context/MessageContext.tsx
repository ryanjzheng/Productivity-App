// MessageContext.tsx
import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface Message {
  id: number;
  text: string;
}

interface MessageContextProps {
  addMessage: (text: string) => void;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;  // Add this line
}

const MessageContext = createContext<MessageContextProps | undefined>(undefined);

export const MessageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);

  const addMessage = useCallback((text: string) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { id: Date.now(), text },
    ]);
  }, []);

  return (
    <MessageContext.Provider value={{ addMessage, messages, setMessages }}>
      {children}
    </MessageContext.Provider>
  );
};

export const useMessage = (): MessageContextProps => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('useMessage must be used within a MessageProvider');
  }
  return context;
};
