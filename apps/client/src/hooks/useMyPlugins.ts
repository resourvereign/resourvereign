import {
  MyPlugin,
  MyPluginCreateInput,
  MyPluginUpdateInput,
  createMyPlugin,
  listMyPlugins,
  removeMyPlugin,
  updateMyPlugin,
} from '../api/me';
import { itemsStoreFactory } from '../stores/itemsStore';

import createDataHook from './useData';

const myPluginsStore = itemsStoreFactory<MyPlugin>({});

const useMyPlugins = createDataHook<MyPlugin, MyPluginCreateInput, MyPluginUpdateInput>({
  key: 'myPlugins',
  store: myPluginsStore,
  fetcher: listMyPlugins,
  creator: createMyPlugin,
  updater: updateMyPlugin,
  remover: removeMyPlugin,
});

export default useMyPlugins;
