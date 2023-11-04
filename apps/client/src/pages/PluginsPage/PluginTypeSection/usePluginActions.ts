import { useCallback, useState } from 'react';

import {
  IntegrationUserPluginData,
  NotificationsUserPluginData,
  SchedulingUserPluginData,
  UserPlugin,
  UserPluginData,
} from '../../../api/me/plugins';
import { Plugin, PluginSchema, PluginType } from '../../../api/plugins';
import usePlugins from '../../../hooks/usePlugins';
import useUserPlugins from '../../../hooks/useUserPlugins';

const getDefaultUserPlugin = (plugin: Plugin): UserPluginData => {
  const values = {
    type: plugin.type,
    name: plugin.name,
    label: '',
    config: {},
  };

  switch (plugin.type) {
    case PluginType.Integration:
      return {
        ...values,
        color: Math.floor(Math.random() * 16777215).toString(16),
        addons: [],
      } as IntegrationUserPluginData;
    case PluginType.Notifications:
      return values as NotificationsUserPluginData;
    case PluginType.Scheduling:
      return values as SchedulingUserPluginData;
  }
};

const usePluginActions = (pluginType: PluginType) => {
  const plugins = usePlugins().data?.[pluginType];
  const { remove } = useUserPlugins();
  const [selectedPlugin, setSelectedPlugin] = useState<Plugin>();
  const [editingUserPlugin, setEditingUserPlugin] = useState<[PluginSchema, UserPluginData]>();

  const onUserPluginCreate = useCallback(() => {
    if (selectedPlugin) {
      setEditingUserPlugin([selectedPlugin.schema, getDefaultUserPlugin(selectedPlugin)]);
    }
  }, [selectedPlugin]);

  const onUserPluginEditFinish = useCallback(() => {
    setEditingUserPlugin(undefined);
  }, []);

  const onUserPluginEdit = useCallback(
    (plugin: UserPluginData) => {
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
