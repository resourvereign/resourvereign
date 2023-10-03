import createFetchHook from '@slangy/react/hooks/createFetchHook.js';

import { listPlugins } from '../api/plugins';

const usePlugins = createFetchHook({
  fetcher: listPlugins,
  swrKey: 'listPlugins',
  dataKey: 'plugins',
  defaultData: [],
});

export default usePlugins;
