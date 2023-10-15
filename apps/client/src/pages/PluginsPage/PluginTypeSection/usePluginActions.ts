import { useCallback, useState } from 'react';

import { MyPlugin, MyPluginData } from '../../../api/me/plugins';
import { Plugin, PluginSchema, PluginType } from '../../../api/plugins';
import useMyPlugins from '../../../hooks/useMyPlugins';
import usePlugins from '../../../hooks/usePlugins';

const usePluginActions = (pluginType: PluginType) => {
  const plugins = usePlugins().data?.[pluginType];
  const { remove } = useMyPlugins();
  const [selectedPlugin, setSelectedPlugin] = useState<Plugin>();
  const [editingMyPlugin, setEditingMyPlugin] = useState<[PluginSchema, MyPluginData]>();

  const handleAddMyPlugin = useCallback(() => {
    if (selectedPlugin) {
      setEditingMyPlugin([
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

  const handleEditMyPluginFinished = useCallback(() => {
    setEditingMyPlugin(undefined);
  }, []);

  const handleMyPluginEdit = useCallback(
    (plugin: MyPlugin) => {
      const pluginSchema = plugins?.find((p) => p.name === plugin.name)?.schema;
      if (pluginSchema) {
        setEditingMyPlugin([pluginSchema, plugin]);
      }
    },
    [plugins],
  );

  const handleMyPluginDelete = useCallback(
    (plugin: MyPlugin) => {
      if (window.confirm(`Are you sure you want to delete ${plugin.label}?`)) {
        remove(plugin.id);
      }
    },
    [remove],
  );

  return {
    plugins,
    selectedPlugin,
    setSelectedPlugin,
    editingMyPlugin,
    handleAddMyPlugin,
    handleEditMyPluginFinished,
    handleMyPluginEdit,
    handleMyPluginDelete,
  };
};

export default usePluginActions;
