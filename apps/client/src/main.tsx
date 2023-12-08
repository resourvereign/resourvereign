import { PrimeReactProvider } from 'primereact/api';
import { StrictMode } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import ResourVereignApp from './ResourVereignApp';
import NotificationsProvider from './contexts/notifications/NotificationsProvider';
import './i18n';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <PrimeReactProvider>
        <DndProvider backend={HTML5Backend}>
          <NotificationsProvider>
            <ResourVereignApp />
          </NotificationsProvider>
        </DndProvider>
      </PrimeReactProvider>
    </BrowserRouter>
  </StrictMode>,
);
