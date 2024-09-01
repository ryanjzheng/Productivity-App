// src/utils/NotificationScheduler.ts

import dayjs from 'dayjs';

interface Todo {
  id?: string;
  title: string;
  text: string;
  order: number;
  date?: string;
  time?: string;
}

// A map to store notification timeouts
const notificationTimeouts: { [key: string]: NodeJS.Timeout[] } = {};

const scheduleNotification = (todo: Todo) => {
  // Check if the task has a valid date and time
  if (!todo.date || !todo.time) return;

  const taskDateTime = dayjs(`${todo.date} ${todo.time}`, 'YYYY-MM-DD HH:mm');
  const now = dayjs();

  // Ensure the task's due date and time is in the future
  if (taskDateTime.isBefore(now)) return; // Don't schedule notifications for past tasks

  // Clear any existing notifications for this task
  if (notificationTimeouts[todo.id!]) {
    notificationTimeouts[todo.id!].forEach(clearTimeout);
  }

  // Schedule a notification 15 minutes before the task time
  const notificationTimeBefore = taskDateTime.subtract(15, 'minute').toDate();
  const notificationTimeExact = taskDateTime.toDate();

  // Use the Notification API or any other method (e.g., local notifications in mobile apps)
  if ('Notification' in window && Notification.permission === 'granted') {
    const timeoutBefore = setTimeout(() => {
      new Notification(`${todo.title} in 15 minutes`, {
        body: `Due at ${taskDateTime.format('HH:mm')}`,
      });
    }, notificationTimeBefore.getTime() - now.toDate().getTime());

    const timeoutExact = setTimeout(() => {
      new Notification(`Task Due Now: ${todo.title}`, {
        body: `It's time for your task.`,
      });
    }, notificationTimeExact.getTime() - now.toDate().getTime());

    // Store timeout IDs for possible future clearing
    notificationTimeouts[todo.id!] = [timeoutBefore, timeoutExact];
  }
};

export const handleNotifications = (todos: Todo[]) => {
  todos.forEach((todo) => scheduleNotification(todo));
};

export const requestNotificationPermission = () => {
  if ('Notification' in window) {
    Notification.requestPermission().then((permission) => {
      if (permission !== 'granted') {
        console.log('Notification permission denied');
      }
    });
  }
};

export const clearNotification = (todoId: string) => {
  if (notificationTimeouts[todoId]) {
    notificationTimeouts[todoId].forEach(clearTimeout);
    delete notificationTimeouts[todoId];
  }
};
