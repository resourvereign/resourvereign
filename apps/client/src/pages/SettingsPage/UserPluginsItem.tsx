import classNames from 'classnames';
import { Button } from 'primereact/button';

import { MyPlugin, PluginStatus } from '../../api/me/plugins';

type PluginActions = {
  onEdit: () => void;
  onDelete: () => void;
};

const UserPluginsItem = (plugin: MyPlugin & PluginActions) => {
  return (
    <div className="p-1 col-12 border-0">
      <div
        className={classNames('p-3 border-round shadow-2 flex align-items-center', {
          'bg-red-200': plugin.status === PluginStatus.disabled,
        })}
      >
        <div>
          <span className="text-900 text-xl font-medium mb-2">{plugin.label}</span>
          <p className="mt-1 mb-0 text-600 font-medium text-sm">{plugin.name}</p>
        </div>
        <div className="ml-auto">
          <Button
            className="mr-2"
            icon="pi pi-pencil"
            rounded
            severity="warning"
            onClick={plugin.onEdit}
          />
          <Button icon="pi pi-times" rounded severity="danger" onClick={plugin.onDelete} />
        </div>
      </div>
    </div>
  );
};

export default UserPluginsItem;
