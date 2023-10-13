import { PluginType } from '@resourvereign/common/models/plugin.js';
import createFetchHook from '@slangy/react/hooks/createFetchHook.js';

import { listPlugins } from '../api/plugins';

const usePlugins = createFetchHook({
  fetcher: listPlugins,
  swrKey: 'listPlugins',
  transform: (data) => {
    const pluginByType = Object.values<PluginType>(PluginType).reduce(
      (acc, pluginType) => ({
        ...acc,
        [pluginType]: [],
      }),
      {} as Record<PluginType, NonNullable<typeof data>>,
    );

    return (data ?? ([] as NonNullable<typeof data>)).reduce(
      (acc, plugin) => ({
        ...acc,
        [plugin.type]: [...acc[plugin.type], plugin],
      }),
      pluginByType,
    );
  },
});

export default usePlugins;
