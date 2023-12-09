import { Toast, ToastMessage } from 'primereact/toast';
import { PropsWithChildren, useRef } from 'react';

import NotificaitonsContext, { NotificationsContextType } from './NotificationsContext';

type NotificationsProviderProps = PropsWithChildren<{
  delay?: number;
}>;

const NotificationsProvider = ({ children, delay = 5000 }: NotificationsProviderProps) => {
  const toastRef = useRef<Toast>(null);

  const showToast = (severity: ToastMessage['severity']) => (summary: string, detail: string) => {
    toastRef.current?.show({ severity, summary, detail, life: delay });
  };

  const severities = ['success', 'info', 'warn', 'error'] as const;

  return (
    <NotificaitonsContext.Provider
      value={severities.reduce(
        (acc, severity) => ({ ...acc, [severity]: showToast(severity) }),
        {} as NotificationsContextType,
      )}
    >
      <Toast ref={toastRef} />
      {children}
    </NotificaitonsContext.Provider>
  );
};

export default NotificationsProvider;
