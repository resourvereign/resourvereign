import { useTranslation } from 'react-i18next';

import routes from '../../shared/routes';

import DesktopMenu from './DesktopMenu';
import { MenuItem } from './shared';

const AppMenu = () => {
  const { t } = useTranslation('menu');

  const menuItems: MenuItem[] = [
    {
      label: t('items.home'),
      to: routes.home,
      icon: 'pi-home',
    },
    {
      label: t('items.calendar'),
      to: routes.calendar,
      icon: 'pi-calendar',
    },
    {
      label: t('items.tasks'),
      to: routes.tasks,
      icon: 'pi-sync',
    },
    {
      label: t('items.plugins'),
      to: routes.plugins,
      icon: 'pi-cog',
    },
    {
      label: t('items.logs'),
      to: routes.logs,
      icon: 'pi-align-left',
    },
  ];

  return <DesktopMenu items={menuItems} home={routes.home} />;
};

export default AppMenu;
