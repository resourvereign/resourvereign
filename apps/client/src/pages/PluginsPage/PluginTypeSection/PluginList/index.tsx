import { DataView } from 'primereact/dataview';

import {
  PluginType,
  UserPlugin,
  UserPluginData,
  userPluginToUpdate,
} from '../../../../api/me/plugins';
import useUserPlugins from '../../../../hooks/useUserPlugins';

import PluginItem from './PluginItem';

type PluginListProps = {
  type: PluginType;
  onPluginEdit: (plugin: UserPluginData) => void;
  onPluginDelete: (plugin: UserPlugin) => void;
};

const PluginList = ({ type, onPluginEdit, onPluginDelete }: PluginListProps) => {
  const userPlugins = useUserPlugins().byType[type];

  return (
    <DataView
      className="w-full"
      value={userPlugins.map((p) => ({
        ...p,
        onEdit: () => onPluginEdit(userPluginToUpdate(p)),
        onDelete: () => onPluginDelete(p),
      }))}
      itemTemplate={PluginItem}
    />
  );
};

export default PluginList;
