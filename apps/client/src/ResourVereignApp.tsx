import { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

import DefaultLayout from './layouts/DefaultLayout';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';

function ResourVereignApp() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<DefaultLayout />}>
          <Route path="" element={<HomePage />} />
        </Route>
        <Route path="*" element={<NotFoundPage homeTo="/" />} />
      </Routes>
    </Suspense>
  );
}

export default ResourVereignApp;
