import { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

import NotSignedInGuard from './guards/NotSignedInGuard';
import SignedInGuard from './guards/SignedInGuard';
import DefaultLayout from './layouts/DefaultLayout';
import HeadlessLayout from './layouts/HeadlessLayout';
import CalendarPage from './pages/CalendarPage';
import HomePage from './pages/HomePage';
import LogsPage from './pages/LogsPage';
import NotFoundPage from './pages/NotFoundPage';
import PluginsPage from './pages/PluginsPage';
import SignInPage from './pages/SignInPage';
import routes from './shared/routes';

function ResourVereignApp() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path={routes.home} element={<SignedInGuard redirectTo={routes.signIn} />}>
          <Route element={<DefaultLayout />}>
            <Route path={routes.home} element={<HomePage />} />
            <Route path={routes.calendar} element={<CalendarPage />} />
            <Route path={routes.plugins} element={<PluginsPage />} />
            <Route path={routes.logs} element={<LogsPage />} />
          </Route>
        </Route>
        <Route path={routes.signIn} element={<NotSignedInGuard />}>
          <Route path="" element={<HeadlessLayout />}>
            <Route path="" element={<SignInPage />} />
          </Route>
        </Route>
        <Route path="*" element={<HeadlessLayout />}>
          <Route path="*" element={<NotFoundPage homeTo={routes.home} />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default ResourVereignApp;
