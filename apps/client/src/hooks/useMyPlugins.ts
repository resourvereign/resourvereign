import {
  MyPlugin,
  PluginType,
  createMyPlugin,
  listMyPlugins,
  removeMyPlugin,
  updateMyPlugin,
} from '../api/me/plugins';
import { itemsStoreFactory } from '../stores/itemsStore';

import createDataHook from './useData';

const myPluginsStore = itemsStoreFactory<MyPlugin>({});

const useMyPlugins = createDataHook({
  extraPropertiesFactory: (plugins) => ({
    resources: plugins.filter((plugin) => plugin.type === PluginType.Resource),
  }),
  key: 'myPlugins',
  store: myPluginsStore,
  fetcher: listMyPlugins,
  creator: createMyPlugin,
  updater: updateMyPlugin,
  remover: removeMyPlugin,
});

export default useMyPlugins;
