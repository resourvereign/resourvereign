import classNames from 'classnames';
import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import AppMenu from '../../components/AppMenu';

import styles from './index.module.css';

const DefaultLayout = () => {
  return (
    <div
      className={classNames(
        styles.container,
        'min-h-screen flex relative lg:static surface-ground',
      )}
    >
      <AppMenu />
      <main className="min-h-screen flex flex-column relative flex-auto">
        <div className={classNames(styles.container, 'p-5 flex flex-column flex-auto')}>
          <div
            className={classNames(
              styles.container,
              'border-3 border surface-border border-round surface-section flex-auto p-5',
            )}
          >
            <Suspense fallback={<div>Loading...</div>}>
              <Outlet />
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DefaultLayout;
