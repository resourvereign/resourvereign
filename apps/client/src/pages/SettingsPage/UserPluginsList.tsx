import { DataView } from 'primereact/dataview';

import { MyPlugin, PluginType } from '../../api/me/plugins';
import useMyPlugins from '../../hooks/useMyPlugins';

import UserPluginsItem from './UserPluginsItem';

type UserPluginsListProps = {
  type: PluginType;
  onPluginEdit: (plugin: MyPlugin) => void;
  onPluginDelete: (plugin: MyPlugin) => void;
};

const UserPluginsList = ({ type, onPluginEdit, onPluginDelete }: UserPluginsListProps) => {
  const myPlugins = useMyPlugins().byType[type];

  return (
    <DataView
      value={myPlugins.map((p) => ({
        ...p,
        onEdit: () => onPluginEdit(p),
        onDelete: () => onPluginDelete(p),
      }))}
      itemTemplate={UserPluginsItem}
      className="w-full"
    />
  );
};

export default UserPluginsList;
