import classNames from 'classnames';
import { Button } from 'primereact/button';
import { NavLink } from 'react-router-dom';

import useAuthStore from '../../hooks/useAuthStore';

import styles from './DesktopMenu.module.css';
import { MenuItem } from './shared';

const Item = ({ icon, label, to }: MenuItem) => {
  return (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) =>
          classNames(
            styles.item,
            'flex flex-column align-items-center cursor-pointer p-3 justify-content-center hover:bg-purple-700 border-round text-gray-300 hover:text-white transition-duration-150 transition-colors w-full no-underline',
            { 'bg-purple-800 text-white': isActive },
          )
        }
      >
        <i className={classNames(icon, 'pi mr-0 mb-2 text-lg')} />
        <span className="font-medium text-xs block">{label}</span>
      </NavLink>
    </li>
  );
};

type DesktopMenuProps = {
  home: string;
  items: MenuItem[];
};

const DesktopMenu = ({ home, items }: DesktopMenuProps) => {
  const { logout } = useAuthStore();

  return (
    <div
      className={classNames(
        styles.desktopMenu,
        'bg-gray-900 h-screen flex-shrink-0 static left-0 top-0 z-1 border-right-1 border-gray-800 w-6rem select-none flex flex-column h-full',
      )}
    >
      <div
        className={classNames(
          styles.main,
          'flex align-items-center justify-content-center flex-shrink-0 bg-purple-500',
        )}
      >
        <NavLink to={home} className="no-underline">
          <img src="/ResourVereign.png" alt="ResourVereign" />
        </NavLink>
      </div>
      <ul className={classNames(styles.itemsList, 'list-none px-0 py-2 m-0 mt-3')}>
        {items.map((item) => (
          <Item key={item.to} {...item} />
        ))}
      </ul>
      <div className={classNames(styles.footer, 'mt-auto mx-3 mb-3')}>
        <hr className="mb-3 border-top-1 border-gray-800" />
        <Button onClick={logout}>
          <i className="pi pi-power-off" />
        </Button>
      </div>
    </div>
  );
};

export default DesktopMenu;
