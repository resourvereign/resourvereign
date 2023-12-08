import { createContext } from 'react';

export type NotificationsContextType = {
  success: (summary: string, detail: string) => void;
  info: (summary: string, detail: string) => void;
  warn: (summary: string, detail: string) => void;
  error: (summary: string, detail: string) => void;
};

const NotificationsContext = createContext<NotificationsContextType | null>(null);

export default NotificationsContext;
