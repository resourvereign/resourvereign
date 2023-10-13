import { Button } from 'primereact/button';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { useCallback, useState } from 'react';

import { MyPlugin, MyPluginData } from '../../api/me/plugins';
import { Plugin, PluginSchema, PluginType } from '../../api/plugins';
import useMyPlugins from '../../hooks/useMyPlugins';
import usePlugins from '../../hooks/usePlugins';

import EditPlugin from './EditPlugin';
import UserPluginsList from './UserPluginsList';

type PluginTypeSectionProps = {
  pluginType: PluginType;
};
const PluginTypeSection = ({ pluginType }: PluginTypeSectionProps) => {
  const plugins = usePlugins().data?.[pluginType];
  const { remove } = useMyPlugins();
  const [selectedPlugin, setSelectedPlugin] = useState<Plugin>();
  const [editingPlugin, setEditingPlugin] = useState<[PluginSchema, MyPluginData]>();

  const handlePluginChange = useCallback((e: DropdownChangeEvent) => {
    setSelectedPlugin(e.value);
  }, []);

  const handleAddPlugin = useCallback(() => {
    if (selectedPlugin) {
      setEditingPlugin([
        selectedPlugin.schema,
        {
          type: selectedPlugin.type,
          name: selectedPlugin.name,
          label: '',
          config: {},
        },
      ]);
    }
  }, [selectedPlugin]);

  const handleEditPluginFinished = useCallback(() => {
    setEditingPlugin(undefined);
  }, []);

  const handlePluginEdit = useCallback(
    (plugin: MyPlugin) => {
      const pluginSchema = plugins?.find((p) => p.name === plugin.name)?.schema;
      if (pluginSchema) {
        setEditingPlugin([pluginSchema, plugin]);
      }
    },
    [plugins],
  );

  const handlePluginDelete = useCallback(
    (plugin: MyPlugin) => {
      if (window.confirm(`Are you sure you want to delete ${plugin.label}?`)) {
        remove(plugin.id);
      }
    },
    [remove],
  );

  return (
    <div className="h-full w-full flex flex-row">
      <div className="h-full w-full text-center flex flex-column align-items-center justify-content-center">
        <UserPluginsList
          type={pluginType}
          onPluginEdit={handlePluginEdit}
          onPluginDelete={handlePluginDelete}
        />

        <div className="mt-3">
          <Dropdown
            options={plugins}
            value={selectedPlugin}
            optionLabel="name"
            onChange={handlePluginChange}
            className="mr-2"
            placeholder="Select a plugin"
          />
          <Button
            icon="pi pi-plus"
            disabled={selectedPlugin === undefined}
            onClick={handleAddPlugin}
          />
        </div>
      </div>
      <div className="h-full mx-3 border-left-1 surface-border" />
      <div className="h-full w-full flex align-items-center justify-content-center h-full overflow-auto">
        {editingPlugin && (
          <EditPlugin
            key={(editingPlugin as any).id}
            schema={editingPlugin[0]}
            plugin={editingPlugin[1]}
            onFinished={handleEditPluginFinished}
          />
        )}
      </div>
    </div>
  );
};

export default PluginTypeSection;
