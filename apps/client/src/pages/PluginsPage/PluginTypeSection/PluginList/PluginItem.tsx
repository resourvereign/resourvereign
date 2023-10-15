import classNames from 'classnames';
import { Button } from 'primereact/button';
import { Menu } from 'primereact/menu';
import { useCallback, useRef } from 'react';
import { MouseEvent } from 'react';

import { MyPlugin, PluginStatus } from '../../../../api/me/plugins';

type PluginActions = {
  onEdit: () => void;
  onDelete: () => void;
};

const PluginItem = ({ status, label, name, onEdit, onDelete }: MyPlugin & PluginActions) => {
  const menu = useRef<Menu>(null);
  const handleMenuClicked = useCallback((e: MouseEvent) => {
    menu.current?.toggle(e);
  }, []);

  const disabled = status === PluginStatus.disabled;

  const menuItems = [
    {
      label: 'Edit',
      disabled,
      icon: 'pi pi-pencil',
      command: () => {
        onEdit();
      },
    },
    {
      label: 'Remove',
      icon: 'pi pi-trash',
      command: () => {
        onDelete();
      },
    },
  ];

  return (
    <div className="p-1 col-12 border-0">
      <div
        className={classNames('p-3 border-round shadow-2 flex align-items-center', {
          'bg-red-200': disabled,
        })}
      >
        <div>
          <span className="text-900 text-xl font-medium mb-2">{label}</span>
          <p className="mt-1 mb-0 text-600 font-medium text-sm">{name}</p>
        </div>
        <div className="ml-auto">
          <Button
            icon="pi pi-ellipsis-v"
            rounded
            raised
            outlined
            severity="secondary"
            onClick={handleMenuClicked}
          />
        </div>
      </div>

      <Menu model={menuItems} popup ref={menu} />
    </div>
  );
};

export default PluginItem;
