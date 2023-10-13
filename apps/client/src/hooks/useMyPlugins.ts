import createCrudHook from '@slangy/react/hooks/createCrudHook.js';
import createCrudStore from '@slangy/react/stores/createCrudStore.js';

import {
  MyPlugin,
  PluginType,
  createMyPlugin,
  listMyPlugins,
  removeMyPlugin,
  updateMyPlugin,
} from '../api/me/plugins';

const myPluginsStore = createCrudStore<MyPlugin>();

const useMyPlugins = createCrudHook({
  extra: (plugins) => ({
    byType: Object.values(PluginType).reduce(
      (acc, type) => ({
        ...acc,
        [type]: plugins.filter((plugin) => plugin.type === type),
      }),
      {} as Record<PluginType, MyPlugin[]>,
    ),
  }),
  store: myPluginsStore,
  read: listMyPlugins,
  create: createMyPlugin,
  update: updateMyPlugin,
  remove: removeMyPlugin,
});

export default useMyPlugins;
