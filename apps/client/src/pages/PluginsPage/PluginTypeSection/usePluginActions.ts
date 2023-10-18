import { useCallback, useState } from 'react';

import { UserPlugin, UserPluginData } from '../../../api/me/plugins';
import { Plugin, PluginSchema, PluginType } from '../../../api/plugins';
import usePlugins from '../../../hooks/usePlugins';
import useUserPlugins from '../../../hooks/useUserPlugins';

const usePluginActions = (pluginType: PluginType) => {
  const plugins = usePlugins().data?.[pluginType];
  const { remove } = useUserPlugins();
  const [selectedPlugin, setSelectedPlugin] = useState<Plugin>();
  const [editingUserPlugin, setEditingUserPlugin] = useState<[PluginSchema, UserPluginData]>();

  const onUserPluginCreate = useCallback(() => {
    if (selectedPlugin) {
      setEditingUserPlugin([
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

  const onUserPluginEditFinish = useCallback(() => {
    setEditingUserPlugin(undefined);
  }, []);

  const onUserPluginEdit = useCallback(
    (plugin: UserPlugin) => {
      const pluginSchema = plugins?.find((p) => p.name === plugin.name)?.schema;
      if (pluginSchema) {
        setEditingUserPlugin([pluginSchema, plugin]);
      }
    },
    [plugins],
  );

  const onUserPluginDelete = useCallback(
    (plugin: UserPlugin) => {
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
    editingUserPlugin,
    onUserPluginCreate,
    onUserPluginEditFinish,
    onUserPluginEdit,
    onUserPluginDelete,
  };
};

export default usePluginActions;
