import classNames from 'classnames';
import { Outlet } from 'react-router-dom';

import styles from './index.module.css';

const HeadlessLayout = () => {
  return (
    <div
      className={classNames(
        styles.container,
        'w-screen h-screen flex align-items-center justify-content-center',
      )}
    >
      <Outlet />
    </div>
  );
};

export default HeadlessLayout;
