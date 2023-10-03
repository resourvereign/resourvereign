import { DataView } from 'primereact/dataview';

import { MyPlugin } from '../../api/me';
import useMyPlugins from '../../hooks/useMyPlugins';

import UserPluginsItem from './UserPluginsItem';

type UserPluginsListProps = {
  onPluginEdit: (plugin: MyPlugin) => void;
  onPluginDelete: (plugin: MyPlugin) => void;
};

const UserPluginsList = ({ onPluginEdit, onPluginDelete }: UserPluginsListProps) => {
  const { data: myPlugins } = useMyPlugins();

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
