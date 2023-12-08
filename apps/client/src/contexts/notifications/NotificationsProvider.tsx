import { Toast, ToastMessage } from 'primereact/toast';
import { PropsWithChildren, useRef } from 'react';

import NotificaitonsContext, { NotificationsContextType } from './NotificationsContext';

const NotificationsProvider = ({ children }: PropsWithChildren) => {
  const toastRef = useRef<Toast>(null);

  const showToast = (severity: ToastMessage['severity']) => (summary: string, detail: string) => {
    toastRef.current?.show({ severity, summary, detail });
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
