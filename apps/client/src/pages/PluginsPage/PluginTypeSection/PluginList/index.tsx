import { DataView } from 'primereact/dataview';

import { MyPlugin, PluginType } from '../../../../api/me/plugins';
import useMyPlugins from '../../../../hooks/useMyPlugins';

import PluginItem from './PluginItem';

type PluginListProps = {
  type: PluginType;
  onPluginEdit: (plugin: MyPlugin) => void;
  onPluginDelete: (plugin: MyPlugin) => void;
};

const PluginList = ({ type, onPluginEdit, onPluginDelete }: PluginListProps) => {
  const myPlugins = useMyPlugins().byType[type];

  return (
    <DataView
      className="w-full"
      value={myPlugins.map((p) => ({
        ...p,
        onEdit: () => onPluginEdit(p),
        onDelete: () => onPluginDelete(p),
      }))}
      itemTemplate={PluginItem}
    />
  );
};

export default PluginList;
