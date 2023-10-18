import createCrudHook from '@slangy/react/hooks/createCrudHook.js';
import createCrudStore from '@slangy/react/stores/createCrudStore.js';

import {
  PluginType,
  UserPlugin,
  createUserPlugin,
  listUserPlugins,
  removeUserPlugin,
  updateUserPlugin,
} from '../api/me/plugins';

const pluginsStore = createCrudStore<UserPlugin>();

const useUserPlugins = createCrudHook({
  extra: (plugins) => ({
    byType: Object.values(PluginType).reduce(
      (acc, type) => ({
        ...acc,
        [type]: plugins.filter((plugin) => plugin.type === type),
      }),
      {} as Record<PluginType, UserPlugin[]>,
    ),
  }),
  store: pluginsStore,
  read: listUserPlugins,
  create: createUserPlugin,
  update: updateUserPlugin,
  remove: removeUserPlugin,
});

export default useUserPlugins;
