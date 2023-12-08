import { useContext } from 'react';

import NotificaitonsContext from '../contexts/notifications/NotificationsContext';

export const useNotifications = () => {
  const context = useContext(NotificaitonsContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return {
    ...context,
  };
};

export default useNotifications;
